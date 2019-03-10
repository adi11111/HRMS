namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection11 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Appointments", "DesignationID", "dbo.Designations");
            DropIndex("dbo.Appointments", new[] { "DesignationID" });
            AddColumn("dbo.Appointments", "EmployeeID", c => c.Int(nullable: false));
            AddColumn("dbo.DocumentDetails", "ProcessOwnerID", c => c.Int(nullable: false));
            CreateIndex("dbo.Appointments", "EmployeeID");
            AddForeignKey("dbo.Appointments", "EmployeeID", "dbo.EmployeeMasters", "EmployeeID", cascadeDelete: false);
            DropColumn("dbo.Appointments", "DesignationID");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Appointments", "DesignationID", c => c.Int(nullable: false));
            DropForeignKey("dbo.Appointments", "EmployeeID", "dbo.EmployeeMasters");
            DropIndex("dbo.Appointments", new[] { "EmployeeID" });
            DropColumn("dbo.DocumentDetails", "ProcessOwnerID");
            DropColumn("dbo.Appointments", "EmployeeID");
            CreateIndex("dbo.Appointments", "DesignationID");
            AddForeignKey("dbo.Appointments", "DesignationID", "dbo.Designations", "DesignationID", cascadeDelete: true);
        }
    }
}
