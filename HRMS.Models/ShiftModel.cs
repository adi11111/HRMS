using System;
namespace HRMS.Models
{
   public class ShiftModel : BaseModel
    {
        public int ShiftID { get; set; }
        public string ShiftName { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public TimeSpan BreakStartTime { get; set; }
        public TimeSpan BreakEndTime { get; set; }
        public TimeSpan TotalTime { get; set; }
        public TimeSpan TotalBreakHours { get; set; }
        public TimeSpan TotalWorkingHours { get; set; }
    }
}
