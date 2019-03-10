using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class EmployeeMaster : BaseEntity
    {
        public EmployeeMaster() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EmployeeID { get; set; }
        [Required]
        public int AttendenceReferenceID { get; set; }
        [Required]
        [StringLength(70)]
        public string EmployeeName { get; set; }
        [Required]
        public int StaffID { get; set; }
        [Required]
        public int BankID { get; set; }
        [Required]
        public int CompanyID { get; set; }
        [Required]
        public int ShiftID { get; set; }
        [Required]
        public int DesignationID { get ; set; }
        [Required]
        public int ReportingToID { get; set; }
        [Required]
        public int DepartmentID { get; set; }
        [Required]
        public int WeeklyOff { get; set; }
        [Required]
        [StringLength(50)]
        public string QualificationType { get; set; }
        [Required]
        [StringLength(150)]
        public string QualificationDescription { get; set; }
        [StringLength(20)]
        public string PhoneNumber { get; set; }
        [Required]
        [StringLength(20)]
        public string MobileNumber { get; set; }
        [Required]
        [StringLength(20)]
        public string FamilyContactNumber { get; set; }
        [Required]
        [StringLength(20)]
        public string ContactPersonName { get; set; }
        [Required]
        [StringLength(200)]
        public string Address { get; set; }
        [Required]
        [StringLength(50)]
        public string ContactPersonRelationship { get; set; }
        [Required]
        public int NationalityID { get; set; }
        [Required]
        public int CountryID { get; set; }
        [Required]
        public int RegionID { get; set; }
        [Required]
        [StringLength(10)]
        public string Gender { get; set; }
        [Required]
        [StringLength(70)]
        public string Email { get; set; }
        [Required]
        public DateTime DOB { get; set; }
        [Required]
        public DateTime ActualDOB { get; set; }
        [Required]
        [StringLength(20)]
        public string InternationalContactNumber{ get; set; }
        [Required]
        public string PhotoPath { get; set; }
        [Required]
        [StringLength(70)]
        // rename to status
        public string Status { get; set; }
        public string MedicalHistory { get; set; }
        [Required]
        public float MigratedLeaveBalance { get; set; }
        public DateTime MigratedDate { get; set; }
        public float DailyLeave { get; set; }
        [Required]
        public string AccountNumber { get; set; }
        [Required]
        public DateTime JoiningDate { get; set; }
        [Required]
        public int AccountTypeID { get; set; }
        [ForeignKey("AccountTypeID")]
        public virtual AccountType AccountType { get; set; }
        [ForeignKey("StaffID")]
        public virtual Staff Staff { get; set; }
        [ForeignKey("ShiftID")]
        public virtual ShiftMaster ShiftMaster { get; set; }
        [ForeignKey("DesignationID")]
        public virtual Designation Designation { get; set; }
        [ForeignKey("DepartmentID")]
        public virtual Department Department { get; set; }
        [ForeignKey("NationalityID")]
        public virtual Nationality Nationality { get; set; }
        [ForeignKey("CountryID")]
        public virtual Country Country { get; set; }
        [ForeignKey("CompanyID")]
        public virtual CompanyMaster CompanyMaster { get; set; }
        [ForeignKey("BankID")]
        public virtual BankMaster BankMaster { get; set; }
        [ForeignKey("RegionID")]
        public virtual Region Region{ get; set; }
    }
}
