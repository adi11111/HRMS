namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection20 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.GraduitySettings", "CountryID", "dbo.Countries");
            DropIndex("dbo.GraduitySettings", new[] { "CountryID" });
            AddColumn("dbo.GraduitySettings", "CompanyID", c => c.Int(nullable: false));
            CreateIndex("dbo.GraduitySettings", "CompanyID");
            AddForeignKey("dbo.GraduitySettings", "CompanyID", "dbo.CompanyMasters", "CompanyID", cascadeDelete: true);
            DropColumn("dbo.GraduitySettings", "CountryID");
        }
        
        public override void Down()
        {
            AddColumn("dbo.GraduitySettings", "CountryID", c => c.Int(nullable: false));
            DropForeignKey("dbo.GraduitySettings", "CompanyID", "dbo.CompanyMasters");
            DropIndex("dbo.GraduitySettings", new[] { "CompanyID" });
            DropColumn("dbo.GraduitySettings", "CompanyID");
            CreateIndex("dbo.GraduitySettings", "CountryID");
            AddForeignKey("dbo.GraduitySettings", "CountryID", "dbo.Countries", "CountryID", cascadeDelete: true);
        }
    }
}
