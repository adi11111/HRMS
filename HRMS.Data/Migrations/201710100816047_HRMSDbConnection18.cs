namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection18 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.EmployeeMasters", "ReportingToID", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.EmployeeMasters", "ReportingToID");
        }
    }
}
