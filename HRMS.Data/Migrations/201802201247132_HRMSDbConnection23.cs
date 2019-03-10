namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection23 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Deductions", "IsAddition", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Deductions", "IsAddition");
        }
    }
}
