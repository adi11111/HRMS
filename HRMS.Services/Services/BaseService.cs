using HRMS.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HRMS.Core.Entities.Foundation;
using System.Linq.Expressions;
using HRMS.Core.Data;
using HRMS.Core.Entities;

namespace HRMS.Services.Services
{
    public abstract class BaseService<TEntity> : IBaseService<TEntity> where TEntity : BaseEntity
    {
        private IUnitOfWork _uow;
        public BaseService(IUnitOfWork _uow)
        {
            this._uow = _uow;
        }
        public virtual void Delete(object id) //where TEntity : BaseEntity
        {
           _uow.Repository<TEntity>().Delete(id);
           _uow.Save();
            // throw new NotImplementedException();
        }

        public virtual IQueryable<TEntity> Query(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null)
        {
            return _uow.Repository<TEntity>().Query(filter,orderBy);
        }
        public virtual List<TEntity> Get(Expression<Func<TEntity, bool>> filter, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy, params Expression<Func<TEntity, object>>[] includes)// where TEntity : BaseEntity
        {
            return _uow.Repository<TEntity>().Get(filter,orderBy,includes);
        }
        public virtual void AddRange(List<TEntity> entities) ///where TEntity : BaseEntity
        {
            _uow.Repository<TEntity>().AddRange(entities);
            _uow.Save();
            //throw new NotImplementedException();
        }
        public virtual TEntity Insert(TEntity entity) ///where TEntity : BaseEntity
        {
            entity = _uow.Repository<TEntity>().Insert(entity);
             _uow.Save();
            return entity;
            //throw new NotImplementedException();
        }

        public virtual void Update(TEntity entity)// where TEntity : BaseEntity
        {
             _uow.Repository<TEntity>().Update(entity);
            _uow.Save();
            // throw new NotImplementedException();
        }
        public void Update(TEntity entity, bool isSoftDelete)
        {
            _uow.Repository<TEntity>().Update(entity,isSoftDelete);
            _uow.Save();
        }
        public IEnumerable<TEntity> ExecSql(string query, params object[] parameters)
        {
            var _result = _uow.Repository<TEntity>().ExecSql(query,parameters);
            //_uow.Save();
            return _result;
        }
        public int ExecSqlQuery(string query, params object[] parameters)
        {
            var _result = _uow.Repository<TEntity>().ExecSqlQuery(query, parameters);
            _uow.Save();
            return _result;
        }
        public static List<DateTime> GetNumberOfWeekendDays(DateTime start, DateTime stop)
        {
            List<DateTime> days = new List<DateTime>();
            while (start <= stop)
            {
                if (start.DayOfWeek == DayOfWeek.Friday || start.DayOfWeek == DayOfWeek.Saturday)
                {
                    days.Add(start);
                }
                start = start.AddDays(1);
            }
            return days;
        }
        public static int GetNumberOfWorkingDays(DateTime start, DateTime stop)
        {
            int days = 0;
            while (start <= stop)
            {
                if (start.DayOfWeek != DayOfWeek.Friday && start.DayOfWeek != DayOfWeek.Saturday)
                {
                    ++days;
                }
                start = start.AddDays(1);
            }
            return days;
        }
        public static int GetDaysInYear(int year)
        {
            var thisYear = new DateTime(year, 1, 1);
            var nextYear = new DateTime(year + 1, 1, 1);

            return (nextYear - thisYear).Days;
        }
        public float CalculateGratuity(GraduitySetting graduitySetting,Salary salary,float basic,int year,int month,int day = -1)
        {
            float _graduity = 0;
            if (graduitySetting != null && salary != null)
            {
                float _oneDaySalary = 0;
                

                if(salary.EmployeeMaster.CompanyID == 17)
                {
                    _oneDaySalary = salary.GratuitySalary / 26;
                }
                var _endDate = new DateTime(year, month, 1).AddMonths(1).AddDays(day);
                if(day != -1)
                {
                    _endDate = new DateTime(year,month,day);
                }
                int _totaldays = (_endDate - salary.EmployeeMaster.JoiningDate.AddDays(-1)).Days;
                int _years = _totaldays / 365;
                var _extraDays = _totaldays % 365;
                var _columnName = "";
                if (_extraDays > 0)
                {
                    if (_years < 5)
                    {
                        _columnName = "Year" + (_years + 1);
                    }
                    else
                    {
                        _columnName = "YearAbove5";
                    }
                    var _eligileDays = float.Parse(graduitySetting.GetType().GetProperty(_columnName).GetValue(graduitySetting, null).ToString());
                    _oneDaySalary = GetOneDaySalary(graduitySetting, salary, _columnName, _eligileDays);
                    _graduity += CalculateGratuity(basic, _extraDays, _oneDaySalary, _eligileDays);
                    
                }
                for (int g = 1; g <= _years; g++)
                {
                    if (g < 6)
                    {
                        _columnName = "Year" + g;
                    }
                    else
                    {
                        _columnName = "YearAbove5";
                    }
                    var _eligileDays = float.Parse(graduitySetting.GetType().GetProperty(_columnName).GetValue(graduitySetting, null).ToString());
                    _oneDaySalary = GetOneDaySalary(graduitySetting, salary, _columnName, _eligileDays);
                    _graduity += CalculateGratuity(basic, 365, _oneDaySalary, _eligileDays);
                }
            }
            return _graduity;
        }
        public float GetOneDaySalary(GraduitySetting graduitySetting,Salary  salary,string columnName,float eligibleDays)
        {
            float _salary = 0;
            float _oneDaySalary = 0;
            if (graduitySetting.GratuityType == 1)
            {
                _salary = salary.Basic;
            }
            else if (graduitySetting.GratuityType == 2)
            {
                _salary = salary.TotalSalary;
            }
            else if (graduitySetting.GratuityType == 3)
            {
                _salary = salary.GratuitySalary;
            }
            if (salary.EmployeeMaster.CompanyID == 17 && columnName != "YearAbove5")
            {
                _oneDaySalary = salary.GratuitySalary / 26;
            }
            else
            {
                _oneDaySalary = _salary / 30;
            }
            return _oneDaySalary;
        }
        public float CalculateGratuity(float basic,int employementDays,float amountPerDay,float allowedGraduityDays)
        {
            //if (allowedGraduityDays == 30)
            //    return basic / 365 * employementDays;
            //else if (allowedGraduityDays == 15)
            //    return (basic / 365 * employementDays) / 2;
            //else 
                return ((allowedGraduityDays / 365) * employementDays) * amountPerDay;
        }

    }
}
