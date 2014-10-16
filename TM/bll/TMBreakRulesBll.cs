using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TM.Dal;
using TM.Model;
using DB.Common.Provider;

namespace TM.Bll
{
    public class TMBreakRulesBll
    {
        public static TMBreakRulesBll Instance
        {
            get { return SingletonProvider<TMBreakRulesBll>.Instance; }
        }

        public int Add(TMBreakRulesModel model)
        {
            return TMBreakRulesDal.Instance.Insert(model);
        }

        public int Update(TMBreakRulesModel model)
        {
            return TMBreakRulesDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMBreakRulesDal.Instance.Delete(keyid);
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMBreakRulesDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }
    }
}
