using HRMS.Core.Data;
using HRMS.Core.Entities;
using HRMS.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Services.Services
{
    public class NationalityService : BaseService<Nationality>, INationalityService
    {

        public NationalityService(IUnitOfWork _uow) : base(_uow)
        {

        }
    }
}
