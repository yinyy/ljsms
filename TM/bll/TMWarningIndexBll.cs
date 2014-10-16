using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TM.Dal;
using TM.Model;
using DB.Common.Provider;

namespace TM.Bll
{
    public class TMWarningIndexBll
    {
        public static TMWarningIndexBll Instance
        {
            get { return SingletonProvider<TMWarningIndexBll>.Instance; }
        }

        public int Add(TMWarningIndexModel model)
        {
            return TMWarningIndexDal.Instance.Insert(model);
        }

        public int Update(TMWarningIndexModel model)
        {
            return TMWarningIndexDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMWarningIndexDal.Instance.Delete(keyid);
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMWarningIndexDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }
    }
}
