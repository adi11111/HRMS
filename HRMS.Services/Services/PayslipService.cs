using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HRMS.Core.Services;
using HRMS.Core.Entities.Foundation;
using HRMS.Core.Data;
using HRMS.Core.Entities;
using System.Configuration;

namespace HRMS.Services.Services
{
    public class PayslipService : BaseService<PaySlip>, IPayslipService
    {
        IUnitOfWork _uow;
        public PayslipService(IUnitOfWork _uow) : base(_uow)
        {
            this._uow = _uow;
        }
        public List<PaySlip> GenerateReport(int month,int year,int companyId)
        {
            var _previousPayslip = _uow.Repository<PaySlip>().Get(p=> p.IsDeleted == false && p.Date.Month == month && p.Date.Year == year).ToList();
            var _salaries = _uow.Repository<Salary>().Get(s => s.IsDeleted == false && s.IsInitial == false && s.EmployeeMaster.CompanyID == companyId).ToList();
            var _deductionsOrAddition = _uow.Repository<Deduction>().Get(d => d.IsDeleted == false && d.StartDate.Month <= month && d.EndDate.Month >= month && d.EmployeeMaster.CompanyID == companyId
            && (d.StartDate.Year == year || d.EndDate.Year == year)).ToList();
          
            var _increments = _uow.Repository<Increment>().Get(d => d.IsDeleted == false && d.IncrementDate.Month >= month && d.EmployeeMaster.CompanyID == companyId
             && d.IncrementDate.Year == year).ToList();
            var _attendences = _uow.Repository<Attendence>().Get(a => a.IsDeleted == false && a.AttendenceDate.Month == month && a.EmployeeMaster.CompanyID == companyId 
            && a.AttendenceDate.Year == year).ToList();
            var _graduitySetting = _uow.Repository<GraduitySetting>().Get(g => g.IsDeleted == false && g.CompanyID == companyId).FirstOrDefault();
            var _payslips = new List<PaySlip>();
            if (_salaries != null && _deductionsOrAddition != null && _attendences != null)
            {
                if (_attendences.Count > 0)
                {
                    var _additions = _deductionsOrAddition.Where(da => da.IsAddition == true);
                    var _deductions = _deductionsOrAddition.Where(da => da.IsAddition == false);
                    for (int i = 0; i < _salaries.Count; i++)
                    {
                        if (_previousPayslip.Count(p => p.EmployeeID == _salaries[i].EmployeeID) == 0)
                        {
                            _salaries[i].OtherNumber = _salaries[i].OtherNumber ?? 0;
                            var _basic = _salaries[i].Basic;
                            var _housing = _salaries[i].Housing;
                            var _telephone = _salaries[i].Telephone;
                            var _transport = _salaries[i].Transport;
                            var _totalSalary = _salaries[i].TotalSalary;
                            var _otherNumber = _salaries[i].OtherNumber;
                            string _otherText = _salaries[i].OtherText;
                            string _additionText = "";
                            float? _additionNumber = 0;
                            var _approvedLeavesCount = 0;
                            var _totalAbsents = 0;
                            var _employeeId = _salaries[i].EmployeeID;
                            var _attendence = _attendences.Where(a => a.EmployeeID == _employeeId);
                            var _absentAttendenceStatusID = Convert.ToInt32(ConfigurationManager.AppSettings["AbsentAttendenceStatusID"]);
                            var _present = _attendence.Where(a => a.AttendenceStatus.AttendenceStatusID != _absentAttendenceStatusID).Count();
                            var _absents = _attendence.Where(a => a.AttendenceStatus.AttendenceStatusID == _absentAttendenceStatusID).ToList();
                            var _totalWorkingDays = GetNumberOfWorkingDays(new DateTime(year, month, 1), new DateTime(year, month, 1).AddMonths(1).AddDays(-1));
                            var _approvedLeaveStatusID = Convert.ToInt32(ConfigurationManager.AppSettings["ApprovedLeaveStatusID"]);
                            var _approvedLeaves = _uow.Repository<Leave>().Get(l => l.EmployeeID == _employeeId && l.LeaveStatus.LeaveStatusID == _approvedLeaveStatusID && l.IsDeleted == false
                            && (l.FromDate.Month == month || l.ToDate.Month == month) && (l.FromDate.Year == year || l.ToDate.Year == year));
                            //_approvedLeaves[0].fr
                            var _otherMonthsLeavesCount = 0;
                            for (int k = 0; k < _approvedLeaves.Count; k++)
                            {
                                if (_approvedLeaves[k].FromDate.Month != month)
                                {
                                    _otherMonthsLeavesCount += (new DateTime(year, month, 1) - _approvedLeaves[k].FromDate).Days;
                                }
                                if (_approvedLeaves[k].FromDate.Month != month)
                                {
                                    _otherMonthsLeavesCount += (_approvedLeaves[k].ToDate - new DateTime(year, month, 1)).Days;
                                }
                                _approvedLeavesCount += ((_approvedLeaves[k].ToDate - _approvedLeaves[k].FromDate).Days + 1);
                            }
                            _approvedLeavesCount = _approvedLeavesCount - _otherMonthsLeavesCount;
                            //if (_totalWorkingDays != (_present + _absents.Count))
                            //{
                            //    _present += (_totalWorkingDays - (_present + _absents.Count));
                            //}

                            // if the weekend is comping between employee leaves then we will consider it as leave day.
                            var sorted = _absents.OrderBy(ab => ab.AttendenceDate);
                            var split = sorted.PartitionByPredicate((x, y) => (y.AttendenceDate.Date - x.AttendenceDate.Date).TotalDays > 1).ToList();

                            for (int k = 0; k < split.Count; k++)
                            {
                                if (split[k].Count == 2)
                                {
                                    if (split[k].First().AttendenceDate.DayOfWeek != DayOfWeek.Friday && split[k].Last().AttendenceDate.DayOfWeek != DayOfWeek.Saturday)
                                    {
                                        _totalAbsents += 2;
                                    }
                                }
                                else
                                {
                                    if (split[k].First().AttendenceDate.DayOfWeek != DayOfWeek.Friday && split[k].Last().AttendenceDate.DayOfWeek != DayOfWeek.Saturday)
                                    {
                                        _totalAbsents += split[k].Count;
                                    }
                                    
                                }
                            }
                            // var middleDates = _absents.Zip(_absents.Skip(1),
                            //     (a, b) => (a.add((b - a).Ticks / 2)))
                            //.ToList();
                            var _deductionDetails = _deductions.Where(d => d.EmployeeID == _employeeId && d.IsDeleted == false)
                            .Select(d => d.DeductionDetail.FirstOrDefault(dd => dd.DeductionDate.Month == month && dd.IsPayslipIssued == false)).ToList<DeductionDetail>();
                            var _additionDetails = _additions.Where(d => d.EmployeeID == _employeeId && d.IsDeleted == false)
                           .Select(d => d.DeductionDetail.FirstOrDefault(dd => dd.DeductionDate.Month == month && dd.IsPayslipIssued == false)).ToList<DeductionDetail>();
                            var _increment = _increments.Where(d => d.EmployeeID == _employeeId && d.IncrementDate.Month == month).LastOrDefault();
                            var _publicHolidays = _uow.Repository<PublicHoliday>().Get(p => p.IsDeleted == false && p.Date.Month == month && p.Date.Year == year && p.CompanyID == companyId).Count;

                            _totalAbsents = _totalAbsents - (_publicHolidays + _approvedLeavesCount);
                            // if the increment due date is beyond then current month then we will deduct it from the salary
                            if (_increment != null)
                            {
                                _basic = _basic + _increments.Where(x => x.EmployeeID == _employeeId).Sum(s => s.Basic);
                                _housing = _housing + _increments.Where(x => x.EmployeeID == _employeeId).Sum(s => s.Housing);
                                _telephone = _telephone + _increments.Where(x => x.EmployeeID == _employeeId).Sum(s => s.Telephone);
                                _transport = _transport + _increments.Where(x => x.EmployeeID == _employeeId).Sum(s => s.Transport);
                                _otherNumber = _salaries[i].OtherNumber + _increments.Where(x => x.EmployeeID == _employeeId).Sum(s => s.OtherNumber);
                                _totalSalary =  _basic + _housing + _telephone + _transport + float.Parse(_otherNumber.ToString());
                                var _inc = _increments.Where(x => x.EmployeeID == _employeeId).LastOrDefault();
                                if (_inc != null)
                                {
                                    _otherText = _inc.OtherText;
                                }

                            }
                            //var _abscentDays = _totalWorkingDays - (_publicHolidays + _approvedLeaves);
                            if (_totalAbsents > 0)
                            {
                                var _oneDaySalary = _totalSalary / DateTime.DaysInMonth(year, month); //(_totalSalary * 12) / 365;
                                var _totalSalaryDeduction = _totalAbsents * _oneDaySalary;
                                var _basicRatio = _basic / _totalSalary;
                                var _telephoneRatio = _telephone / _totalSalary;
                                var _transportRatio = _transport / _totalSalary;
                                var _housingRatio = _housing / _totalSalary;
                                float _otherRatio = 0;
                                if (_salaries[i].OtherNumber != 0 && _salaries[i].OtherNumber != null)
                                {
                                    _otherRatio = float.Parse(_salaries[i].OtherNumber.ToString()) / _salaries[i].TotalSalary;
                                }
                                _basic = _basic - (_basicRatio * _totalSalaryDeduction);
                                _housing = _housing - (_telephoneRatio * _totalSalaryDeduction);
                                _telephone = _telephone - (_housingRatio * _totalSalaryDeduction);
                                _transport = _transport - (_transportRatio * _totalSalaryDeduction);
                                _otherNumber = _otherNumber - (_otherRatio * _totalSalaryDeduction);
                                _totalSalary = _basic + _housing + _telephone + _transport + float.Parse(_otherNumber.ToString());
                            }
                            // if there is no attendnce then we will not process the salary for that employee
                            if (_attendence.Count() > 0)
                            {
                            // subtracting the deduction for the selected month from payslip
                                if (_deductionDetails != null)
                                {
                                    if (_deductionDetails.Count > 0)
                                    {
                                        if (_deductionDetails[0] != null)
                                        {

                                            for (int k = 0; k < _deductionDetails.Count; k++)
                                            {
                                                _basic = _basic - _deductionDetails[k].Basic;
                                                _housing = _housing - _deductionDetails[k].Housing;
                                                _telephone = _telephone - _deductionDetails[k].Telephone;
                                                _transport = _transport - _deductionDetails[k].Transport;
                                                _otherNumber = _salaries[i].OtherNumber - _deductionDetails[k].OtherNumber;
                                                _totalSalary = _basic + _housing + _telephone + _transport + float.Parse(_otherNumber.ToString());
                                                _otherText = _deductionDetails[k].OtherText ?? _deductionDetails[k].OtherText;
                                            }
                                        }
                                    }

                                }
                                // adding the addition for the selected month to payslip
                                if (_additionDetails != null)
                                {
                                    if (_additionDetails.Count > 0)
                                    {
                                        if (_additionDetails[0] != null)
                                        {

                                            for (int k = 0; k < _additionDetails.Count; k++)
                                            {
                                                _basic = _basic + _additionDetails[k].Basic;
                                                _housing = _housing + _additionDetails[k].Housing;
                                                _telephone = _telephone + _additionDetails[k].Telephone;
                                                _transport = _transport + _additionDetails[k].Transport;
                                                _additionNumber = _additionDetails[k].OtherNumber;
                                                _totalSalary = _basic + _housing + _telephone + _transport + float.Parse(_otherNumber.ToString()) + 
                                                float.Parse(_additionNumber.ToString());
                                                _additionText = _additionDetails[k].OtherText ?? _additionDetails[k].OtherText;
                                            }
                                        }
                                    }

                                }
                                float _graduity = CalculateGratuity(_graduitySetting,_salaries[i],_basic,year,month);
                                _payslips.Add(new PaySlip
                                {
                                    Basic = _basic,
                                    Housing = _housing,
                                    Telephone = _telephone,
                                    Transport = _transport,
                                    TotalSalary = _totalSalary,
                                    TotalDays = DateTime.DaysInMonth(year, month),
                                    TotalWorkingDays = _totalWorkingDays,
                                    TotalPublicHolidays = _publicHolidays,
                                    TotalWeekendDays = GetNumberOfWeekendDays(new DateTime(year, month, 1), new DateTime(year, month, 1).AddMonths(1).AddDays(-1)).Count(),
                                    TotalPresentDays = _present,
                                    TotalLeaveDays = _approvedLeavesCount,
                                    TotalAbsentDays = _totalAbsents,
                                    OtherNumber = float.Parse(_otherNumber.ToString()),
                                    OtherText = _otherText,
                                    AdditionNumber = _additionNumber,
                                    AdditionText = _additionText,
                                    Date = new DateTime(year, month, 1).AddMonths(1).AddDays(-1),
                                    EmployeeID = _salaries[i].EmployeeID,
                                    IsDeleted = false,
                                    Gratuity = _graduity
                                });
                            }
                        }
                    }
                }
            }
            return _payslips;
        }
        public bool ProcessPayslip(List<PaySlip> payslips, int month)
        {
            _uow.Repository<PaySlip>().AddRange(payslips);
            var _deductiondetails = _uow.Repository<DeductionDetail>().Get(dd => dd.IsDeleted == false && dd.IsPayslipIssued == false && dd.DeductionDate.Month == month).ToList();
            for (int i = 0; i < _deductiondetails.Count; i++)
            {
                _deductiondetails[i].IsPayslipIssued = true;
                _uow.Repository<DeductionDetail>().Update(_deductiondetails[i]);
            }
            _uow.Save();
            return true;
        }
       
    }
    public static class DateSequence 
    {
        public static IEnumerable<ICollection<T>> PartitionByPredicate<T>(this IEnumerable<T> seq, Func<T, T, bool> split)
        {
            var buffer = new List<T>();

            foreach (var x in seq)
            {
                if (buffer.Any() && split(buffer.Last(), x))
                {
                    yield return buffer;
                    buffer = new List<T>();
                }

                buffer.Add(x);
            }

            if (buffer.Any())
                yield return buffer;
        }
        
    }
}

