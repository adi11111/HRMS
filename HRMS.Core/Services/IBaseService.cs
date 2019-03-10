using HRMS.Core.Entities.Foundation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Core.Services
{
   public interface IBaseService<TEntity> where TEntity : BaseEntity
    {
        List<TEntity> Get(
            Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            params Expression<Func<TEntity, object>>[] includes); //where TEntity : BaseEntity;
        void AddRange(List<TEntity> entities);
        TEntity Insert(TEntity entity);// where TEntity : BaseEntity;
        void Update(TEntity entity); //where TEntity : BaseEntity;
        void Update(TEntity entity, bool isSoftDelete);
        void Delete(object id); //where TEntity : BaseEntity;
        IEnumerable<TEntity> ExecSql(string query, params object[] parameters);
        int ExecSqlQuery(string query, params object[] parameters);
    }
}
