using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;
using HRMS.Core.Entities;
using HRMS.Core.Services;
using HRMS.WebUI.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HRMS.WebUI.Controllers
{
    [Authorize]
    public class ReportController : Controller
    {
        private IEmployeeService _employeeService;
        //private INationalityService _nationalityService;

        public ReportController(IEmployeeService _employeeService)
        {
            this._employeeService = _employeeService;
           // this._nationalityService = _nationalityService;
        }
        public ActionResult Index()
        {
            return View();
        }

        public void ShowReport(string Name, string StartDate, string EndDate,int CompanyID,string CompanyName, string EmployeeIds)
        {
            ReportDocument cryRpt = GetReport(Name, StartDate, EndDate);
            if (Name.ToLower().Contains("payslip") || Name.ToLower().Contains("gratuity"))
            {
                int[] _employeeIds = null;
                if (CompanyID > -1)
                {
                    var _employees = _employeeService.Get(e => e.CompanyID == CompanyID).ToList();
                    if (_employees != null)
                    {
                        _employeeIds = _employees.Select(e => Convert.ToInt32(e.EmployeeID)).ToArray();
                    }
                }
                else if (EmployeeIds != null && EmployeeIds != "")
                {
                    _employeeIds = EmployeeIds.Split(',').Select(n => Convert.ToInt32(n)).ToArray();
                }
                if (_employeeIds != null)
                {
                    cryRpt.SetParameterValue("EmployeeID", _employeeIds);
                }
            }
            if (Name.ToLower().Contains("salaryschedule"))
            {
                cryRpt.SetParameterValue("CompanyName", CompanyName);
            }
            cryRpt.ExportToHttpResponse(ExportFormatType.PortableDocFormat, System.Web.HttpContext.Current.Response, false, "crReport");
                cryRpt.Close();
            
        }
        public bool SendEmail(string Name, string StartDate, string EndDate, int CompanyID, List<int> EmployeeIds)
            {
            var _employees = _employeeService.Get(e => e.IsDeleted == false).ToList();
            int[] _employeeIds = null;
            if (CompanyID > -1)
            {
                _employees = _employees.Where(e => e.CompanyID == CompanyID).ToList();
                if (_employees != null)
                {
                    _employeeIds = _employees.Select(e => Convert.ToInt32(e.EmployeeID)).ToArray();
                }
            }
            else if(EmployeeIds != null)
            {
                if(EmployeeIds.Count > 0)
                {
                    _employeeIds = EmployeeIds.ToArray();
                }
            }
            if (_employeeIds != null)
            {
                for (int i = 0; i < EmployeeIds.Count; i++)
                {
                    ReportDocument cryRpt = GetReport(Name, StartDate, EndDate);
                    cryRpt.SetParameterValue("EmployeeID", EmployeeIds[i]);
                    var _tmpReportPath = "TempReportPath".GetConfigByKey<string>();
                    if (System.IO.File.Exists(_tmpReportPath))
                        System.IO.File.Delete(_tmpReportPath);
                    cryRpt.ExportToDisk(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat, _tmpReportPath);
                    if (cryRpt.Rows.Count > 0)
                    {
                        Utilities.SendEmail(
                              "Payslip",
                              "Please Download the Payslip in the attachement",
                              "SenderEmail".GetConfigByKey<string>(),
                              "SenderPassword".GetConfigByKey<string>(),
                              _employees.Where(e => e.EmployeeID == EmployeeIds[i]).Select(e => e.Email).FirstOrDefault(),
                              _tmpReportPath
                              );
                    }
                    cryRpt.Close();


                    //cryRpt.SaveAs("~/Content/Documents/test repost" + ids + ".pdf");
                    // cryRpt.ExportToHttpResponse(ExportFormatType.PortableDocFormat, System.Web.HttpContext.Current.Response, false, "crReport");
                }
                return true;
            }
            else
                return false;   
          

            //cryRpt.PrintToPrinter(2, true, 1, 2);
            //using (ReportClass rptH = new ReportClass())
            //{
            //    rptH.FileName = Server.MapPath("~/") + "//Reports//Company.rpt";
            //    rptH.Load();
            //    rptH.ExportToHttpResponse(ExportFormatType.PortableDocFormat, System.Web.HttpContext.Current.Response, false, "crReport");
            //}
        }
        public ReportDocument GetReport(string Name, string StartDate, string EndDate)
        {
            //var logonProperties = new DbConnectionAttributes();
            //logonProperties.Collection.Set("Connection String", @"Driver={SQL Server};Server=TODD-PC\SQLEXPRESS2;Trusted_Connection=Yes;");
            //logonProperties.Collection.Set("UseDSNProperties", false);

            //var connectionAttributes = new DbConnectionAttributes();
            //connectionAttributes.Collection.Set("Database DLL", "crdb_odbc.dll");
            //connectionAttributes.Collection.Set("QE_DatabaseName", String.Empty);
            //connectionAttributes.Collection.Set("QE_DatabaseType", "ODBC (RDO)");
            //connectionAttributes.Collection.Set("QE_LogonProperties", logonProperties);
            //connectionAttributes.Collection.Set("QE_ServerDescription", @"TODD-PC\SQLEXPRESS2");
            //connectionAttributes.Collection.Set("QE_SQLDB", true);
            //connectionAttributes.Collection.Set("SSO Enabled", false);

            //return new ConnectionInfo
            //{
            //    Attributes = connectionAttributes,
            //    // These don't seem necessary, but we'll include them anyway: ReportDocument.Load does
            //    ServerName = @"TODD-PC\SQLEXPRESS2",
            //    Type = ConnectionInfoType.CRQE
            //};

            ReportDocument cryRpt = new ReportDocument();
            cryRpt.Load(Server.MapPath("~/") + "//Reports//" + Name + ".rpt");
            TableLogOnInfos crtableLogoninfos = new TableLogOnInfos();
            TableLogOnInfo crtableLogoninfo = new TableLogOnInfo();
            ConnectionInfo crConnectionInfo = new ConnectionInfo();
            Tables CrTables;
            
          
            crConnectionInfo.ServerName = "GWSQLSERVER\\GWSQLSERVER";
            crConnectionInfo.DatabaseName = "PR_wemsportal";
            crConnectionInfo.UserID = "sa";
            crConnectionInfo.Password = "gw5209";

            CrTables = cryRpt.Database.Tables;
            foreach (CrystalDecisions.CrystalReports.Engine.Table CrTable in CrTables)
            {
                crtableLogoninfo = CrTable.LogOnInfo;
                crtableLogoninfo.ConnectionInfo = crConnectionInfo;
                CrTable.ApplyLogOnInfo(crtableLogoninfo);
            }
            crtableLogoninfo.ConnectionInfo = crConnectionInfo;
            cryRpt.Refresh();
            cryRpt.SetParameterValue("StartDate", StartDate);
            cryRpt.SetParameterValue("EndDate", EndDate);
            return cryRpt;




        }
    }
}
