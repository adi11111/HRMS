namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection15 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.PaySlips", "TotalPublicHolidays", c => c.Single(nullable: false));
            AddColumn("dbo.PaySlips", "TotalWeekendDays", c => c.Single(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.PaySlips", "TotalWeekendDays");
            DropColumn("dbo.PaySlips", "TotalPublicHolidays");
        }
    }
}
