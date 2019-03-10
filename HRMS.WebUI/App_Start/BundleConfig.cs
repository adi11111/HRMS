using System.Web;
using System.Web.Optimization;

namespace HRMS.WebUI
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));
            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/bundles/css").Include(
                      "~/Content/bootstrap.min.css",
                      "~/Content/font-awesome.min.css",
                      "~/Content/nprogress.css",
                      "~/Content/green.css",
                      "~/Content/bootstrap-progressbar-3.3.4.min.css",
                      "~/Content/jquery.dataTables.css",
                      "~/Content/daterangepicker.css",
                      "~/Content/clockpicker.css"
                      ));

            bundles.Add(new StyleBundle("~/Content/css").Include(
            "~/Content/bootstrap.css",
            "~/Content/site.css"));

            bundles.Add(new ScriptBundle("~/bundles/js").Include(
                      "~/Scripts/jquery.min.js",
                      "~/Scripts/bootstrap.min.js",
                      "~/Scripts/fastclick.js",
                      "~/Scripts/nprogress.js",
                      "~/Scripts/Chart.min.js",
                      "~/Scripts/gauge.min.js",
                      "~/Scripts/echarts.min.js",
                      "~/Scripts/bootstrap-progressbar.min.js",
                      "~/Scripts/icheck.min.js",
                      "~/Scripts/skycons.js",
                      "~/Scripts/jquery.flot.js",
                      "~/Scripts/jquery.flot.pie.js",
                      "~/Scripts/jquery.flot.resize.js",
                      "~/Scripts/jquery.flot.stack.js",
                      "~/Scripts/jquery.flot.time.js",
                      "~/Scripts/moment.js",
                      "~/Scripts/daterangepicker.js",
                     
                      "~/Scripts/date.js",
                       "~/Scripts/custom.js",
                      "~/Scripts/angular/angular.js",
                      "~/Scripts/angular/angular-aria.js",
                      "~/Scripts/angular/angular-animate.js",
                      "~/Scripts/angular/angular-resource.js",
                      "~/Scripts/angular/angular-route.js",
                      "~/Scripts/angular/angular-cookies.js",
                      "~/Scripts/jquery.dataTables.min.js",
                      "~/Scripts/dataTables.responsive.min.js",
                      "~/Scripts/clockpicker.js",
                      //"~/Scripts/angular/angular.js",
                      //"~/Scripts/angular/angular.js",
                      //"~/Scripts/angular/angular.js",
                      //"~/Scripts/angular/angular.js",
                      "~/Scripts/respond.js"));





        }
    }
}
