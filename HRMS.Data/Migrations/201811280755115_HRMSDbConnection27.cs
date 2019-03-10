namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection27 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Gratuities", "GratuityAmount", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AddColumn("dbo.Gratuities", "OtherText1", c => c.String());
            AddColumn("dbo.Gratuities", "OtherAmount1", c => c.Int(nullable: false));
            AddColumn("dbo.Gratuities", "OtherText2", c => c.String());
            AddColumn("dbo.Gratuities", "OtherAmount2", c => c.Int(nullable: false));
            AddColumn("dbo.Gratuities", "OtherText3", c => c.String());
            AddColumn("dbo.Gratuities", "OtherAmount3", c => c.Int(nullable: false));
            AddColumn("dbo.Gratuities", "OtherText4", c => c.String());
            AddColumn("dbo.Gratuities", "OtherAmount4", c => c.Int(nullable: false));
            AddColumn("dbo.Gratuities", "NoticePeriodDays", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AddColumn("dbo.Gratuities", "NoticePeriodAmount", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AddColumn("dbo.Gratuities", "AirTicketAmount", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            DropColumn("dbo.Gratuities", "GraduityAmount");
            DropColumn("dbo.Gratuities", "OtherText");
            DropColumn("dbo.Gratuities", "OtherAmount");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Gratuities", "OtherAmount", c => c.Int(nullable: false));
            AddColumn("dbo.Gratuities", "OtherText", c => c.String());
            AddColumn("dbo.Gratuities", "GraduityAmount", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            DropColumn("dbo.Gratuities", "AirTicketAmount");
            DropColumn("dbo.Gratuities", "NoticePeriodAmount");
            DropColumn("dbo.Gratuities", "NoticePeriodDays");
            DropColumn("dbo.Gratuities", "OtherAmount4");
            DropColumn("dbo.Gratuities", "OtherText4");
            DropColumn("dbo.Gratuities", "OtherAmount3");
            DropColumn("dbo.Gratuities", "OtherText3");
            DropColumn("dbo.Gratuities", "OtherAmount2");
            DropColumn("dbo.Gratuities", "OtherText2");
            DropColumn("dbo.Gratuities", "OtherAmount1");
            DropColumn("dbo.Gratuities", "OtherText1");
            DropColumn("dbo.Gratuities", "GratuityAmount");
        }
    }
}
