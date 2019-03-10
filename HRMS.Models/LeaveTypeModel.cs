namespace HRMS.Models
{
    public class LeaveTypeModel : BaseModel
    {
        public LeaveTypeModel() { }
        public int LeaveTypeID { get; set; }
        public string LeaveTypeName { get; set; }
        public int TotalLeaveDays { get; set; }
    }
}
