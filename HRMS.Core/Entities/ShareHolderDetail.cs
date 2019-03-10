using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class ShareHolderDetail : BaseEntity
    {
        public ShareHolderDetail() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ShareHolderID { get; set; }
        [Required]
        [StringLength(70)]
        public string ShareHolderName { get; set; }
        [Required]
        public int ShareHolderTypeID { get; set; }
        [Required]
        [StringLength(20)]
        public string MobileNumber { get; set; }
        [StringLength(20)]
        public string ContactNumber { get; set; }
        public string Address { get; set; }
        [Required]
        public string DigitalSignature { get; set; }
        [Required]
        public string TotalShares { get; set; }
        //[Required]
        //[StringLength(70)]
        //[DataType(DataType.Currency)]
        //public string AuthorisedCapital { get; set; }
        //[Required]
        //[DataType(DataType.Currency)]
        //public string TotalCapital { get; set; }
        //[Required]
        //[DataType(DataType.Currency)]
        //public float ShareValue { get; set; }
        [Required]
        public int CompanyID{ get; set; }
        [Required]
        public int EmployeeID { get; set; }
        //[Required]
        //[DataType(DataType.Currency)]
        //public string IssuedCapital { get; set; }
        //[Required]
        //[DataType(DataType.Currency)]
        //public float NomialValue { get; set; }
        [ForeignKey("EmployeeID")]
        public virtual EmployeeMaster EmployeeMaster { get; set; }
        [ForeignKey("CompanyID")]
        public virtual CompanyMaster CompanyMaster { get; set; }
        [ForeignKey("ShareHolderTypeID")]
        public virtual ShareHolderType ShareHolderType { get; set; }
    }
}
