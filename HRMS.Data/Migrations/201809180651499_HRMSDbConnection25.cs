namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection25 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.EmployeeMasters", "MigratedLeaveBalance", c => c.Single(nullable: false));
            AddColumn("dbo.EmployeeMasters", "MigratedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.EmployeeMasters", "DailyLeave", c => c.Single(nullable: false));
            DropColumn("dbo.EmployeeMasters", "LeaveBalance");
        }
        
        public override void Down()
        {
            AddColumn("dbo.EmployeeMasters", "LeaveBalance", c => c.Single(nullable: false));
            DropColumn("dbo.EmployeeMasters", "DailyLeave");
            DropColumn("dbo.EmployeeMasters", "MigratedDate");
            DropColumn("dbo.EmployeeMasters", "MigratedLeaveBalance");
        }
    }
}
