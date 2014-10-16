using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TM.Dal;
using TM.Model;
using DB.Common.Provider;

namespace TM.Bll
{
    public class TMInvestigateFillBll
    {
        public static TMInvestigateFillBll Instance
        {
            get { return SingletonProvider<TMInvestigateFillBll>.Instance; }
        }

        public int Add(TMInvestigateFillModel model)
        {
            return TMInvestigateFillDal.Instance.Insert(model);
        }

        public int Update(TMInvestigateFillModel model)
        {
            return TMInvestigateFillDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMInvestigateFillDal.Instance.Delete(keyid);
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMInvestigateFillDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }

        public IEnumerable<TMInvestigateFillModel> GetWhere(object where)
        {
            return TMInvestigateFillDal.Instance.GetWhere(where);
        }

        public int DeleteWhere(object where)
        {
            return TMInvestigateFillDal.Instance.DeleteWhere(where);
        }
    }
}
