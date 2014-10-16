using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using DB.Common.Data;
using DB.Common.Provider;

using TM.Model;

namespace TM.Dal
{
    public class TMInvestigateItemChoiceDal : BaseRepository<TMInvestigateItemChoiceModel>
    {
        public static TMInvestigateItemChoiceDal Instance
        {
            get { return SingletonProvider<TMInvestigateItemChoiceDal>.Instance; }
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "keyid",
                              string order = "asc")
        {
            return base.JsonDataForEasyUIdataGrid(TableConvention.Resolve(typeof(TMInvestigateItemChoiceModel)), pageindex, pagesize, filterJson,
                                                  sort, order);
        }
    }
}