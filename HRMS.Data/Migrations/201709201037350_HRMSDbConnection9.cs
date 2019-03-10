namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection9 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.DocumentDetails", "DocumentOwner", c => c.String(maxLength: 70));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.DocumentDetails", "DocumentOwner", c => c.String(nullable: false, maxLength: 70));
        }
    }
}
