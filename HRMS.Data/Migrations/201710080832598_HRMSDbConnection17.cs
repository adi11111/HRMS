namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection17 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Appointments", "Conclusion", c => c.String(maxLength: 800));
            AddColumn("dbo.SettingMasters", "LastEmailSent", c => c.DateTime());
            AddColumn("dbo.SettingMasters", "Interval", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.SettingMasters", "Interval");
            DropColumn("dbo.SettingMasters", "LastEmailSent");
            DropColumn("dbo.Appointments", "Conclusion");
        }
    }
}
