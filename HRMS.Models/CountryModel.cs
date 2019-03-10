namespace HRMS.Models
{
    public class CountryModel : BaseModel
    {
        public CountryModel() { }
        public int CountryID { get; set; }
        public string CountryName { get; set; }
        public string ShortForm { get; set; }
        public string Currency { get; set; }

    }
}
