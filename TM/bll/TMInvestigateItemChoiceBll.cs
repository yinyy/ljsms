using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TM.Dal;
using TM.Model;
using DB.Common.Provider;

namespace TM.Bll
{
    public class TMInvestigateItemChoiceBll
    {
        public static TMInvestigateItemChoiceBll Instance
        {
            get { return SingletonProvider<TMInvestigateItemChoiceBll>.Instance; }
        }

        public int Add(TMInvestigateItemChoiceModel model)
        {
            return TMInvestigateItemChoiceDal.Instance.Insert(model);
        }

        public int Update(TMInvestigateItemChoiceModel model)
        {
            return TMInvestigateItemChoiceDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMInvestigateItemChoiceDal.Instance.Delete(keyid);
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMInvestigateItemChoiceDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }
    }
}
