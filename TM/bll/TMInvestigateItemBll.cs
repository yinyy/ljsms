using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TM.Dal;
using TM.Model;
using DB.Common.Provider;

namespace TM.Bll
{
    public class TMInvestigateItemBll
    {
        public static TMInvestigateItemBll Instance
        {
            get { return SingletonProvider<TMInvestigateItemBll>.Instance; }
        }

        public int Add(TMInvestigateItemModel model)
        {
            return TMInvestigateItemDal.Instance.Insert(model);
        }

        public int Update(TMInvestigateItemModel model)
        {
            return TMInvestigateItemDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMInvestigateItemDal.Instance.Delete(keyid);
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMInvestigateItemDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }
    }
}
