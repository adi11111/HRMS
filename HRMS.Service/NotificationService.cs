using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Configuration;
using System.Data.Entity;
using System.Net.Mail;

namespace HRMS.Service
{
    public partial class NotificationService : ServiceBase
    {
        HRMS.Data.HRMSDbContext context;
        public NotificationService()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            context = new Data.HRMSDbContext();
            this.WriteToFile("Simple Service started {0}");

            this.ScheduleService();
        }

        protected override void OnStop()
        {
            this.WriteToFile("Simple Service stopped {0}");
            this.Schedular.Dispose();
        }

        private Timer Schedular;

        public void ScheduleService()
        {
            try
            {
                Schedular = new Timer(new TimerCallback(SchedularCallback));
                string mode = (System.Configuration.ConfigurationManager.AppSettings["Mode"].ToUpper());
                this.WriteToFile("Simple Service Mode: " + mode + " {0}");

                //Set the Default Time.
                DateTime scheduledTime = DateTime.MinValue;

                if (mode == "DAILY")
                {
                    //Get the Scheduled Time from AppSettings.
                    scheduledTime = DateTime.Parse(System.Configuration.ConfigurationManager.AppSettings["ScheduledTime"]);
                    if (DateTime.Now > scheduledTime)
                    {
                        //If Scheduled Time is passed set Schedule for the next day.
                        scheduledTime = scheduledTime.AddDays(1);
                    }
                }

                if (mode.ToUpper() == "INTERVAL")
                {
                    //Get the Interval in Minutes from AppSettings.
                    int intervalMinutes = Convert.ToInt32(ConfigurationManager.AppSettings["IntervalMinutes"]);

                    //Set the Scheduled Time by adding the Interval to Current Time.
                    scheduledTime = DateTime.Now.AddMinutes(intervalMinutes);
                    if (DateTime.Now > scheduledTime)
                    {
                        //If Scheduled Time is passed set Schedule for the next Interval.
                        scheduledTime = scheduledTime.AddMinutes(intervalMinutes);
                    }
                }

                TimeSpan timeSpan = scheduledTime.Subtract(DateTime.Now);
                string schedule = string.Format("{0} day(s) {1} hour(s) {2} minute(s) {3} seconds(s)", timeSpan.Days, timeSpan.Hours, timeSpan.Minutes, timeSpan.Seconds);

                this.WriteToFile("Simple Service scheduled to run after: " + schedule + " {0}");

                //Get the difference in Minutes between the Scheduled and Current Time.
                int dueTime = Convert.ToInt32(timeSpan.TotalMilliseconds);

                //Change the Timer's Due Time.
                Schedular.Change(dueTime, Timeout.Infinite);
            }
            catch (Exception ex)
            {
                WriteToFile("Simple Service Error on: {0} " + ex.Message + ex.StackTrace);

                //Stop the Windows Service.
                using (System.ServiceProcess.ServiceController serviceController = new System.ServiceProcess.ServiceController("NotificationService"))
                {
                    serviceController.Stop();
                }
            }
        }

        private void SchedularCallback(object e)
        {
            this.WriteToFile("Simple Service Log: {0}");
             var notifications = context.SettingMaster
                  .GroupJoin(context.Appointment, s => s.AppointmentID, a => a.AppointmentID, (s, a) => new { s, a = a.DefaultIfEmpty() })
                  .SelectMany(sm => sm.a.Select(smd => new { sm.s, smd }))
                  .GroupJoin(context.Participant, ou => ou.smd.AppointmentID, part => part.AppointmentID, (ou, part) => new { ou, part = part.DefaultIfEmpty() })
                  .SelectMany(sm => sm.part.Select(smd => new { sm.ou, smd }))
                  .GroupJoin(context.DocumentDetail, s => s.ou.s.DocumentID, d => d.DocumentID, (s, d) => new { s, d = d.DefaultIfEmpty() })
                  .SelectMany(sm => sm.d.Select(smd => new { sm.s, smd }))
                  .Where(x => (x.s.ou.smd.AppointmentDate >= DateTime.Now && x.s.ou.s.IsEmailRequired &&
                   x.s.ou.s.EmailDays >= DbFunctions.DiffDays(DateTime.Now, x.s.ou.smd.AppointmentDate) &&
                    x.s.ou.smd.IsDeleted == false && x.s.smd.IsDeleted == false ||
                   (x.smd.ExpiryDate >= DateTime.Now && x.smd.IsDeleted == false &&
                   x.s.ou.s.EmailDays >= DbFunctions.DiffDays(DateTime.Now, x.smd.ExpiryDate) && x.s.ou.s.IsEmailRequired && 
                   (x.s.ou.s.Interval != 0 || (DbFunctions.DiffDays(DateTime.Now,  x.s.ou.s.LastEmailSent ?? DateTime.Now) ==  x.s.ou.s.Interval) || x.s.ou.s.LastEmailSent == null))))
                  .Select(g => new { Appointment = g.s.ou.smd, DocumentDetail = g.smd , Setting = g.s.ou.s }).ToList();
            var _senderEmail = ConfigurationManager.AppSettings["SenderEmail"].ToString();
            var _password = ConfigurationManager.AppSettings["SenderPassword"].ToString();
            for (int i = 0; i < notifications.Count; i++)
            {
                var _subject = "";
                var _body = "";
                var _email = "";
                if (notifications[i].Appointment == null)
                {
                    _subject = "Upcoming Document Expiry Notification";
                    _body = "Your Document is going to Expire on ( " + notifications[i].DocumentDetail.ExpiryDate + " ) <br/> Title : "
                     + notifications[i].DocumentDetail.SearchName;
                    _email = context.EmployeeMaster.FirstOrDefault(em => em.EmployeeID == notifications[i].Appointment.EmployeeID).Email;
                }
                else 
                {
                    _subject = "Upcoming Appointment Notification";
                    _body = "You have a upcoming appointment on ( " + notifications[i].Appointment.AppointmentDate + " ) <br/> Title : "
                    + notifications[i].Appointment.AppointmentName + "  Time : " + notifications[i].Appointment.StartTime + " - " + notifications[i].Appointment.EndTime;
                    _email = context.EmployeeMaster.FirstOrDefault(em => em.EmployeeID == notifications[i].DocumentDetail.EmployeeID).Email;
                }
                WriteToFile("Trying to send email to: " + _email);
                using (MailMessage mm = new MailMessage(_senderEmail, _email))
                {
                    mm.Subject = _subject;
                    mm.Body = _body;
                    mm.IsBodyHtml = true;
                    SmtpClient smtp = new SmtpClient();
                    smtp.Host = "smtp.gmail.com";
                    smtp.EnableSsl = true;
                    System.Net.NetworkCredential credentials = new System.Net.NetworkCredential();
                    credentials.UserName = _senderEmail;
                    credentials.Password = _password;
                    smtp.UseDefaultCredentials = true;
                    smtp.Credentials = credentials;
                    smtp.Port = 587;
                    smtp.Send(mm);
                    WriteToFile("Email sent successfully to: " + _email);
                }
            }
            this.ScheduleService();
        }

        private void WriteToFile(string text)
        {
            string path = ConfigurationManager.AppSettings["LogFilePath"] + "\\ServiceLog.txt";
            using (StreamWriter writer = new StreamWriter(path, true))
            {
                writer.WriteLine(string.Format(text, DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt")));
                writer.Close();
            }
        }
    }
}
