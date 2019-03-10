using HRMS.Core.Data;
using HRMS.Core.Data.Repositories;
using HRMS.Core.Entities.Foundation;
using HRMS.Data.Repositories;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRMS.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly HRMSDbContext _context;
        private bool _disposed;
        private Hashtable _repositories;
        private ISettingRepository _settingRepository;

        public UnitOfWork()
        {
            _context = _context ?? new HRMSDbContext();
        }

        public ISettingRepository SettingRepository 
        {
            get
            {
                if (_settingRepository == null) return new SettingRepository(_context);
                else return _settingRepository;
            }
            set
            {
                _settingRepository = value;
            }
        }

        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            if (_repositories == null)
            {
                _repositories = new Hashtable();
            }

            var type = typeof(TEntity).Name;

            if (_repositories.ContainsKey(type))
            {
                return (IGenericRepository<TEntity>)_repositories[type];
            }

            var repositoryType = typeof(GenericRepository<>);

            _repositories.Add(type, Activator.CreateInstance(repositoryType.MakeGenericType(typeof(TEntity)), _context));

            return (IGenericRepository<TEntity>)_repositories[type];
        }
        public void Save()
        {
            try
            {
                _context.SaveChanges();
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName, ve.ErrorMessage);
                    }
                }
            }
        }
        //public void BeginTransaction()
        //{

        //    _context.BeginTransaction();
        //}

        //public int Commit()
        //{
        //    return _context.Commit();
        //}

        //public Task<int> CommitAsync()
        //{
        //    return _context.CommitAsync();
        //}

        //public void Rollback()
        //{
        //    _context.Rollback();
        //}

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public virtual void Dispose(bool disposing)
        {
            if (!_disposed && disposing)
            {
                _context.Dispose();
                foreach (IDisposable repository in _repositories.Values)
                {
                    repository.Dispose();
                }
            }
            _disposed = true;
        }
    }
}
