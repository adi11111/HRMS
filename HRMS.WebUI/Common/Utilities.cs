using AutoMapper;
using HRMS.Core.Entities;
using HRMS.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web;

namespace HRMS.WebUI.Common
{
    public static class Utilities
    {
        public static DataTable ConvertCSVtoDataTable(string strFile, bool isPath = false)
        {
            StreamReader sr = null;
            if (!isPath)
            {
                sr = new StreamReader(FileToMemoryStream(strFile));
            }
            else
            {
                sr = new StreamReader(strFile);
            }
            string[] headers = sr.ReadLine().Split(',');
            DataTable dt = new DataTable();
            for (int i = 0; i < headers.Length; i++)
            {
                dt.Columns.Add(i.ToString());
            }
            //foreach (string header in headers)
            //{
            //    if(!dt.Columns.Contains(header))
            //    dt.Columns.Add(header);
            //}
            while (!sr.EndOfStream)
            {
                string[] rows = Regex.Split(sr.ReadLine(), ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
                DataRow dr = dt.NewRow();
                for (int i = 0; i < headers.Length; i++)
                {
                    dr[i] = rows[i];
                }
                dt.Rows.Add(dr);
            }
            return dt;
        }

        public static MemoryStream FileToMemoryStream(string file)
        {
            byte[] bytes = Convert.FromBase64String(file);
            return new MemoryStream(bytes);
        }

        //public static void LoadInterfaces(List<HRMS.Core.Entities.Interface> interfaces)
        //{
        //    Interfaces.AccountType = interfaces.Where(i => i.InterfaceName.ToLower().Contains("accounttype")).Select(i=>i.InterfaceID).FirstOrDefault();
        //    Interfaces.Appointment = interfaces.Where(i => i.InterfaceName.ToLower().Contains("apointment")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.Attendence = interfaces.Where(i => i.InterfaceName.ToLower().Contains("attendence")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.AttendenceStatus = interfaces.Where(i => i.InterfaceName.ToLower().Contains("attendencestatus")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.Bank = interfaces.Where(i => i.InterfaceName.ToLower().Contains("bank")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.CompanyDocumentAccess = interfaces.Where(i => i.InterfaceName.ToLower().Contains("companydocumentacsess")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.Company = interfaces.Where(i => i.InterfaceName.ToLower().Contains("company")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.CompanyStatus = interfaces.Where(i => i.InterfaceName.ToLower().Contains("companystatus")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.CompanyType = interfaces.Where(i => i.InterfaceName.ToLower().Contains("companytype")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.Department = interfaces.Where(i => i.InterfaceName.ToLower().Contains("department")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.Designation = interfaces.Where(i => i.InterfaceName.ToLower().Contains("designation")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.DocumentCategory = interfaces.Where(i => i.InterfaceName.ToLower().Contains("documentcategtory")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.Document = interfaces.Where(i => i.InterfaceName.ToLower().Contains("document")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.DocumentType = interfaces.Where(i => i.InterfaceName.ToLower().Contains("documenttype")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.Employee = interfaces.Where(i => i.InterfaceName.ToLower().Contains("employee")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.Increment = interfaces.Where(i => i.InterfaceName.ToLower().Contains("increment")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.Interface = interfaces.Where(i => i.InterfaceName.ToLower().Contains("interface")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.Leave = interfaces.Where(i => i.InterfaceName.ToLower().Contains("leave")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.LeaveStatus = interfaces.Where(i => i.InterfaceName.ToLower().Contains("leavestatus")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.LeaveType = interfaces.Where(i => i.InterfaceName.ToLower().Contains("leavetype")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.Location = interfaces.Where(i => i.InterfaceName.ToLower().Contains("location")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.Nationality = interfaces.Where(i => i.InterfaceName.ToLower().Contains("nationality")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.Participant = interfaces.Where(i => i.InterfaceName.ToLower().Contains("participant")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.PaySlip = interfaces.Where(i => i.InterfaceName.ToLower().Contains("payslip")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.Region = interfaces.Where(i => i.InterfaceName.ToLower().Contains("region")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.Salary = interfaces.Where(i => i.InterfaceName.ToLower().Contains("salary")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.Setting = interfaces.Where(i => i.InterfaceName.ToLower().Contains("setting")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.ShareHolder = interfaces.Where(i => i.InterfaceName.ToLower().Contains("shareholder")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.Shift = interfaces.Where(i => i.InterfaceName.ToLower().Contains("shift")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.Staff = interfaces.Where(i => i.InterfaceName.ToLower().Contains("staff")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.UserRole = interfaces.Where(i => i.InterfaceName.ToLower().Contains("userrole")).Select(i => i.InterfaceID).FirstOrDefault();
        //    Interfaces.UserAccessDetail = interfaces.Where(i => i.InterfaceName.ToLower().Contains("useraccess")).Select(i => i.InterfaceID).FirstOrDefault();
        //}
        public static int GetInterfaceIdByName(string interfaceName)
        {
            return Interfaces.Where(i => i.InterfaceName.RemoveAllWhiteSpaces().ToLower()
            .Contains(interfaceName.ToLower()))
            .Select(i => i.InterfaceID).LastOrDefault();
        }
        public static List<HRMS.Core.Entities.Interface> Interfaces 
        {
            get
            {
                if (HttpContext.Current.Session["Interface"] != null)
                {
                    return Newtonsoft.Json.JsonConvert.DeserializeObject<List<HRMS.Core.Entities.Interface>>(HttpContext.Current.Session["Interface"].ToString());
                }
                return null;
            }
            set
            {
                if (value == null)
                {
                    HttpContext.Current.Session.Remove("Interface");
                }
                else
                {
                    HttpContext.Current.Session["Interface"] = Newtonsoft.Json.JsonConvert.SerializeObject(value);
                }
            }

        }
        public static List<HRMS.Core.Entities.UserAccessDetail> UserAccess
        {
            get
            {
                if(HttpContext.Current.Session["UserAccess"] != null)
                {
                   return Newtonsoft.Json.JsonConvert.DeserializeObject<List<HRMS.Core.Entities.UserAccessDetail>>(HttpContext.Current.Session["UserAccess"].ToString());
                }
                return null;
            }
            set
            {
                if(value == null)
                {
                    HttpContext.Current.Session.Remove("UserAccess");
                }
                else
                {
                    HttpContext.Current.Session["UserAccess"] = Newtonsoft.Json.JsonConvert.SerializeObject(value);
                }
            }
        }




        //public static class EventAccess
        //{

        //    public static string Add
        //    {
        //        get
        //        {
        //            return System.Configuration.ConfigurationManager.AppSettings["Add"];
        //        }
        //    }

        //    public static string Edit
        //    {
        //        get
        //        {
        //            return System.Configuration.ConfigurationManager.AppSettings["Edit"];
        //        }
        //    }

        //    public static string Delete
        //    {
        //        get
        //        {
        //            return System.Configuration.ConfigurationManager.AppSettings["Delete"];
        //        }
        //    }

        //    public static string View
        //    {
        //        get
        //        {
        //            return System.Configuration.ConfigurationManager.AppSettings["View"];
        //        }
        //    }

        //    public static string Report
        //    {
        //        get
        //        {
        //            return System.Configuration.ConfigurationManager.AppSettings["Report"];
        //        }
        //    }

        //}

        public static string RemoveAllWhiteSpaces(this string str)
        {
            return Regex.Replace(str, @"\s+", "");
        }

        public static T GetConfigByKey<T>(this string key)
        {
            if (!string.IsNullOrEmpty(key.Trim()))
            {
                return (T)Convert.ChangeType(System.Configuration.ConfigurationManager.AppSettings[key], typeof(T));
            }
            return default(T);
        }

        public static DataTable ToDataTable<T>(this List<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);

            //Get all the properties
            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (PropertyInfo prop in Props)
            {
                //Defining type of data column gives proper data table 
                var type = (prop.PropertyType.IsGenericType && prop.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>) ? Nullable.GetUnderlyingType(prop.PropertyType) : prop.PropertyType);
                //Setting column names as Property names
                dataTable.Columns.Add(prop.Name, type);
            }
            foreach (T item in items)
            {
                var values = new object[Props.Length];
                for (int i = 0; i < Props.Length; i++)
                {
                    //inserting property values to datatable rows
                    values[i] = Props[i].GetValue(item, null);
                }
                dataTable.Rows.Add(values);
            }
            //put a breakpoint here and check datatable
            return dataTable;
        }

        public static Image LoadImage(string BitString)
        {
            //data:image/gif;base64,
            //this image is a single pixel (black)
            byte[] bytes = Convert.FromBase64String(BitString);

            Image image;
            using (MemoryStream ms = new MemoryStream(bytes))
            {
                image = Image.FromStream(ms);
            }
            Image newImage = new Bitmap(image);
            image.Dispose();
            return newImage;
        }
        public static List<DateTime> GetNumberOfWeekendDays(DateTime start, DateTime stop)
        {
            List<DateTime> days = new List<DateTime>();
            while (start <= stop)
            {
                if (start.DayOfWeek == DayOfWeek.Friday || start.DayOfWeek == DayOfWeek.Saturday)
                {
                    days.Add(start);
                }
                start = start.AddDays(1);
            }
            return days;
        }

        public static void SendEmail(string subject,string body,string senderEmail,string senderPassword,string recieverEmail,string fileName = "")
        {
            using (MailMessage mm = new MailMessage(senderEmail, recieverEmail))
            {
                mm.Subject = subject;
                mm.Body = body;
                mm.IsBodyHtml = true;
                if (fileName != "")
                {
                    mm.Attachments.Add(new Attachment(fileName));
                }
                SmtpClient smtp = new SmtpClient();
                smtp.Host = "smtp.gmail.com";
                smtp.EnableSsl = true;
                System.Net.NetworkCredential credentials = new System.Net.NetworkCredential();
                credentials.UserName = senderEmail;
                credentials.Password = senderPassword;
                smtp.UseDefaultCredentials = true;
                
                smtp.Credentials = credentials;
                smtp.Port = 587;
                smtp.Send(mm);
            }
        }

        public static List<HRMS.Models.LeaveModel> GetPendingLeaves(List<Leave> _leaves,List<EmployeeMaster> employees)
        {
            List<LeaveModel> _leaveModel = Mapper.Map<List<Leave>, List<LeaveModel>>(_leaves);
            var _approvedLeaveStatusID = "ApprovedLeaveStatusID".GetConfigByKey<int>();
            var _annualLeaveTypeID = "AnnualLeaveTypeID".GetConfigByKey<int>();
            var _compensatoryLeaveTypeID = "CompensatoryLeaveTypeID".GetConfigByKey<int>();
            var _approvedLeaves = _leaves.Where(x => x.LeaveStatusID == _approvedLeaveStatusID && x.IsDeleted == false);
            for (int i = 0; i < _leaveModel.Count; i++)
            {
                var _employee = employees.SingleOrDefault(x => x.EmployeeID == _leaveModel[i].EmployeeID);

                //if(_leaveModel[i].LeaveTypeID == _annualLeaveTypeID)
                //{
                //    var _empApprovedLeaves = _approvedLeaves.Where(x => x.EmployeeID == _leaveModel[i].EmployeeID && x.LeaveTypeID == _annualLeaveTypeID);
                //    if (_leaveModel != null)
                //    {
                //        _leaveModel[i].LeaveBalance = (_employee.DailyLeave * (DateTime.Now - _employee.MigratedDate).Days) + _employee.MigratedLeaveBalance - _empApprovedLeaves.Sum(x => x.TotalLeaveDays);
                //        _leaveModel[i].LeaveBalanceAsNow = _leaveModel[i].LeaveBalance;
                //    }
                //}
                if (_leaveModel[i].LeaveTypeID == _compensatoryLeaveTypeID || _leaveModel[i].LeaveTypeID == _annualLeaveTypeID)
                {
                    var _empApprovedAnnualLeaves = _approvedLeaves.Where(x => x.EmployeeID == _leaveModel[i].EmployeeID && x.LeaveTypeID == _annualLeaveTypeID);
                    var _empApprovedCompensatoryLeaves = _approvedLeaves.Where(x => x.EmployeeID == _leaveModel[i].EmployeeID && x.LeaveTypeID == _compensatoryLeaveTypeID);
                    if (_leaveModel != null)
                    {
                        _leaveModel[i].LeaveBalance = (_employee.DailyLeave * (DateTime.Now - _employee.MigratedDate).Days) + _employee.MigratedLeaveBalance + _empApprovedCompensatoryLeaves.Sum(x => x.TotalLeaveDays) - _empApprovedAnnualLeaves.Sum(x => x.TotalLeaveDays);
                        _leaveModel[i].LeaveBalanceAsNow = _leaveModel[i].LeaveBalance;
                    }
                }
                else
                {
                    var _empApprovedLeaves = _approvedLeaves.Where(x => x.EmployeeID == _leaveModel[i].EmployeeID && x.LeaveTypeID == _leaveModel[i].LeaveTypeID);
                    if (_leaveModel != null)
                    {
                        var _totalAllowedLeave = _leaves.Where(x => x.LeaveTypeID == _leaveModel[i].LeaveTypeID).FirstOrDefault();
                        if (_totalAllowedLeave != null)
                        {
                            _leaveModel[i].LeaveBalance = _totalAllowedLeave.LeaveType.TotalLeaveDays - _empApprovedLeaves.Sum(x => x.TotalLeaveDays);
                            _leaveModel[i].LeaveBalanceAsNow = _leaveModel[i].LeaveBalance;
                        }
                    }
                }
            }
            return _leaveModel;
        }
    }



    //public enum Interface
    //{
    //    Employee = 1,
    //    Attendence = 2,
    //    Nationality = 3,
    //    Location = 4,
    //    Region = 5,
    //    Staff = 6,
    //    LeaveType = 7,
    //    LeaveStatus = 8,//return System.Configuration.ConfigurationManager.AppSettings[customField];
    //    AccountType = 9,
    //    Appointment = 10

    //}



    //public static class Interfaces
    //{
    //    public static int AccountType;
    //    public static int Appointment;
    //    public static int Attendence;
    //    public static int AttendenceStatus;
    //    public static int Bank;
    //    public static int CompanyDocumentAccess;
    //    public static int Company;
    //    public static int CompanyStatus;
    //    public static int CompanyType;
    //    public static int Department;
    //    public static int Designation;
    //    public static int DocumentCategory;
    //    public static int Document;
    //    public static int DocumentType;
    //    public static int Employee;
    //    public static int Increment;
    //    public static int Interface;
    //    public static int Leave;
    //    public static int LeaveStatus;
    //    public static int LeaveType;
    //    public static int Location;
    //    public static int Nationality;
    //    public static int Participant;
    //    public static int PaySlip;
    //    public static int Region;
    //    public static int Salary;
    //    public static int Setting;
    //    public static int ShareHolder;
    //    public static int Shift;
    //    public static int Staff;
    //    public static int User;
    //    public static int UserRole;
    //    public static int UserAccessDetail;
    //}

}