namespace HRMS.Models
{
    public class PublicHolidayModel : BaseModel
    {
        public int PublicHolidayID { get; set; }
        public string PublicHolidayName { get; set; }
        public System.DateTime Date { get; set; }
        public int CompanyID { get; set; }
    }
}
