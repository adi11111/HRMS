namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection26 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Gratuities",
                c => new
                    {
                        GratuityID = c.Int(nullable: false, identity: true),
                        EmployeeID = c.Int(nullable: false),
                        SettlementDate = c.DateTime(nullable: false),
                        TotalWorkingDays = c.Int(nullable: false),
                        GraduityAmount = c.Decimal(nullable: false, precision: 18, scale: 2),
                        TotalLeavePending = c.Decimal(nullable: false, precision: 18, scale: 2),
                        TotalLeaveSalaryPending = c.Decimal(nullable: false, precision: 18, scale: 2),
                        OtherText = c.String(),
                        OtherAmount = c.Int(nullable: false),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.GratuityID)
                .ForeignKey("dbo.EmployeeMasters", t => t.EmployeeID, cascadeDelete: true)
                .Index(t => t.EmployeeID);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Gratuities", "EmployeeID", "dbo.EmployeeMasters");
            DropIndex("dbo.Gratuities", new[] { "EmployeeID" });
            DropTable("dbo.Gratuities");
        }
    }
}
