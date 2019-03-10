namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection14 : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.SettingMasters", "Email");
        }
        
        public override void Down()
        {
            AddColumn("dbo.SettingMasters", "Email", c => c.String());
        }
    }
}
