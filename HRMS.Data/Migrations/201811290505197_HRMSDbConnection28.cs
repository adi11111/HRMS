namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection28 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Gratuities", "AirTicketAmount1", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AddColumn("dbo.Gratuities", "AirTicketAmount2", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            DropColumn("dbo.Gratuities", "AirTicketAmount");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Gratuities", "AirTicketAmount", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            DropColumn("dbo.Gratuities", "AirTicketAmount2");
            DropColumn("dbo.Gratuities", "AirTicketAmount1");
        }
    }
}
