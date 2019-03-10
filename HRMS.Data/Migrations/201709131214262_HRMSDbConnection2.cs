namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.EmployeeMasters", "CompanyID", c => c.Int(nullable: false));
            CreateIndex("dbo.EmployeeMasters", "CompanyID");
            AddForeignKey("dbo.EmployeeMasters", "CompanyID", "dbo.CompanyMasters", "CompanyID", cascadeDelete: false);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.EmployeeMasters", "CompanyID", "dbo.CompanyMasters");
            DropIndex("dbo.EmployeeMasters", new[] { "CompanyID" });
            DropColumn("dbo.EmployeeMasters", "CompanyID");
        }
    }
}
