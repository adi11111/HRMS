namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection12 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.LeaveTypes", "TotalLeaveDays", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.LeaveTypes", "TotalLeaveDays");
        }
    }
}
