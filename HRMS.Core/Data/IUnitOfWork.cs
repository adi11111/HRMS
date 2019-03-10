using HRMS.Core.Data.Repositories;
using HRMS.Core.Entities.Foundation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Core.Data
{
    public interface IUnitOfWork
    {
        IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity;
        ISettingRepository SettingRepository { get; set; }
        void Save();
    }
}
