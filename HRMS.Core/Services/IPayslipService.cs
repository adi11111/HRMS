using HRMS.Core.Entities;
using HRMS.Core.Entities.Foundation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Core.Services
{
    public interface IPayslipService : IBaseService<PaySlip>
    {
        List<PaySlip> GenerateReport(int month, int year, int companyId);
        bool ProcessPayslip(List<PaySlip> payslips, int month);
    }
}
