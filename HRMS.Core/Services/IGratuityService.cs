using HRMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Core.Services
{
    public interface IGratuityService : IBaseService<Gratuity>
    {
        List<Gratuity> GenerateReport( int companyId, DateTime settlementDate);
        bool ProcessGratuity(List<Gratuity> gratuity);
    }
}
