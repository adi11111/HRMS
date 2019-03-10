using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class CompanyMaster : Foundation.BaseEntity
    {
        public CompanyMaster()
        {
        //    CompanyDocumentAccessDetail = new List<CompanyDocumentAccessDetail>();
        }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CompanyID { get; set; }
        [Required]
        [StringLength(70)]
        public string CompanyName { get; set; }
        [Required]
        [StringLength(70)]
        public string Logo { get; set; }
        [Required]
        public DateTime EstablishmentDate{ get; set; }
        [Required]
        [StringLength(70)]
        public string EstablishedBy { get; set; }
        [Required]
        [StringLength(70)]
        public string AssistedBy { get; set; }
        [StringLength(70)]
        public string RegistrationID { get; set; }
        [Required]
        public int CountryID { get; set; }
        [StringLength(70)]
        public string CompanyNumber { get; set; }
        [StringLength(10)]
        public string Currency { get; set; }
        [Required]
        public int CompanyTypeID { get; set; }
        public int CompanyStatusID { get; set; }
        [StringLength(800)]
        public string Address { get; set; }
        [StringLength(70)]
        public string ContactPerson { get; set; }
        [StringLength(20)]
        public string MobileNumber { get; set; }
        [StringLength(20)]
        public string OfficeNumber { get; set; }
        //[Required]
        //[StringLength(70)]
        //[DataType(DataType.Currency)]
        //public float AuthorisedCapital { get; set; }
        [Required]
        [DataType(DataType.Currency)]
        public float TotalCapital { get; set; }
        [Required]
        [DataType(DataType.Currency)]
        public float TotalShares { get; set; }
        [Required]
        [DataType(DataType.Currency)]
        public float InitialValue { get; set; }
        [Required]
        [DataType(DataType.Currency)]
        public float CurrentValue { get; set; }
        [ForeignKey("CountryID")]
        public virtual Country Country { get; set; }
        [ForeignKey("CompanyTypeID")]
        public virtual CompanyType CompanyType { get; set; }
        [ForeignKey("CompanyStatusID")]
        public virtual CompanyStatus CompanyStatus { get; set; }
    }
}
