namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection21 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Deductions", "OtherNumber", c => c.Single());
            AlterColumn("dbo.DeductionDetails", "OtherNumber", c => c.Single());
            AlterColumn("dbo.Increments", "OtherNumber", c => c.Single());
            AlterColumn("dbo.PaySlips", "OtherNumber", c => c.Single());
            AlterColumn("dbo.Salaries", "OtherNumber", c => c.Single());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Salaries", "OtherNumber", c => c.String());
            AlterColumn("dbo.PaySlips", "OtherNumber", c => c.String());
            AlterColumn("dbo.Increments", "OtherNumber", c => c.String(maxLength: 20));
            AlterColumn("dbo.DeductionDetails", "OtherNumber", c => c.String());
            AlterColumn("dbo.Deductions", "OtherNumber", c => c.String());
        }
    }
}
