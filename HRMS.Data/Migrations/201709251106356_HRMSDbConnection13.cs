namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection13 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.PublicHolidays",
                c => new
                    {
                        PublicHolidayID = c.Int(nullable: false, identity: true),
                        PublicHolidayName = c.String(nullable: false, maxLength: 70),
                        Date = c.DateTime(nullable: false),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.PublicHolidayID);
            
            AddColumn("dbo.EmployeeMasters", "WeeklyOff", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.EmployeeMasters", "WeeklyOff");
            DropTable("dbo.PublicHolidays");
        }
    }
}
