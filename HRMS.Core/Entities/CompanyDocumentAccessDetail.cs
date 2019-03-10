using HRMS.Core.Entities.Foundation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Core.Entities
{
    public class CompanyDocumentAccessDetail : BaseEntity
    {
        public CompanyDocumentAccessDetail() { }
        [Key]
        public int CompanyDocumentAccessDetailID { get; set; }
        [Required]
        public int  DocumentID { get; set; }
        [Required]
        public int EmployeeID{ get; set; }
        [ForeignKey("EmployeeID")]
        public virtual EmployeeMaster EmployeeMaster { get; set; }
        [ForeignKey("DocumentID")]
        public virtual DocumentDetail DocumentDetail { get; set; }
    }
}
