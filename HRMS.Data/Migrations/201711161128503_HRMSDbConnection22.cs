namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection22 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.PaySlips", "Gratuity", c => c.Single());
        }
        
        public override void Down()
        {
            DropColumn("dbo.PaySlips", "Gratuity");
        }
    }
}
