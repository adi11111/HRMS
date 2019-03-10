using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HRMS.Core.Services;
using HRMS.Core.Entities.Foundation;
using HRMS.Core.Data;
using HRMS.Core.Entities;
using System.Dynamic;
using System.Configuration;
//using HRMS.Services.Services;

namespace HRMS.Services.Services
{
    public class HomeService : BaseService<EmployeeMaster>, IHomeService
    {
        IUnitOfWork _uow;
        public HomeService(IUnitOfWork _uow) : base(_uow)
        {
            this._uow = _uow;
        }
        public dynamic GetAdminHomeDetail()
        {
            dynamic data = new ExpandoObject();
            var _employees = _uow.Repository<EmployeeMaster>().Get(e => e.IsDeleted == false ).ToList();
            if (_employees != null)
            {
                data.TotalEmployees = _employees.Count();
                data.TotalMales = _employees.Count(x => x.Gender.ToLower().Equals("male"));
               // string _totalMalesPercentage = ((float.Parse(data.TotalMales) / float.Parse(data.TotalEmployees)) * 100) + "%";
                data.TotalMalesPercentage = Convert.ToInt32( ((Convert.ToDouble(data.TotalMales) / Convert.ToDouble(data.TotalEmployees)) * 100)) + "%";
                data.TotalFemales = _employees.Count(x => x.Gender.ToLower().Equals("female"));
                data.TotalFemalesPercentage = Convert.ToInt32(((Convert.ToDouble(data.TotalFemales) / Convert.ToDouble(data.TotalEmployees)) * 100)) + "%";
                data.TotalActive = _employees.Count(x => x.Status.ToLower().Equals("active"));
                data.TotalActivePercentage = Convert.ToInt32(((Convert.ToDouble(data.TotalActive) / Convert.ToDouble(data.TotalEmployees)) * 100)) + "%";
                data.TotalInActive = _employees.Count(x => x.Status.ToLower().Equals("inactive"));
                data.TotalInActivePercentage = Convert.ToInt32(((Convert.ToDouble(data.TotalInActive) / Convert.ToDouble(data.TotalEmployees)) * 100)) + "%";
            }
            //var _leaveStatus = _uow.Repository<LeaveStatus>().
            //    Get(ls => ls.IsDeleted == false).ToList();
            var _approvedLeaveStatusID = Convert.ToInt32( ConfigurationManager.AppSettings["ApprovedLeaveStatusID"]);
            var _rejectedLeaveStatusID = Convert.ToInt32(ConfigurationManager.AppSettings["RejectedLeaveStatusID"]);
            //var _pendingLeaveStatusID = _leaveStatus.Where(ls => ls.LeaveStatusName.ToLower().Equals("pending")).Select(x => x.LeaveStatusID).FirstOrDefault();
            var _leaves = _uow.Repository<Leave>().Get(l => l.IsDeleted == false && (l.FromDate.Year == DateTime.Now.Year || l.ToDate.Year == DateTime.Now.Year)).ToList();
            if (_leaves != null)
            {
               // data.TotalLeaves = 
                data.TotalLeaveApplied = _leaves.GroupBy(l => l.EmployeeID).Select(s => s.FirstOrDefault()).Count();
                //data.TotalPendingLeaves = data.TotalLeaves - _leaves.Where(l=> l.LeaveStatusID != _approvedLeaveStatusID && l.LeaveStatusID != _rejectedLeaveStatusID).Count();
                //data.TotalPendingLeavesPercentage = (data.TotalPendingLeaves / data.TotalEmployees * 100) + "%";

                //data.TotalLeavesPercentage = (data.TotalLeaves / data.TotalEmployees * 100) + "%";
            }
            data.Branches = _employees.Where(x => x.IsDeleted == false)
            .GroupBy(e => e.Country.CountryName,
            e => e.EmployeeID,
             (name, total) => new { TotalEmployees = total.Count(), BranchName = name, });
            var _appointments = _uow.Repository<Appointment>().Get(a => a.IsDeleted == false && a.AppointmentDate.Year == DateTime.Now.Year)
            .GroupBy(e => e.AppointmentDate,
               e => e.AppointmentID,
            (date, total) => new { TotalAppointments = total.Count(), Month = date.Month, });
            data.Appointments = Enumerable.Range(1, 12)
            .Select(x => new
            {
                TotalAppointments = _appointments.Where(a => a.Month == x).Select(a => a.TotalAppointments).Sum(),
                Month = x
            });

            var _documents = _uow.Repository<DocumentDetail>().Get(a => a.IsDeleted == false);

            var _issueDocuments = _documents.GroupBy(e => e.DocumentIssueDate,
            e => e.DocumentID,
            (date, total) => new { TotalIssueDocuemnts = total.Count(), Month = date.Month, });

            var _expiryDocuments = _documents.Where(d=> d.ExpiryDate.Year == DateTime.Now.Year).GroupBy(e => e.ExpiryDate,
            e => e.DocumentID,
            (date, total) => new { TotalExpiryDocuemnts = total.Count(), Month = date.Month, });

            data.IssueDocuments = Enumerable.Range(1, 12)
            .Select(x => new
            {
                TotalIssueDocuments = _issueDocuments.Where(a => a.Month == x).Select(a => a.TotalIssueDocuemnts).FirstOrDefault(),
                Month = x
            });

            data.ExpiryDocuments = Enumerable.Range(1, 12)
            .Select(x => new
            {
                TotalExpiryDocuments = _expiryDocuments.Where(a => a.Month == x).Select(a => a.TotalExpiryDocuemnts).FirstOrDefault(),
                Month = x
            });


            return data;
        }
        public dynamic GetHomeDetail(int userID)
        {
            dynamic data = new ExpandoObject();
            var _user = _uow.Repository<UserMaster>().Get(u => u.IsDeleted == false && u.UserID == userID).FirstOrDefault();
            if (_user != null)
            {
                var _leaveStatus = _uow.Repository<LeaveStatus>().
                Get(ls => ls.IsDeleted == false).ToList();
                var _absentAttendenceStatusID = Convert.ToInt32(ConfigurationManager.AppSettings["AbsentAttendenceStatusID"]);

                var _approvedLeaveStatusID = Convert.ToInt32( ConfigurationManager.AppSettings["ApprovedLeaveStatusID"]);
                var _rejectedLeaveStatusID = Convert.ToInt32(ConfigurationManager.AppSettings["RejectedLeaveStatusID"]);

                var _annualLeaveTypeID = Convert.ToInt32(ConfigurationManager.AppSettings["AnnualLeaveTypeID"]);
                var _sickLeaveTypeID = Convert.ToInt32(ConfigurationManager.AppSettings["SickLeaveTypeID"]);
                var _examLeaveTypeID = Convert.ToInt32(ConfigurationManager.AppSettings["ExamLeaveTypeID"]);
                var _hajjLeaveTypeID = Convert.ToInt32(ConfigurationManager.AppSettings["HajjLeaveTypeID"]);
                var _halfDayLeaveTypeID = Convert.ToInt32(ConfigurationManager.AppSettings["HalfDayLeaveTypeID"]);
                var _leaveTypes = _uow.Repository<LeaveType>().Get(lt=> lt.IsDeleted == false).ToList();
                //var _pendingLeaveStatusID = _leaveStatus.Where(ls => ls.LeaveStatusID != _approvedLeaveStatusID && ls.LeaveStatusID != _rejectedLeaveStatusID).Select(x => x.LeaveStatusID).FirstOrDefault();
                var _leaves = _uow.Repository<Leave>()
                .Get(l => l.IsDeleted == false && (l.FromDate.Year == DateTime.Now.Year || l.ToDate.Year == DateTime.Now.Year) && l.EmployeeID == _user.EmployeeID).ToList();
                //var _attendence = _uow.Repository<Attendence>().Get(x => x.EmployeeID == _user.EmployeeID && x.IsDeleted == false && x.AttendenceDate.Year == DateTime.Now.Year).ToList() ;
                //var _publicHolidays = _uow.Repository<PublicHoliday>().Get(p => p.IsDeleted == false && p.Date.Year == DateTime.Now.Year && p.CompanyID == _user.Employee.CompanyID).Count;
                //var _totalDaysPresent = _attendence.Where(a => a.AttendenceStatus.AttendenceStatusID == _absentAttendenceStatusID).Count();
                //var _totalWeekends = GetNumberOfWeekendDays(new DateTime(DateTime.Now.Year, 1, 1), new DateTime(DateTime.Now.Year, 12, 1).AddMonths(1).AddDays(-1));
                //var _totalAbsentDays = GetDaysInYear(DateTime.Now.Year) - (_totalDaysPresent + _publicHolidays + _totalWeekends.Count);

                // getting salary without checking the increment due date.
                var _salary = _uow.Repository<Salary>().Get(s => s.IsDeleted == false && s.EmployeeID == _user.EmployeeID && s.IsInitial == false).FirstOrDefault();
                var _graduitySetting = _uow.Repository<GraduitySetting>().Get(g => g.IsDeleted == false && g.CompanyID == _user.Employee.CompanyID).FirstOrDefault();
                float _graduity = CalculateGratuity(_graduitySetting, _salary, _salary.Basic, DateTime.Now.Year, DateTime.Now.Month);
                // if(_graduitySetting != null && _salary != null)
                //{
                //    var _oneDaySalary = (_salary.TotalSalary / 365) * 12;
                //    if (_graduitySetting.IsBasicOnly)
                //    {
                //        _oneDaySalary = (_salary.Basic / 365) * 12;
                //    }
                //    else 
                //    {
                //        _oneDaySalary = (_salary.TotalSalary / 365) * 12;
                //    }
                //    int _years = Convert.ToInt32( (DateTime.Now - _user.Employee.JoiningDate).Days / 365.25m);
                //    switch(_years) 
                //    {
                //        case 0:
                //        case 1:
                //            {
                //                 _graduity = _oneDaySalary * _years * _graduitySetting.Year1;
                //                break;
                //            }
                //        case 2:
                //            {
                //                _graduity = _oneDaySalary * _years * _graduitySetting.Year2;
                //                break;
                //            }

                //        case 3:
                //            {
                //                _graduity = _oneDaySalary * _years * _graduitySetting.Year3;
                //                break;
                //            }

                //        case 4:
                //            {
                //                _graduity = _oneDaySalary * _years * _graduitySetting.Year4;
                //                break;
                //            }

                //        case 5:
                //            {
                //                _graduity = _oneDaySalary * _years * _graduitySetting.Year5;
                //                break;
                //            }

                //        default:
                //            {
                //                _graduity = (_oneDaySalary * 5 * _graduitySetting.Year5) + (_oneDaySalary * (_years - 5) * _graduitySetting.Year5);
                //                break;
                //            }
                //    }
                //}
                if (_leaves != null)
                {
                    if (_leaves.Count > 0)
                    {
                        var _previousYearLeavesPending = (_leaves[0].EmployeeMaster.MigratedLeaveBalance);
                        float _daysInYear = 365;
                        data.TotalCurrentLeavesPending = _previousYearLeavesPending + GetNumberOfWorkingDays(new DateTime(DateTime.Now.Year,1,1),DateTime.Now) * (22 / _daysInYear); 
                        data.TotalAnnualLeavesPending = _leaves[0].EmployeeMaster.MigratedLeaveBalance;
                        data.TotalSickLeavesPending = _leaveTypes.Where(lt=> lt.LeaveTypeID == _sickLeaveTypeID).Select(x=> x.TotalLeaveDays).FirstOrDefault() - CalculateLeaveByYear(_leaves.Where(l=> l.LeaveTypeID == _sickLeaveTypeID && l.LeaveStatusID == _approvedLeaveStatusID).ToList(), DateTime.Now.Year);
                        var _totalLeaveTaken = _leaves.Where(l => l.LeaveTypeID == _annualLeaveTypeID && l.LeaveStatusID == _approvedLeaveStatusID && (l.FromDate.Year == DateTime.Now.Year || l.ToDate.Year == DateTime.Now.Year)).ToList();
                        data.TotalLeavesTaken = _totalLeaveTaken.Sum(l => l.TotalLeaveDays);
                        data.TotalCurrentLeavesPending = data.TotalCurrentLeavesPending - data.TotalLeavesTaken;
                        //data.TotalLeavesTaken = CalculateLeaveByYear(_leaves.Where(l => l.LeaveTypeID == _annualLeaveTypeID && l.LeaveStatusID == _approvedLeaveStatusID).ToList(), DateTime.Now.Year);
                        //data.TotalLeavesApplied = CalculateLeaveByYear(_leaves.Where(l => l.LeaveTypeID == _annualLeaveTypeID).ToList(), DateTime.Now.Year);
                        data.TotalLeavesApplied = _leaves.Where(l => l.LeaveTypeID == _annualLeaveTypeID && (l.FromDate.Year == DateTime.Now.Year || l.ToDate.Year == DateTime.Now.Year)).Sum(l => l.TotalLeaveDays);
                        data.TotalDaysAbsent = _leaves.Where(l => l.LeaveStatusID == _approvedLeaveStatusID && (l.FromDate.Year == DateTime.Now.Year || l.ToDate.Year == DateTime.Now.Year)).Sum(l => l.TotalLeaveDays);
                        //data.TotalDaysAbsent = _uow.Repository<Attendence>().Get(p=> p.IsDeleted == false && p.EmployeeID == _user.EmployeeID && p.Date.Year == DateTime.Now.Year)
                        //.Sum(p => p.TotalAbsentDays);
                        data.TotalGraduity = _graduity;
                        //data.TotalAnnualLeavesPendingPercentage = (data.TotalLeaveBalance / _leaves.Select(x => x.EmployeeMaster.MigratedLeaveBalance).FirstOrDefault() * 100) + "%";
                        //data.TotalSickLeavesPendingPercentage = (data.TotalDaysOnLeave / (_totalDaysPresent + data.TotalDaysOnLeave) * 100) + "%";
                        //data.TotalLeaveTakenPercentage = (_totalDaysPresent / (_totalDaysPresent + data.TotalDaysOnLeave) * 100) + "%";
                        //data.TotalGraduityPercentage = (data.TotalLeaveApproved / _leaves.Count() * 100) + "%";
                        //data.TotalLeaveAppliedPercentage = (data.TotalLeavePending / _leaves.Count() * 100) + "%";
                    }
                }
                //var _leavesMonthly = _leaves.Where(x => (x.FromDate.Month == DateTime.Now.Month || x.ToDate.Month == DateTime.Now.Month))
                //.GroupBy(e => e.FromDate.Month,
                //e => e.EmployeeID,
                // (name, total) => new { TotalLeaves = total.Count(), Month = name, });
                //data.LeavesMonthly = Enumerable.Range(1, 12)
                //.Select(x => new
                //{
                //    TotalLeaves = _leavesMonthly.Where(a => a.Month == x).Select(a => a.TotalLeaves).FirstOrDefault(),
                //    Month = x
                //});
                data.TotalEmployees = _uow.Repository<EmployeeMaster>().Get(e => e.IsDeleted == false && e.CompanyID == _user.Employee.CompanyID).ToList();
                data.TotalLeaveApplied = _uow.Repository<Leave>().Get()
                .Where(l => l.FromDate.Year == DateTime.Now.Year && l.ToDate.Year == DateTime.Now.Year && l.IsDeleted == false 
                && l.LeaveTypeID == _annualLeaveTypeID && l.EmployeeMaster.CompanyID == _user.Employee.CompanyID)
                .GroupBy(l => l.EmployeeID).Select(s => s.FirstOrDefault()).Count();

                var _leavesYearly = _leaves.Where(l=> l.LeaveStatusID == _approvedLeaveStatusID)
                .GroupBy(e => e.FromDate.Month,
                e => e.TotalLeaveDays,
                 (name, total) => new { TotalLeaves = total.Sum(), Month = name, });
                data.LeavesYearly = Enumerable.Range(1, 12)
                .Select(x => new
                {
                    TotalLeaves = _leavesYearly.Where(a => a.Month == x).Select(a => a.TotalLeaves).FirstOrDefault(),
                    Month = x
                });

                var _totalParticipants = _uow.Repository<Participant>().Get(p => p.IsDeleted == false &&  p.EmployeeID == _user.EmployeeID).ToList();
                var _appointmentParticipants = _totalParticipants
                .Select(p => p.AppointmentID);
                var _documentParticipants = _totalParticipants
                .Select(p => p.DocumentID);
                var _appointments = _uow.Repository<Appointment>().Get(a => a.IsDeleted == false && ( _appointmentParticipants.Contains(a.AppointmentID) || a.EmployeeID == _user.EmployeeID) && a.AppointmentDate.Year == DateTime.Now.Year)
                .GroupBy(e => e.AppointmentDate,
               e => e.AppointmentID,
                (date, total) => new { TotalAppointments = total.Count(), Month = date.Month, });
                data.Appointments = Enumerable.Range(1, 12)
                .Select(x => new
                {
                    TotalAppointments = _appointments.Where(a => a.Month == x).Select(a => a.TotalAppointments).Sum(),
                    Month = x
                });

                var _documents = _uow.Repository<DocumentDetail>().Get(a => a.IsDeleted == false && ( a.ProcessOwnerID == _user.EmployeeID || a.EmployeeID == _user.EmployeeID)
                || _documentParticipants.Contains(a.DocumentID));

                var _issueDocuments = _documents.GroupBy(e => e.DocumentIssueDate,
                e => e.DocumentID,
                (date, total) => new { TotalIssueDocuemnts = total.Count(), Month = date.Month, });

                var _expiryDocuments = _documents.Where(d=> d.ExpiryDate.Year == DateTime.Now.Year).GroupBy(e => e.ExpiryDate,
                e => e.DocumentID,
                (date, total) => new { TotalExpiryDocuemnts = total.Count(), Month = date.Month, });

                data.IssueDocuments = Enumerable.Range(1, 12)
                .Select(x => new
                {
                    TotalIssueDocuments = _issueDocuments.Where(a => a.Month == x).Select(a => a.TotalIssueDocuemnts).FirstOrDefault(),
                    Month = x
                });

                data.ExpiryDocuments = Enumerable.Range(1, 12)
                .Select(x => new
                {
                    TotalExpiryDocuments = _expiryDocuments.Where(a => a.Month == x).Select(a => a.TotalExpiryDocuemnts).FirstOrDefault(),
                    Month = x
                });
            }

            return data;
        }
        public int CalculateLeaveByYear(List<Leave> leaves,int year)
        {
            var _leavesCount = 0;
            var _holidays = 0;
            for (int i = 0; i < leaves.Count; i++)
            {
                _holidays += GetNumberOfWeekendDays(leaves[i].FromDate,leaves[i].ToDate).Count;
            }

            //var _otherMonthsLeavesCount = 0;
            //for (int k = 0; k < leaves.Count; k++)
            //{
            //    if (leaves[k].FromDate.Year != year)
            //    {
            //        _otherMonthsLeavesCount += (new DateTime(year, 1, 1) - leaves[k].FromDate).Days;
            //    }
            //    if (leaves[k].ToDate.Year != year)
            //    {
            //        _otherMonthsLeavesCount += (leaves[k].ToDate - new DateTime(year, 1, 1)).Days;
            //    }
            //    _leavesCount += ((leaves[k].ToDate - leaves[k].FromDate).Days + 1);
            //}
            //_leavesCount = _leavesCount - _otherMonthsLeavesCount;
            return _leavesCount;

        }
    }
}
