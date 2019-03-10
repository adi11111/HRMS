namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnecton : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.PaySlips", "TotalPresentDays", c => c.Single(nullable: false));
            AddColumn("dbo.PaySlips", "TotalLeaveDays", c => c.Single(nullable: false));
            AddColumn("dbo.PaySlips", "TotalAbsentDays", c => c.Single(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.PaySlips", "TotalAbsentDays");
            DropColumn("dbo.PaySlips", "TotalLeaveDays");
            DropColumn("dbo.PaySlips", "TotalPresentDays");
        }
    }
}
