using HRMS.Core.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Data.Repositories
{
    public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : class
    {
        private DbContext context;
        private DbSet<TEntity> dbSet;

        public GenericRepository(DbContext context)
        {
            this.context = context;
            this.dbSet = context.Set<TEntity>();
        }

        public virtual List<TEntity> Get(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null, params Expression<Func<TEntity, object>>[] includes)
        {
            IQueryable<TEntity> query = dbSet.AsNoTracking<TEntity>();

            foreach (Expression<Func<TEntity, object>> include in includes)
                query = query.Include(include);

            if (filter != null)
                query = query.Where(filter);

            if (orderBy != null)
                query = orderBy(query);

            return query.ToList();
        }

        public virtual IQueryable<TEntity> Query(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null)
        {
            IQueryable<TEntity> query = dbSet.AsNoTracking();

            if (filter != null)
                query = query.Where(filter);

            if (orderBy != null)
                query = orderBy(query);

            return query;
        }

        public virtual TEntity GetById(object id)
        {
            return dbSet.Find(id);
        }

        public virtual TEntity GetFirstOrDefault(Expression<Func<TEntity, bool>> filter = null, params Expression<Func<TEntity, object>>[] includes)
        {
            IQueryable<TEntity> query = dbSet;

            foreach (Expression<Func<TEntity, object>> include in includes)
                query = query.Include(include);

            return query.FirstOrDefault(filter);
        }

        public virtual void AddRange(List<TEntity> entities)
        {
            dbSet.AddRange(entities);
        }
        public virtual TEntity Insert(TEntity entity)
        {
            return dbSet.Add(entity);
        }

        public virtual void Update(TEntity entity)
        {   
            dbSet.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
        }
        public virtual void Update(TEntity entity,bool isSoftDelete)
        {
            dbSet.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            //try
            //{
            //    if (context.Entry(entity).State == EntityState.Detached)
            //    {
            //        dbSet.Attach(entity);
            //    }
            //    dbSet.Remove(entity);
            //    var _change = context.ChangeTracker.Entries<TEntity>().FirstOrDefault();
            //    if (_change != null)
            //    {
            //        _change.State = EntityState.Unchanged;
            //    }
            //    dbSet.Attach(entity);
            //    context.Entry(entity).State = EntityState.Modified;
            //}
            //catch (Exception ex)
            //{
            //   var _change = context.ChangeTracker.Entries<TEntity>().FirstOrDefault();
            //   if(_change != null)
            //    {
            //        _change.State = EntityState.Unchanged;
            //    }
            //}
        }

        public virtual bool Delete(object id)
        {
            TEntity entityToDelete = dbSet.Find(id);
            if (context.Entry(entityToDelete).State == EntityState.Detached)
            {
                dbSet.Attach(entityToDelete);
            }
            dbSet.Remove(entityToDelete);
            return true;
        }
        public IEnumerable<TEntity> ExecSql(string query, params object[] parameters)
        {
            return context.Database.SqlQuery<TEntity>(query, parameters);
        }
        public int ExecSqlQuery(string query, params object[] parameters)
        {
            return context.Database.ExecuteSqlCommand(query, parameters);
        }
    }
}
