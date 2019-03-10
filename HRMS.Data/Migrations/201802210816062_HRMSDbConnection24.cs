namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection24 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.PaySlips", "AdditionText", c => c.String(maxLength: 70));
            AddColumn("dbo.PaySlips", "AdditionNumber", c => c.Single());
        }
        
        public override void Down()
        {
            DropColumn("dbo.PaySlips", "AdditionNumber");
            DropColumn("dbo.PaySlips", "AdditionText");
        }
    }
}
