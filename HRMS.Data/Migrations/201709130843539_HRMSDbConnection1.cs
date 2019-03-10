namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection1 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.EmployeeMasters", "BankID", c => c.Int(nullable: false));
            CreateIndex("dbo.EmployeeMasters", "BankID");
            AddForeignKey("dbo.EmployeeMasters", "BankID", "dbo.BankMasters", "BankID", cascadeDelete: false);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.EmployeeMasters", "BankID", "dbo.BankMasters");
            DropIndex("dbo.EmployeeMasters", new[] { "BankID" });
            DropColumn("dbo.EmployeeMasters", "BankID");
        }
    }
}
