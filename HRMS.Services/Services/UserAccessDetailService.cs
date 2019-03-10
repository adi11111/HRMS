using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HRMS.Core.Services;
using HRMS.Core.Entities.Foundation;
using HRMS.Core.Data;
using HRMS.Core.Entities;
//using HRMS.Services.Services;

namespace HRMS.Services.Services
{
   public class UserAccessDetailService : BaseService<UserAccessDetail> , IUserAccessDetailService 
    {
        private IUnitOfWork _uow;
        public UserAccessDetailService(IUnitOfWork _uow) : base(_uow)
        {
            this._uow = _uow;
        }
        public bool DeleteBulk(List<UserAccessDetail> userAccessDetail)
        {
            foreach (var item in userAccessDetail)
            {
               _uow.Repository<UserAccessDetail>().Delete(item.UserAccessDetailID);
            }
            _uow.Save();
            return true;
        }
    }
}
