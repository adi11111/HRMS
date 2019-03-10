using System;

namespace HRMS.Models
{
    public class CompanyModel : BaseModel
    {
        public CompanyModel() { }
        public int CompanyID { get; set; }
        public string CompanyName { get; set; }
        public string Logo { get; set; }
        public DateTime EstablishmentDate { get; set; }
        public string EstablishedBy { get; set; }
        public string AssistedBy { get; set; }
        public string RegistrationID { get; set; }
        public int CountryID { get; set; }
        public string CompanyNumber { get; set; }
        public string Currency { get; set; }
        public int CompanyTypeID { get; set; }
        public int CompanyStatusID { get; set; }
        public string Address { get; set; }
        public string ContactPerson { get; set; }
        public string MobileNumber { get; set; }
        public string OfficeNumber { get; set; }
        public float TotalCapital { get; set; }
        public float TotalShares { get; set; }
        public float InitialValue { get; set; }
        public float CurrentValue { get; set; }
    }
}
