namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection16 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.CompanyMasters", "Currency", c => c.String(maxLength: 10));
            AddColumn("dbo.PublicHolidays", "CompanyID", c => c.Int(nullable: false));
            CreateIndex("dbo.PublicHolidays", "CompanyID");
            AddForeignKey("dbo.PublicHolidays", "CompanyID", "dbo.CompanyMasters", "CompanyID", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.PublicHolidays", "CompanyID", "dbo.CompanyMasters");
            DropIndex("dbo.PublicHolidays", new[] { "CompanyID" });
            DropColumn("dbo.PublicHolidays", "CompanyID");
            DropColumn("dbo.CompanyMasters", "Currency");
        }
    }
}
