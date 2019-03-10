using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Models
{
   public class DocumentDetailModel : BaseModel
    {
        public int DocumentID { get; set; }
        public int CompanyID { get; set; }
        public int EmployeeID { get; set; }
        public int ProcessOwnerID { get; set; }
        public int DocumentCategoryID { get; set; }
        public int DocumentTypeID { get; set; }
        public string SearchName { get; set; }
        public string FileLocation { get; set; }
        public string FileExt { get; set; }
        public DateTime DocumentIssueDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string IssuingAuthority { get; set; }
        public int DocumentRenewalStatusID { get; set; }
        public string DocumentNumber { get; set; }
        public List<ParticipantModel> Participants { get; set; }
    }
}
