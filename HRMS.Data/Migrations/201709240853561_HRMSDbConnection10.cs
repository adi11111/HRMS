namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection10 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Participants", "AppointmentID", "dbo.Appointments");
            DropForeignKey("dbo.Participants", "DocumentID", "dbo.DocumentDetails");
            DropIndex("dbo.Participants", new[] { "AppointmentID" });
            DropIndex("dbo.Participants", new[] { "DocumentID" });
            AlterColumn("dbo.Participants", "AppointmentID", c => c.Int(nullable: false,defaultValue: 1));
            AlterColumn("dbo.Participants", "DocumentID", c => c.Int(nullable: false, defaultValue: 1));
            CreateIndex("dbo.Participants", "AppointmentID");
            CreateIndex("dbo.Participants", "DocumentID");
            AddForeignKey("dbo.Participants", "AppointmentID", "dbo.Appointments", "AppointmentID", cascadeDelete: true);
            AddForeignKey("dbo.Participants", "DocumentID", "dbo.DocumentDetails", "DocumentID", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Participants", "DocumentID", "dbo.DocumentDetails");
            DropForeignKey("dbo.Participants", "AppointmentID", "dbo.Appointments");
            DropIndex("dbo.Participants", new[] { "DocumentID" });
            DropIndex("dbo.Participants", new[] { "AppointmentID" });
            AlterColumn("dbo.Participants", "DocumentID", c => c.Int());
            AlterColumn("dbo.Participants", "AppointmentID", c => c.Int());
            CreateIndex("dbo.Participants", "DocumentID");
            CreateIndex("dbo.Participants", "AppointmentID");
            AddForeignKey("dbo.Participants", "DocumentID", "dbo.DocumentDetails", "DocumentID");
            AddForeignKey("dbo.Participants", "AppointmentID", "dbo.Appointments", "AppointmentID");
        }
    }
}
