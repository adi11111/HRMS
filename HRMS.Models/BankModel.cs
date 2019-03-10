namespace HRMS.Models
{
    public class BankModel : BaseModel
    {
        public BankModel() { }
        public int BankID { get; set; }
        public string BankName { get; set; }
        public string BranchName { get; set; }
        public string ContactPerson { get; set; }
        public string ContactNumber { get; set; }
        public int RegionID { get; set; }
        public int LocationID { get; set; }

    }
}
