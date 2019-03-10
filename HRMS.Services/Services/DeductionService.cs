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
   public class DeductionService : BaseService<Deduction> , IDeductionService
    {
        private IUnitOfWork _uow;
        public DeductionService(IUnitOfWork _uow) : base(_uow)
        {
            this._uow = _uow;
        }
        //public void Insert(Deduction deduction,List<DeductionDetail> deductionDetails)
        //{
        //    _uow.Repository<Deduction>().Insert(deduction);
        //    for (int i = 0; i < deductionDetails.Count; i++)
        //    {
        //        _uow.Repository<DeductionDetail>().Insert(deductionDetails[i]);
        //    }
        //    _uow.Save();
        //}


        public new void Update(Deduction deduction)
        {
            _uow.Repository<Deduction>().Update(deduction);
            for (int i = 0; i < deduction.DeductionDetail.Count; i++)
            {
                _uow.Repository<DeductionDetail>().Update(deduction.DeductionDetail.ElementAt(i));
            }
            _uow.Save();
         }

    }
}
