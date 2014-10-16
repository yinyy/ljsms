using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using DB.Common.Data;
using DB.Common.Provider;

using TM.Model;

namespace TM.Dal
{
    public class TMInvestigateItemDal : BaseRepository<TMInvestigateItemModel>
    {
        public static TMInvestigateItemDal Instance
        {
            get { return SingletonProvider<TMInvestigateItemDal>.Instance; }
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "keyid",
                              string order = "asc")
        {
            //return base.JsonDataForEasyUIdataGrid(TableConvention.Resolve(typeof(TMInvestigateItemModel)), pageindex, pagesize, filterJson,
            //                                      sort, order);

            return base.JsonDataForEasyUIdataGrid("V_TM_InvestigateItem", pageindex, pagesize, filterJson,
                                                  sort, order);
        }
    }
}