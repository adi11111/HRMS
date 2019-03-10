using System;

namespace HRMS.Models
{
    public class EmployeeModel : BaseModel
    {
        public EmployeeModel() { }
        public int EmployeeID { get; set; }
        public int AttendenceReferenceID { get; set; }
        public string EmployeeName { get; set; }
        public int StaffID { get; set; }
        public int BankID { get; set; }
        public int CompanyID { get; set; }
        public int ShiftID { get; set; }
        public int DesignationID { get ; set; }
        public int DepartmentID { get; set; }
        public int CountryID { get; set; }
        public int RegionID { get; set; }
        public int ReportingToID { get; set; }
        public int WeeklyOff { get; set; }
        public string QualificationType { get; set; }
        public string QualificationDescription { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string MobileNumber { get; set; }
        public string FamilyContactNumber { get; set; }
        public string ContactPersonName { get; set; }
        public string ContactPersonRelationship { get; set; }
        public int NationalityID { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public DateTime ActualDOB { get; set; }
        public DateTime DOB { get; set; }
        public string InternationalContactNumber{ get; set; }
        public string PhotoPath { get; set; }
        public string Status { get; set; }
        public string MedicalHistory { get; set; }
        public float MigratedLeaveBalance { get; set; }
        public DateTime MigratedDate { get; set; }
        public float DailyLeave { get; set; }
        public float LeaveBalanceAsNow { get; set; }
        public string AccountNumber { get; set; }
        public DateTime JoiningDate { get; set; }
        public int AccountTypeID { get; set; }
    }
}
