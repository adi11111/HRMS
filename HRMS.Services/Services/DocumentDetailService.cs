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
   public class DocumentDetailService : BaseService<DocumentDetail> , IDocumentDetailService
    {
        IUnitOfWork _uow;
        public DocumentDetailService(IUnitOfWork _uow) : base(_uow)
        {
            this._uow = _uow;
        }
        //public override void Insert(DocumentDetail entity,List<Participant> participants)
        //{
        //    base.Insert(entity);
        //    _uow.Repository<Participant>().up

        //}
    }
}
