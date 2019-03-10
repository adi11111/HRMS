namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection3 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.CompanyMasters", "Logo", c => c.String(nullable: false, maxLength: 70));
            AddColumn("dbo.CompanyMasters", "EstablishmentDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.CompanyMasters", "EstablishedBy", c => c.String(nullable: false, maxLength: 70));
            AddColumn("dbo.CompanyMasters", "AssistedBy", c => c.String(nullable: false, maxLength: 70));
            AddColumn("dbo.CompanyMasters", "TotalCapital", c => c.Single(nullable: false));
            AddColumn("dbo.CompanyMasters", "TotalShares", c => c.Single(nullable: false));
            AddColumn("dbo.CompanyMasters", "InitialValue", c => c.Single(nullable: false));
            AddColumn("dbo.CompanyMasters", "CurrentValue", c => c.Single(nullable: false));
            DropColumn("dbo.ShareHolderDetails", "AuthorisedCapital");
            DropColumn("dbo.ShareHolderDetails", "TotalCapital");
            DropColumn("dbo.ShareHolderDetails", "ShareValue");
            DropColumn("dbo.ShareHolderDetails", "IssuedCapital");
            DropColumn("dbo.ShareHolderDetails", "NomialValue");
        }
        
        public override void Down()
        {
            AddColumn("dbo.ShareHolderDetails", "NomialValue", c => c.Single(nullable: false));
            AddColumn("dbo.ShareHolderDetails", "IssuedCapital", c => c.String(nullable: false));
            AddColumn("dbo.ShareHolderDetails", "ShareValue", c => c.Single(nullable: false));
            AddColumn("dbo.ShareHolderDetails", "TotalCapital", c => c.String(nullable: false));
            AddColumn("dbo.ShareHolderDetails", "AuthorisedCapital", c => c.String(nullable: false, maxLength: 70));
            DropColumn("dbo.CompanyMasters", "CurrentValue");
            DropColumn("dbo.CompanyMasters", "InitialValue");
            DropColumn("dbo.CompanyMasters", "TotalShares");
            DropColumn("dbo.CompanyMasters", "TotalCapital");
            DropColumn("dbo.CompanyMasters", "AssistedBy");
            DropColumn("dbo.CompanyMasters", "EstablishedBy");
            DropColumn("dbo.CompanyMasters", "EstablishmentDate");
            DropColumn("dbo.CompanyMasters", "Logo");
        }
    }
}
