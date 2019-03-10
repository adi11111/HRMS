namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection6 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.EmployeeMasters", "Email", c => c.String(nullable: false, maxLength: 70));
            AddColumn("dbo.EmployeeMasters", "ActualDOB", c => c.DateTime(nullable: false));
            AddColumn("dbo.DocumentDetails", "DocumentOwner", c => c.String(nullable: false, maxLength: 70));
            AddColumn("dbo.Participants", "DocumentID", c => c.Int(nullable: false));
            AddColumn("dbo.ShareHolderDetails", "TotalShares", c => c.String(nullable: false));
            CreateIndex("dbo.Participants", "DocumentID");
            AddForeignKey("dbo.Participants", "DocumentID", "dbo.DocumentDetails", "DocumentID", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Participants", "DocumentID", "dbo.DocumentDetails");
            DropIndex("dbo.Participants", new[] { "DocumentID" });
            DropColumn("dbo.ShareHolderDetails", "TotalShares");
            DropColumn("dbo.Participants", "DocumentID");
            DropColumn("dbo.DocumentDetails", "DocumentOwner");
            DropColumn("dbo.EmployeeMasters", "ActualDOB");
            DropColumn("dbo.EmployeeMasters", "Email");
        }
    }
}
