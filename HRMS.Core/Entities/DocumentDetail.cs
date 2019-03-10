using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class DocumentDetail : BaseEntity
    {
        public DocumentDetail() { }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DocumentID { get; set; }
        [Required]
        public int CompanyID { get; set; }
        [Required]
        public int EmployeeID { get; set; }
        [Required]
        public int ProcessOwnerID { get; set; }
        [Required]
        public int DocumentCategoryID { get; set; }
        [Required]
        public int DocumentTypeID { get; set; }
        [Required]
        [StringLength(70)]
        public string SearchName{ get; set; }
        //[Required]
        [StringLength(70)]
        public string DocumentOwner { get; set; }
        //[Required]
        //[StringLength(70)]
        //public string RelatedTo { get; set; }
        [Required]
        public DateTime DocumentIssueDate{ get; set; }
        [Required]
        public DateTime ExpiryDate{ get; set; }
        [Required]
        [StringLength(70)]
        public string IssuingAuthority{ get; set; }
        public bool IsSetting { get; set; }
        [Required]
        public int DocumentRenewalStatusID { get; set; }
        [ForeignKey("EmployeeID")]
        public virtual EmployeeMaster EmployeeMaster { get; set; }
        [ForeignKey("DocumentCategoryID")]
        public virtual DocumentCategory DocumentCategory { get; set; }
        [ForeignKey("DocumentTypeID")]
        public virtual DocumentType DocumentType { get; set; }
        [ForeignKey("DocumentRenewalStatusID")]
        public virtual DocumentRenewalStatus DocumentRenewalStatus { get; set; }
        [ForeignKey("CompanyID")]
        public virtual CompanyMaster CompanyMaster { get; set; }
        [Required]
        [StringLength(50)]
        public string DocumentNumber { get; set; }
    }
}
