namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection30 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Gratuities", "AdditionText1", c => c.String());
            AddColumn("dbo.Gratuities", "AdditionAmount1", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AddColumn("dbo.Gratuities", "AdditionText2", c => c.String());
            AddColumn("dbo.Gratuities", "AdditionAmount2", c => c.Decimal(nullable: false, precision: 18, scale: 2));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Gratuities", "AdditionAmount2");
            DropColumn("dbo.Gratuities", "AdditionText2");
            DropColumn("dbo.Gratuities", "AdditionAmount1");
            DropColumn("dbo.Gratuities", "AdditionText1");
        }
    }
}
