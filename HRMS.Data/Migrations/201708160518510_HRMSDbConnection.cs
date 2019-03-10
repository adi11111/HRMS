namespace HRMS.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HRMSDbConnection : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.AccountTypes",
                c => new
                    {
                        AccountTypeID = c.Int(nullable: false, identity: true),
                        AccountTypeName = c.String(nullable: false, maxLength: 70),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.AccountTypeID);
            
            CreateTable(
                "dbo.Appointments",
                c => new
                    {
                        AppointmentID = c.Int(nullable: false, identity: true),
                        DesignationID = c.Int(nullable: false),
                        CompanyID = c.Int(nullable: false),
                        AppointmentName = c.String(maxLength: 70),
                        StartTime = c.Time(nullable: false, precision: 7),
                        EndTime = c.Time(nullable: false, precision: 7),
                        AppointmentDate = c.DateTime(nullable: false),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.AppointmentID)
                .ForeignKey("CompanyMasters", t => t.CompanyID, cascadeDelete: true)
                .ForeignKey("Designations", t => t.DesignationID, cascadeDelete: true)
                .Index(t => t.DesignationID)
                .Index(t => t.CompanyID);
            
            CreateTable(
                "dbo.CompanyMasters",
                c => new
                    {
                        CompanyID = c.Int(nullable: false, identity: true),
                        CompanyName = c.String(nullable: false, maxLength: 70),
                        RegistrationID = c.String(maxLength: 70),
                        CountryID = c.Int(nullable: false),
                        CompanyNumber = c.String(maxLength: 70),
                        CompanyTypeID = c.Int(nullable: false),
                        CompanyStatusID = c.Int(nullable: false),
                        Address = c.String(maxLength: 800),
                        ContactPerson = c.String(maxLength: 70),
                        MobileNumber = c.String(maxLength: 20),
                        OfficeNumber = c.String(maxLength: 20),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.CompanyID)
                .ForeignKey("dbo.CompanyStatus", t => t.CompanyStatusID, cascadeDelete: true)
                .ForeignKey("dbo.CompanyTypes", t => t.CompanyTypeID, cascadeDelete: true)
                .ForeignKey("dbo.Countries", t => t.CountryID, cascadeDelete: true)
                .Index(t => t.CountryID)
                .Index(t => t.CompanyTypeID)
                .Index(t => t.CompanyStatusID);
            
            CreateTable(
                "dbo.CompanyStatus",
                c => new
                    {
                        CompanyStatusID = c.Int(nullable: false, identity: true),
                        CompanyStatusName = c.String(nullable: false, maxLength: 70),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.CompanyStatusID);
            
            CreateTable(
                "dbo.CompanyTypes",
                c => new
                    {
                        CompanyTypeID = c.Int(nullable: false, identity: true),
                        CompanyTypeName = c.String(nullable: false, maxLength: 70),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.CompanyTypeID);
            
            CreateTable(
                "dbo.Countries",
                c => new
                    {
                        CountryID = c.Int(nullable: false, identity: true),
                        CountryName = c.String(nullable: false, maxLength: 70),
                        ShortForm = c.String(nullable: false, maxLength: 10),
                        Currency = c.String(nullable: false, maxLength: 10),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.CountryID);
            
            CreateTable(
                "dbo.Designations",
                c => new
                    {
                        DesignationID = c.Int(nullable: false, identity: true),
                        DesignationName = c.String(nullable: false, maxLength: 70),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.DesignationID);
            
            CreateTable(
                "dbo.Attendences",
                c => new
                    {
                        AttendenceID = c.Int(nullable: false, identity: true),
                        AttendenceDate = c.DateTime(nullable: false),
                        EmployeeID = c.Int(nullable: false),
                        TimeIn = c.Time(nullable: false, precision: 7),
                        TimeOut = c.Time(nullable: false, precision: 7),
                        TotalWorkingHours = c.Time(nullable: false, precision: 7),
                        DailyWorkingHours = c.Time(nullable: false, precision: 7),
                        StatusID = c.Int(nullable: false),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.AttendenceID)
                .ForeignKey("dbo.AttendenceStatus", t => t.StatusID, cascadeDelete: true)
                .ForeignKey("dbo.EmployeeMasters", t => t.EmployeeID, cascadeDelete: true)
                .Index(t => t.EmployeeID)
                .Index(t => t.StatusID);
            
            CreateTable(
                "dbo.AttendenceStatus",
                c => new
                    {
                        AttendenceStatusID = c.Int(nullable: false, identity: true),
                        AttendenceStatusName = c.String(nullable: false, maxLength: 70),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.AttendenceStatusID);
            
            CreateTable(
                "dbo.EmployeeMasters",
                c => new
                    {
                        EmployeeID = c.Int(nullable: false, identity: true),
                        AttendenceReferenceID = c.Int(nullable: false),
                        EmployeeName = c.String(nullable: false, maxLength: 70),
                        StaffID = c.Int(nullable: false),
                        ShiftID = c.Int(nullable: false),
                        DesignationID = c.Int(nullable: false),
                        DepartmentID = c.Int(nullable: false),
                        QualificationType = c.String(nullable: false, maxLength: 50),
                        QualificationDescription = c.String(nullable: false, maxLength: 150),
                        PhoneNumber = c.String(maxLength: 20),
                        MobileNumber = c.String(nullable: false, maxLength: 20),
                        FamilyContactNumber = c.String(nullable: false, maxLength: 20),
                        ContactPersonName = c.String(nullable: false, maxLength: 20),
                        Address = c.String(nullable: false, maxLength: 200),
                        ContactPersonRelationship = c.String(nullable: false, maxLength: 50),
                        NationalityID = c.Int(nullable: false),
                        CountryID = c.Int(nullable: false),
                        RegionID = c.Int(nullable: false),
                        Gender = c.String(nullable: false, maxLength: 10),
                        DOB = c.DateTime(nullable: false),
                        InternationalContactNumber = c.String(nullable: false, maxLength: 20),
                        PhotoPath = c.String(nullable: false),
                        Status = c.String(nullable: false, maxLength: 70),
                        MedicalHistory = c.String(),
                        LeaveBalance = c.Single(nullable: false),
                        AccountNumber = c.String(nullable: false),
                        JoiningDate = c.DateTime(nullable: false),
                        AccountTypeID = c.Int(nullable: false),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.EmployeeID)
                .ForeignKey("dbo.AccountTypes", t => t.AccountTypeID, cascadeDelete: true)
                .ForeignKey("dbo.Countries", t => t.CountryID, cascadeDelete: true)
                .ForeignKey("dbo.Departments", t => t.DepartmentID, cascadeDelete: true)
                .ForeignKey("dbo.Designations", t => t.DesignationID, cascadeDelete: true)
                .ForeignKey("dbo.Nationalities", t => t.NationalityID, cascadeDelete: true)
                .ForeignKey("dbo.Regions", t => t.RegionID, cascadeDelete: true)
                .ForeignKey("dbo.ShiftMasters", t => t.ShiftID, cascadeDelete: true)
                .ForeignKey("dbo.Staff", t => t.StaffID, cascadeDelete: true)
                .Index(t => t.StaffID)
                .Index(t => t.ShiftID)
                .Index(t => t.DesignationID)
                .Index(t => t.DepartmentID)
                .Index(t => t.NationalityID)
                .Index(t => t.CountryID)
                .Index(t => t.RegionID)
                .Index(t => t.AccountTypeID);
            
            CreateTable(
                "dbo.Departments",
                c => new
                    {
                        DepartmentID = c.Int(nullable: false, identity: true),
                        DepartmentName = c.String(nullable: false, maxLength: 70),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.DepartmentID);
            
            CreateTable(
                "dbo.Nationalities",
                c => new
                    {
                        NationalityID = c.Int(nullable: false, identity: true),
                        NationalityName = c.String(nullable: false, maxLength: 70),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.NationalityID);
            
            CreateTable(
                "dbo.Regions",
                c => new
                    {
                        RegionID = c.Int(nullable: false, identity: true),
                        RegionName = c.String(nullable: false, maxLength: 70),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.RegionID);
            
            CreateTable(
                "dbo.ShiftMasters",
                c => new
                    {
                        ShiftID = c.Int(nullable: false, identity: true),
                        ShiftName = c.String(maxLength: 70),
                        StartTime = c.Time(nullable: false, precision: 7),
                        EndTime = c.Time(nullable: false, precision: 7),
                        BreakStartTime = c.Time(nullable: false, precision: 7),
                        BreakEndTime = c.Time(nullable: false, precision: 7),
                        TotalTime = c.Time(nullable: false, precision: 7),
                        TotalBreakHours = c.Time(nullable: false, precision: 7),
                        TotalWorkingHours = c.Time(nullable: false, precision: 7),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.ShiftID);
            
            CreateTable(
                "dbo.Staff",
                c => new
                    {
                        StaffID = c.Int(nullable: false, identity: true),
                        StaffName = c.String(nullable: false, maxLength: 70),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.StaffID);
            
            CreateTable(
                "dbo.BankMasters",
                c => new
                    {
                        BankID = c.Int(nullable: false, identity: true),
                        BankName = c.String(maxLength: 70),
                        BranchName = c.String(maxLength: 70),
                        ContactPerson = c.String(maxLength: 70),
                        ContactNumber = c.String(maxLength: 20),
                        RegionID = c.Int(nullable: false),
                        LocationID = c.Int(nullable: false),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.BankID)
                .ForeignKey("dbo.Locations", t => t.LocationID, cascadeDelete: true)
                .ForeignKey("dbo.Regions", t => t.RegionID, cascadeDelete: true)
                .Index(t => t.RegionID)
                .Index(t => t.LocationID);
            
            CreateTable(
                "dbo.Locations",
                c => new
                    {
                        LocationID = c.Int(nullable: false, identity: true),
                        LocationName = c.String(nullable: false, maxLength: 70),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.LocationID);
            
            CreateTable(
                "dbo.CompanyDocumentAccessDetails",
                c => new
                    {
                        CompanyDocumentAccessDetailID = c.Int(nullable: false, identity: true),
                        DocumentID = c.Int(nullable: false),
                        EmployeeID = c.Int(nullable: false),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.CompanyDocumentAccessDetailID)
                .ForeignKey("dbo.DocumentDetails", t => t.DocumentID, cascadeDelete: true)
                .ForeignKey("dbo.EmployeeMasters", t => t.EmployeeID, cascadeDelete: true)
                .Index(t => t.DocumentID)
                .Index(t => t.EmployeeID);
            
            CreateTable(
                "dbo.DocumentDetails",
                c => new
                    {
                        DocumentID = c.Int(nullable: false, identity: true),
                        CompanyID = c.Int(nullable: false),
                        EmployeeID = c.Int(nullable: false),
                        DocumentCategoryID = c.Int(nullable: false),
                        DocumentTypeID = c.Int(nullable: false),
                        SearchName = c.String(nullable: false, maxLength: 70),
                        DocumentIssueDate = c.DateTime(nullable: false),
                        ExpiryDate = c.DateTime(nullable: false),
                        IssuingAuthority = c.String(nullable: false, maxLength: 70),
                        IsSetting = c.Boolean(nullable: false),
                        DocumentRenewalStatusID = c.Int(nullable: false),
                        DocumentNumber = c.String(nullable: false, maxLength: 50),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.DocumentID)
                .ForeignKey("dbo.CompanyMasters", t => t.CompanyID, cascadeDelete: false)
                .ForeignKey("dbo.DocumentCategories", t => t.DocumentCategoryID, cascadeDelete: true)
                .ForeignKey("dbo.DocumentRenewalStatus", t => t.DocumentRenewalStatusID, cascadeDelete: true)
                .ForeignKey("dbo.DocumentTypes", t => t.DocumentTypeID, cascadeDelete: true)
                .ForeignKey("dbo.EmployeeMasters", t => t.EmployeeID, cascadeDelete: false)
                .Index(t => t.CompanyID)
                .Index(t => t.EmployeeID)
                .Index(t => t.DocumentCategoryID)
                .Index(t => t.DocumentTypeID)
                .Index(t => t.DocumentRenewalStatusID);
            
            CreateTable(
                "dbo.DocumentCategories",
                c => new
                    {
                        DocumentCategoryID = c.Int(nullable: false, identity: true),
                        DocumentCategoryName = c.String(nullable: false, maxLength: 70),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.DocumentCategoryID);
            
            CreateTable(
                "dbo.DocumentRenewalStatus",
                c => new
                    {
                        DocumentRenewalStatusID = c.Int(nullable: false, identity: true),
                        DocumentRenewalStatusName = c.String(nullable: false, maxLength: 70),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.DocumentRenewalStatusID);
            
            CreateTable(
                "dbo.DocumentTypes",
                c => new
                    {
                        DocumentTypeID = c.Int(nullable: false, identity: true),
                        DocumentTypeName = c.String(nullable: false, maxLength: 70),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.DocumentTypeID);
            
            CreateTable(
                "dbo.Deductions",
                c => new
                    {
                        DeductionID = c.Int(nullable: false, identity: true),
                        EmployeeID = c.Int(nullable: false),
                        DeductionTypeID = c.Int(nullable: false),
                        StartDate = c.DateTime(nullable: false),
                        EndDate = c.DateTime(nullable: false),
                        TotalMonth = c.Int(nullable: false),
                        Basic = c.Single(nullable: false),
                        Telephone = c.Single(nullable: false),
                        Housing = c.Single(nullable: false),
                        Transport = c.Single(nullable: false),
                        TotalAmount = c.Single(nullable: false),
                        OtherText = c.String(maxLength: 70),
                        OtherNumber = c.String(),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.DeductionID)
                .ForeignKey("dbo.DeductionTypes", t => t.DeductionTypeID, cascadeDelete: true)
                .ForeignKey("dbo.EmployeeMasters", t => t.EmployeeID, cascadeDelete: true)
                .Index(t => t.EmployeeID)
                .Index(t => t.DeductionTypeID);
            
            CreateTable(
                "dbo.DeductionDetails",
                c => new
                    {
                        DeductionDetailID = c.Int(nullable: false, identity: true),
                        DeductionID = c.Int(nullable: false),
                        DeductionDate = c.DateTime(nullable: false),
                        Basic = c.Single(nullable: false),
                        Telephone = c.Single(nullable: false),
                        Housing = c.Single(nullable: false),
                        Transport = c.Single(nullable: false),
                        TotalDeduction = c.Single(nullable: false),
                        OtherText = c.String(maxLength: 70),
                        IsPayslipIssued = c.Boolean(nullable: false),
                        OtherNumber = c.String(),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.DeductionDetailID)
                .ForeignKey("dbo.Deductions", t => t.DeductionID, cascadeDelete: true)
                .Index(t => t.DeductionID);
            
            CreateTable(
                "dbo.DeductionTypes",
                c => new
                    {
                        DeductionTypeID = c.Int(nullable: false, identity: true),
                        DeductionTypeName = c.String(nullable: false, maxLength: 70),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.DeductionTypeID);
            
            CreateTable(
                "dbo.Increments",
                c => new
                    {
                        IncrementID = c.Int(nullable: false, identity: true),
                        EmployeeID = c.Int(nullable: false),
                        IncrementDate = c.DateTime(nullable: false),
                        Basic = c.Single(nullable: false),
                        Telephone = c.Single(nullable: false),
                        Housing = c.Single(nullable: false),
                        Transport = c.Single(nullable: false),
                        TotalSalary = c.Single(nullable: false),
                        OtherText = c.String(maxLength: 70),
                        OtherNumber = c.String(maxLength: 20),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.IncrementID)
                .ForeignKey("dbo.EmployeeMasters", t => t.EmployeeID, cascadeDelete: true)
                .Index(t => t.EmployeeID);
            
            CreateTable(
                "dbo.Leaves",
                c => new
                    {
                        LeaveID = c.Int(nullable: false, identity: true),
                        EmployeeID = c.Int(nullable: false),
                        LeaveTypeID = c.Int(nullable: false),
                        Date = c.DateTime(nullable: false),
                        FromDate = c.DateTime(nullable: false),
                        ToDate = c.DateTime(nullable: false),
                        LeaveBalance = c.Single(nullable: false),
                        LeaveDocumentPath = c.String(nullable: false),
                        TotalLeaveDays = c.Single(nullable: false),
                        LeaveStatusID = c.Int(nullable: false),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.LeaveID)
                .ForeignKey("dbo.EmployeeMasters", t => t.EmployeeID, cascadeDelete: true)
                .ForeignKey("dbo.LeaveStatus", t => t.LeaveStatusID, cascadeDelete: true)
                .ForeignKey("dbo.LeaveTypes", t => t.LeaveTypeID, cascadeDelete: true)
                .Index(t => t.EmployeeID)
                .Index(t => t.LeaveTypeID)
                .Index(t => t.LeaveStatusID);
            
            CreateTable(
                "dbo.LeaveStatus",
                c => new
                    {
                        LeaveStatusID = c.Int(nullable: false, identity: true),
                        LeaveStatusName = c.String(nullable: false, maxLength: 70),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.LeaveStatusID);
            
            CreateTable(
                "dbo.LeaveTypes",
                c => new
                    {
                        LeaveTypeID = c.Int(nullable: false, identity: true),
                        LeaveTypeName = c.String(nullable: false, maxLength: 70),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.LeaveTypeID);
            
            CreateTable(
                "dbo.Participants",
                c => new
                    {
                        ParticipantID = c.Int(nullable: false, identity: true),
                        EmployeeID = c.Int(nullable: false),
                        AppointmentID = c.Int(nullable: false),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.ParticipantID)
                .ForeignKey("Appointments", t => t.AppointmentID, cascadeDelete: true)
                .ForeignKey("EmployeeMasters", t => t.EmployeeID, cascadeDelete: false)
                .Index(t => t.EmployeeID)
                .Index(t => t.AppointmentID);
            
            CreateTable(
                "dbo.PaySlips",
                c => new
                    {
                        PaySlipID = c.Int(nullable: false, identity: true),
                        EmployeeID = c.Int(nullable: false),
                        Date = c.DateTime(nullable: false),
                        TotalDays = c.Single(nullable: false),
                        TotalWorkingDays = c.Single(nullable: false),
                        Basic = c.Single(nullable: false),
                        Telephone = c.Single(nullable: false),
                        Housing = c.Single(nullable: false),
                        Transport = c.Single(nullable: false),
                        TotalSalary = c.Single(nullable: false),
                        OtherText = c.String(maxLength: 70),
                        OtherNumber = c.String(),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.PaySlipID)
                .ForeignKey("dbo.EmployeeMasters", t => t.EmployeeID, cascadeDelete: true)
                .Index(t => t.EmployeeID);
            
            CreateTable(
                "dbo.Salaries",
                c => new
                    {
                        SalaryID = c.Int(nullable: false, identity: true),
                        EmployeeID = c.Int(nullable: false),
                        Basic = c.Single(nullable: false),
                        Telephone = c.Single(nullable: false),
                        Housing = c.Single(nullable: false),
                        Transport = c.Single(nullable: false),
                        TotalSalary = c.Single(nullable: false),
                        OtherText = c.String(maxLength: 70),
                        IsInitial = c.Boolean(nullable: false),
                        OtherNumber = c.String(),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.SalaryID)
                .ForeignKey("dbo.EmployeeMasters", t => t.EmployeeID, cascadeDelete: true)
                .Index(t => t.EmployeeID);
            
            CreateTable(
                "dbo.SettingMasters",
                c => new
                    {
                        SettingID = c.Int(nullable: false, identity: true),
                        DocumentID = c.Int(),
                        AppointmentID = c.Int(),
                        IsPopUpRequired = c.Boolean(nullable: false),
                        IsEmailRequired = c.Boolean(nullable: false),
                        PopUpDays = c.Int(nullable: false),
                        EmailDays = c.Int(nullable: false),
                        Email = c.String(),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.SettingID)
                .ForeignKey("dbo.Appointments", t => t.AppointmentID)
                .ForeignKey("dbo.DocumentDetails", t => t.DocumentID)
                .Index(t => t.DocumentID)
                .Index(t => t.AppointmentID);
            
            CreateTable(
                "dbo.ShareHolderDetails",
                c => new
                    {
                        ShareHolderID = c.Int(nullable: false, identity: true),
                        ShareHolderName = c.String(nullable: false, maxLength: 70),
                        ShareHolderTypeID = c.Int(nullable: false),
                        MobileNumber = c.String(nullable: false, maxLength: 20),
                        ContactNumber = c.String(maxLength: 20),
                        Address = c.String(),
                        DigitalSignature = c.String(nullable: false),
                        AuthorisedCapital = c.String(nullable: false, maxLength: 70),
                        TotalCapital = c.String(nullable: false),
                        ShareValue = c.Single(nullable: false),
                        CompanyID = c.Int(nullable: false),
                        EmployeeID = c.Int(nullable: false),
                        IssuedCapital = c.String(nullable: false),
                        NomialValue = c.Single(nullable: false),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.ShareHolderID)
                .ForeignKey("dbo.CompanyMasters", t => t.CompanyID, cascadeDelete: true)
                .ForeignKey("dbo.EmployeeMasters", t => t.EmployeeID, cascadeDelete: false)
                .ForeignKey("dbo.ShareHolderTypes", t => t.ShareHolderTypeID, cascadeDelete: true)
                .Index(t => t.ShareHolderTypeID)
                .Index(t => t.CompanyID)
                .Index(t => t.EmployeeID);
            
            CreateTable(
                "dbo.ShareHolderTypes",
                c => new
                    {
                        ShareHolderTypeID = c.Int(nullable: false, identity: true),
                        ShareHolderTypeName = c.String(maxLength: 70),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.ShareHolderTypeID);
            
            CreateTable(
                "dbo.UserAccessDetails",
                c => new
                    {
                        UserAccessDetailID = c.Int(nullable: false, identity: true),
                        InterfaceID = c.Int(nullable: false),
                        EventAccess = c.Int(nullable: false),
                        UserRoleID = c.Int(nullable: false),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.UserAccessDetailID)
                .ForeignKey("dbo.Interfaces", t => t.InterfaceID, cascadeDelete: true)
                .ForeignKey("dbo.UserRoles", t => t.UserRoleID, cascadeDelete: true)
                .Index(t => t.InterfaceID)
                .Index(t => t.UserRoleID);
            
            CreateTable(
                "dbo.Interfaces",
                c => new
                    {
                        InterfaceID = c.Int(nullable: false, identity: true),
                        InterfaceName = c.String(maxLength: 70),
                        ParentInterfaceID = c.Int(nullable: false),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.InterfaceID);
            
            CreateTable(
                "dbo.UserRoles",
                c => new
                    {
                        UserRoleID = c.Int(nullable: false, identity: true),
                        RoleName = c.String(nullable: false),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.UserRoleID);
            
            CreateTable(
                "dbo.UserMasters",
                c => new
                    {
                        UserID = c.Int(nullable: false, identity: true),
                        UserName = c.String(nullable: false, maxLength: 70),
                        Password = c.String(nullable: false, maxLength: 20),
                        UserRoleID = c.Int(nullable: false),
                        EmployeeID = c.Int(),
                        CreatedByUserID = c.Int(nullable: false),
                        UpdatedByUserID = c.Int(),
                        CreatedDate = c.DateTime(nullable: false),
                        UpdatedDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        Remarks = c.String(),
                    })
                .PrimaryKey(t => t.UserID)
                .ForeignKey("dbo.EmployeeMasters", t => t.EmployeeID)
                .ForeignKey("dbo.UserRoles", t => t.UserRoleID, cascadeDelete: true)
                .Index(t => t.UserRoleID)
                .Index(t => t.EmployeeID);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserMasters", "UserRoleID", "dbo.UserRoles");
            DropForeignKey("dbo.UserMasters", "EmployeeID", "dbo.EmployeeMasters");
            DropForeignKey("dbo.UserAccessDetails", "UserRoleID", "dbo.UserRoles");
            DropForeignKey("dbo.UserAccessDetails", "InterfaceID", "dbo.Interfaces");
            DropForeignKey("dbo.ShareHolderDetails", "ShareHolderTypeID", "dbo.ShareHolderTypes");
            DropForeignKey("dbo.ShareHolderDetails", "EmployeeID", "dbo.EmployeeMasters");
            DropForeignKey("dbo.ShareHolderDetails", "CompanyID", "dbo.CompanyMasters");
            DropForeignKey("dbo.SettingMasters", "DocumentID", "dbo.DocumentDetails");
            DropForeignKey("dbo.SettingMasters", "AppointmentID", "dbo.Appointments");
            DropForeignKey("dbo.Salaries", "EmployeeID", "dbo.EmployeeMasters");
            DropForeignKey("dbo.PaySlips", "EmployeeID", "dbo.EmployeeMasters");
            DropForeignKey("dbo.Participants", "EmployeeID", "dbo.EmployeeMasters");
            DropForeignKey("dbo.Participants", "AppointmentID", "dbo.Appointments");
            DropForeignKey("dbo.Leaves", "LeaveTypeID", "dbo.LeaveTypes");
            DropForeignKey("dbo.Leaves", "LeaveStatusID", "dbo.LeaveStatus");
            DropForeignKey("dbo.Leaves", "EmployeeID", "dbo.EmployeeMasters");
            DropForeignKey("dbo.Increments", "EmployeeID", "dbo.EmployeeMasters");
            DropForeignKey("dbo.Deductions", "EmployeeID", "dbo.EmployeeMasters");
            DropForeignKey("dbo.Deductions", "DeductionTypeID", "dbo.DeductionTypes");
            DropForeignKey("dbo.DeductionDetails", "DeductionID", "dbo.Deductions");
            DropForeignKey("dbo.CompanyDocumentAccessDetails", "EmployeeID", "dbo.EmployeeMasters");
            DropForeignKey("dbo.CompanyDocumentAccessDetails", "DocumentID", "dbo.DocumentDetails");
            DropForeignKey("dbo.DocumentDetails", "EmployeeID", "dbo.EmployeeMasters");
            DropForeignKey("dbo.DocumentDetails", "DocumentTypeID", "dbo.DocumentTypes");
            DropForeignKey("dbo.DocumentDetails", "DocumentRenewalStatusID", "dbo.DocumentRenewalStatus");
            DropForeignKey("dbo.DocumentDetails", "DocumentCategoryID", "dbo.DocumentCategories");
            DropForeignKey("dbo.DocumentDetails", "CompanyID", "dbo.CompanyMasters");
            DropForeignKey("dbo.BankMasters", "RegionID", "dbo.Regions");
            DropForeignKey("dbo.BankMasters", "LocationID", "dbo.Locations");
            DropForeignKey("dbo.Attendences", "EmployeeID", "dbo.EmployeeMasters");
            DropForeignKey("dbo.EmployeeMasters", "StaffID", "dbo.Staff");
            DropForeignKey("dbo.EmployeeMasters", "ShiftID", "dbo.ShiftMasters");
            DropForeignKey("dbo.EmployeeMasters", "RegionID", "dbo.Regions");
            DropForeignKey("dbo.EmployeeMasters", "NationalityID", "dbo.Nationalities");
            DropForeignKey("dbo.EmployeeMasters", "DesignationID", "dbo.Designations");
            DropForeignKey("dbo.EmployeeMasters", "DepartmentID", "dbo.Departments");
            DropForeignKey("dbo.EmployeeMasters", "CountryID", "dbo.Countries");
            DropForeignKey("dbo.EmployeeMasters", "AccountTypeID", "dbo.AccountTypes");
            DropForeignKey("dbo.Attendences", "StatusID", "dbo.AttendenceStatus");
            DropForeignKey("dbo.Appointments", "DesignationID", "dbo.Designations");
            DropForeignKey("dbo.Appointments", "CompanyID", "dbo.CompanyMasters");
            DropForeignKey("dbo.CompanyMasters", "CountryID", "dbo.Countries");
            DropForeignKey("dbo.CompanyMasters", "CompanyTypeID", "dbo.CompanyTypes");
            DropForeignKey("dbo.CompanyMasters", "CompanyStatusID", "dbo.CompanyStatus");
            DropIndex("dbo.UserMasters", new[] { "EmployeeID" });
            DropIndex("dbo.UserMasters", new[] { "UserRoleID" });
            DropIndex("dbo.UserAccessDetails", new[] { "UserRoleID" });
            DropIndex("dbo.UserAccessDetails", new[] { "InterfaceID" });
            DropIndex("dbo.ShareHolderDetails", new[] { "EmployeeID" });
            DropIndex("dbo.ShareHolderDetails", new[] { "CompanyID" });
            DropIndex("dbo.ShareHolderDetails", new[] { "ShareHolderTypeID" });
            DropIndex("dbo.SettingMasters", new[] { "AppointmentID" });
            DropIndex("dbo.SettingMasters", new[] { "DocumentID" });
            DropIndex("dbo.Salaries", new[] { "EmployeeID" });
            DropIndex("dbo.PaySlips", new[] { "EmployeeID" });
            DropIndex("dbo.Participants", new[] { "AppointmentID" });
            DropIndex("dbo.Participants", new[] { "EmployeeID" });
            DropIndex("dbo.Leaves", new[] { "LeaveStatusID" });
            DropIndex("dbo.Leaves", new[] { "LeaveTypeID" });
            DropIndex("dbo.Leaves", new[] { "EmployeeID" });
            DropIndex("dbo.Increments", new[] { "EmployeeID" });
            DropIndex("dbo.DeductionDetails", new[] { "DeductionID" });
            DropIndex("dbo.Deductions", new[] { "DeductionTypeID" });
            DropIndex("dbo.Deductions", new[] { "EmployeeID" });
            DropIndex("dbo.DocumentDetails", new[] { "DocumentRenewalStatusID" });
            DropIndex("dbo.DocumentDetails", new[] { "DocumentTypeID" });
            DropIndex("dbo.DocumentDetails", new[] { "DocumentCategoryID" });
            DropIndex("dbo.DocumentDetails", new[] { "EmployeeID" });
            DropIndex("dbo.DocumentDetails", new[] { "CompanyID" });
            DropIndex("dbo.CompanyDocumentAccessDetails", new[] { "EmployeeID" });
            DropIndex("dbo.CompanyDocumentAccessDetails", new[] { "DocumentID" });
            DropIndex("dbo.BankMasters", new[] { "LocationID" });
            DropIndex("dbo.BankMasters", new[] { "RegionID" });
            DropIndex("dbo.EmployeeMasters", new[] { "AccountTypeID" });
            DropIndex("dbo.EmployeeMasters", new[] { "RegionID" });
            DropIndex("dbo.EmployeeMasters", new[] { "CountryID" });
            DropIndex("dbo.EmployeeMasters", new[] { "NationalityID" });
            DropIndex("dbo.EmployeeMasters", new[] { "DepartmentID" });
            DropIndex("dbo.EmployeeMasters", new[] { "DesignationID" });
            DropIndex("dbo.EmployeeMasters", new[] { "ShiftID" });
            DropIndex("dbo.EmployeeMasters", new[] { "StaffID" });
            DropIndex("dbo.Attendences", new[] { "StatusID" });
            DropIndex("dbo.Attendences", new[] { "EmployeeID" });
            DropIndex("dbo.CompanyMasters", new[] { "CompanyStatusID" });
            DropIndex("dbo.CompanyMasters", new[] { "CompanyTypeID" });
            DropIndex("dbo.CompanyMasters", new[] { "CountryID" });
            DropIndex("dbo.Appointments", new[] { "CompanyID" });
            DropIndex("dbo.Appointments", new[] { "DesignationID" });
            DropTable("dbo.UserMasters");
            DropTable("dbo.UserRoles");
            DropTable("dbo.Interfaces");
            DropTable("dbo.UserAccessDetails");
            DropTable("dbo.ShareHolderTypes");
            DropTable("dbo.ShareHolderDetails");
            DropTable("dbo.SettingMasters");
            DropTable("dbo.Salaries");
            DropTable("dbo.PaySlips");
            DropTable("dbo.Participants");
            DropTable("dbo.LeaveTypes");
            DropTable("dbo.LeaveStatus");
            DropTable("dbo.Leaves");
            DropTable("dbo.Increments");
            DropTable("dbo.DeductionTypes");
            DropTable("dbo.DeductionDetails");
            DropTable("dbo.Deductions");
            DropTable("dbo.DocumentTypes");
            DropTable("dbo.DocumentRenewalStatus");
            DropTable("dbo.DocumentCategories");
            DropTable("dbo.DocumentDetails");
            DropTable("dbo.CompanyDocumentAccessDetails");
            DropTable("dbo.Locations");
            DropTable("dbo.BankMasters");
            DropTable("dbo.Staff");
            DropTable("dbo.ShiftMasters");
            DropTable("dbo.Regions");
            DropTable("dbo.Nationalities");
            DropTable("dbo.Departments");
            DropTable("dbo.EmployeeMasters");
            DropTable("dbo.AttendenceStatus");
            DropTable("dbo.Attendences");
            DropTable("dbo.Designations");
            DropTable("dbo.Countries");
            DropTable("dbo.CompanyTypes");
            DropTable("dbo.CompanyStatus");
            DropTable("dbo.CompanyMasters");
            DropTable("dbo.Appointments");
            DropTable("dbo.AccountTypes");
        }
    }
}
