namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection8 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Participants", "AppointmentID", "dbo.Appointments");
            DropForeignKey("dbo.Participants", "DocumentID", "dbo.DocumentDetails");
            DropIndex("dbo.Participants", new[] { "AppointmentID" });
            DropIndex("dbo.Participants", new[] { "DocumentID" });
            AlterColumn("dbo.Participants", "AppointmentID", c => c.Int());
            AlterColumn("dbo.Participants", "DocumentID", c => c.Int());
            CreateIndex("dbo.Participants", "AppointmentID");
            CreateIndex("dbo.Participants", "DocumentID");
            AddForeignKey("dbo.Participants", "AppointmentID", "dbo.Appointments", "AppointmentID");
            AddForeignKey("dbo.Participants", "DocumentID", "dbo.DocumentDetails", "DocumentID");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Participants", "DocumentID", "dbo.DocumentDetails");
            DropForeignKey("dbo.Participants", "AppointmentID", "dbo.Appointments");
            DropIndex("dbo.Participants", new[] { "DocumentID" });
            DropIndex("dbo.Participants", new[] { "AppointmentID" });
            AlterColumn("dbo.Participants", "DocumentID", c => c.Int(nullable: false));
            AlterColumn("dbo.Participants", "AppointmentID", c => c.Int(nullable: false));
            CreateIndex("dbo.Participants", "DocumentID");
            CreateIndex("dbo.Participants", "AppointmentID");
            AddForeignKey("dbo.Participants", "DocumentID", "dbo.DocumentDetails", "DocumentID", cascadeDelete: true);
            AddForeignKey("dbo.Participants", "AppointmentID", "dbo.Appointments", "AppointmentID", cascadeDelete: true);
        }
    }
}
