namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection29 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Gratuities", "OtherAmount1", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AlterColumn("dbo.Gratuities", "OtherAmount2", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AlterColumn("dbo.Gratuities", "OtherAmount3", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AlterColumn("dbo.Gratuities", "OtherAmount4", c => c.Decimal(nullable: false, precision: 18, scale: 2));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Gratuities", "OtherAmount4", c => c.Int(nullable: false));
            AlterColumn("dbo.Gratuities", "OtherAmount3", c => c.Int(nullable: false));
            AlterColumn("dbo.Gratuities", "OtherAmount2", c => c.Int(nullable: false));
            AlterColumn("dbo.Gratuities", "OtherAmount1", c => c.Int(nullable: false));
        }
    }
}
