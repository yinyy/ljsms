using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TM.Dal;
using TM.Model;
using DB.Common.Provider;

namespace TM.Bll
{
    public class TMWarningRecordsBll
    {
        public static TMWarningRecordsBll Instance
        {
            get { return SingletonProvider<TMWarningRecordsBll>.Instance; }
        }

        public int Add(TMWarningRecordsModel model)
        {
            return TMWarningRecordsDal.Instance.Insert(model);
        }

        public int Update(TMWarningRecordsModel model)
        {
            return TMWarningRecordsDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMWarningRecordsDal.Instance.Delete(keyid);
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMWarningRecordsDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }
    }
}
