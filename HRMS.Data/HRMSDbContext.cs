using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;
using HRMS.Core.Entities;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace HRMS.Data
{
   public class HRMSDbContext : DbContext
    {
        public HRMSDbContext() : base("name=HRMSDbConnection")
        {
            
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //modelBuilder.Entity<Participant>()
            //.HasRequired<Appointment>(s => s.Appointment)
            //.WithOptional()
            //.WillCascadeOnDelete(false);
            //modelBuilder.Conventions.Remove<ManyToManyCascadeDeleteConvention>();
            //modelBuilder.Conventions.Remove<ManyToManyCascadeDeleteConvention>();
            //modelBuilder.Conventions.Remove<OneToOneConstraintIntroductionConvention>();
            //modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();

            // modelBuilder.Entity<Participant>()
            //.HasRequired(c => c.Appointment)

            //.WillCascadeOnDelete(false);

            //modelBuilder.Entity<Appointment>()
            //    .HasRequired(s => s.)
            //    .WithMany()
            //    .WillCascadeOnDelete(false);
            //modelBuilder.Entity<Participant>().HasRequired(i => i.Appointment).WillCascadeOnDelete(false);




            // modelBuilder.Entity<Participant>().HasRequired<Appointment>(x => x.Appointment).WithOptional().WillCascadeOnDelete(false);

            //CreateTable(
            // "dbo.Participants",
            // c => new
            // {
            //     ParticipantID = c.Int(nullable: false, identity: true),
            //     EmployeeID = c.Int(nullable: false),
            //     AppointmentID = c.Int(nullable: false),
            //     CreatedByUserID = c.Int(nullable: false),
            //     UpdatedByUserID = c.Int(),
            //     CreatedDate = c.DateTime(nullable: false),
            //     UpdatedDate = c.DateTime(),
            //     IsDeleted = c.Boolean(nullable: false),
            //     Remarks = c.String(),
            // })
            // .PrimaryKey(t => t.ParticipantID)
            // .ForeignKey("Appointments", t => t.AppointmentID, cascadeDelete: true)
            // .ForeignKey("EmployeeMasters", t => t.EmployeeID, cascadeDelete: false)
            // .Index(t => t.EmployeeID)
            // .Index(t => t.AppointmentID);
            Database.SetInitializer<HRMSDbContext>(null);
            base.OnModelCreating(modelBuilder);
        }
        #region DbSets
        public virtual IDbSet<Appointment> Appointment { get; set; }
        public virtual IDbSet<Participant> Participant { get; set; }
        public virtual IDbSet<Attendence> Attendence { get; set; }
        public virtual IDbSet<BankMaster> BankMaster { get; set; }
        public virtual IDbSet<CompanyDocumentAccessDetail> CompanyDocumentAccessDetail { get; set; }
        public virtual IDbSet<CompanyMaster> CompanyMaster { get; set; }
        public virtual IDbSet<Deduction> Deduction { get; set; }
        public virtual IDbSet<DeductionType> DeductionType { get; set; }
        public virtual IDbSet<DeductionDetail> DeductionDetail { get; set; }
        public virtual IDbSet<EmployeeMaster> EmployeeMaster { get; set; }
        public virtual IDbSet<Leave> Leave { get; set; }
        public virtual IDbSet<PaySlip> PaySlip { get; set; }
        public virtual IDbSet<ShareHolderType> ShareHolderType { get; set; }
        public virtual IDbSet<ShareHolderDetail> ShareHolderDetail { get; set; }
        public virtual IDbSet<UserAccessDetail> UserAccessDetail { get; set; }
        public virtual IDbSet<UserMaster> UserMaster { get; set; }
        public virtual IDbSet<Increment> Increment { get; set; }
        public virtual IDbSet<Salary> Salary { get; set; }
        public virtual IDbSet<AccountType> AccountType { get; set; }
        public virtual IDbSet<AttendenceStatus> AttendenceStatus { get; set; }
        public virtual IDbSet<CompanyType> CompanyType { get; set; }
        public virtual IDbSet<CompanyStatus> CompanyStatus { get; set; }
        public virtual IDbSet<DocumentDetail> DocumentDetail { get; set; }
        public virtual IDbSet<DocumentCategory> DocumentCategory { get; set; }
        public virtual IDbSet<DocumentType> DocumentType { get; set; }
        public virtual IDbSet<DocumentRenewalStatus> DocumentRenewalStatus { get; set; }
        public virtual IDbSet<LeaveStatus> LeaveStatus { get; set; }
        public virtual IDbSet<LeaveType> LeaveType { get; set; }
        public virtual IDbSet<Location> Location { get; set; }
        public virtual IDbSet<Nationality> Nationality { get; set; }
        public virtual IDbSet<Region> Region { get; set; }
        public virtual IDbSet<Designation> Designation { get; set; }
        public virtual IDbSet<Country> Country { get; set; }
        public virtual IDbSet<Staff> Staff { get; set; }
        public virtual IDbSet<ShiftMaster> ShiftMaster { get; set; }
        public virtual IDbSet<Department> Department { get; set; }
        public virtual IDbSet<SettingMaster> SettingMaster { get; set; }
        public virtual IDbSet<UserRole> UserRole{ get; set; }
        public virtual IDbSet<PublicHoliday> PublicHoliday { get; set; }
        public virtual IDbSet<GraduitySetting> GraduitySetting { get; set; }
        public virtual IDbSet<Gratuity> Gratuity { get; set; }
        #endregion
    }
}
