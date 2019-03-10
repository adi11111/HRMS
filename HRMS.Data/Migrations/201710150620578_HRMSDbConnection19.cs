namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection19 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.GraduitySettings",
                c => new
                    {
                        GraduitySettingID = c.Int(nullable: false, identity: true),
                        Year1 = c.Int(nullable: false),
                        Year2 = c.Int(nullable: false),
                        Year3 = c.Int(nullable: false),
                        Year4 = c.Int(nullable: false),
                        Year5 = c.Int(nullable: false),
                        YearAbove5 = c.Int(nullable: false),
                        IsBasicOnly = c.Boolean(nullable: false),
                        CountryID = c.Int(nullable: false),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.GraduitySettingID)
                .ForeignKey("dbo.Countries", t => t.CountryID, cascadeDelete: true)
                .Index(t => t.CountryID);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.GraduitySettings", "CountryID", "dbo.Countries");
            DropIndex("dbo.GraduitySettings", new[] { "CountryID" });
            DropTable("dbo.GraduitySettings");
        }
    }
}
