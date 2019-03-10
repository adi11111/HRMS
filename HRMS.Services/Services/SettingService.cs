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
   public class SettingService : BaseService<SettingMaster> , ISettingService
    {
        IUnitOfWork _uow;
        public SettingService(IUnitOfWork _uow) : base(_uow)
        {
            this._uow = _uow;
        }
        public bool UpdateSetting(List<SettingMaster> settings)
        {
            List<SettingMaster> _previousSettings = new List<SettingMaster>();
            if(settings != null)
            {
                if(settings[0].AppointmentID > 0)
                {
                    var _appointmentID = settings[0].AppointmentID;
                    var _settings = _uow.Repository<SettingMaster>().Get(s => s.IsDeleted == false && s.AppointmentID != null).ToList();
                    for (int i = 0; i < settings.Count; i++)
                    {
                        _previousSettings.Add(_settings.Where(s => s.AppointmentID == settings[i].AppointmentID).FirstOrDefault());
                    }
                }
                else 
                {
                    var _documentID = settings[0].DocumentID;
                    var _settings = _uow.Repository<SettingMaster>().Get(s => s.IsDeleted == false && s.DocumentID == _documentID).ToList();
                    for (int i = 0; i < settings.Count; i++)
                    {
                        _previousSettings.Add(_settings.Where(s => s.DocumentID == settings[i].DocumentID).FirstOrDefault());
                    }
                }
            }
            if (_previousSettings[0] != null)
            {
                for (int i = 0; i < _previousSettings.Count; i++)
                {
                    _uow.Repository<SettingMaster>().Delete(_previousSettings[i].SettingID);
                }
                _uow.Save();
            }
           
            _uow.Repository<SettingMaster>().AddRange(settings);
            _uow.Save();
            return true;
        }
        public dynamic GetNotificationByUserID(int userID)
        {
            return _uow.SettingRepository.GetNotificationByUserID(userID);
        }
    }
}
