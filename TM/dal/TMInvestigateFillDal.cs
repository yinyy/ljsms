using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using DB.Common.Data;
using DB.Common.Provider;

using TM.Model;

namespace TM.Dal
{
    public class TMInvestigateFillDal : BaseRepository<TMInvestigateFillModel>
    {
        public static TMInvestigateFillDal Instance
        {
            get { return SingletonProvider<TMInvestigateFillDal>.Instance; }
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "keyid",
                              string order = "asc")
        {
            return base.JsonDataForEasyUIdataGrid(TableConvention.Resolve(typeof(TMInvestigateFillModel)), pageindex, pagesize, filterJson,
                                                  sort, order);
        }

        public int DeleteWhere(object where)
        {
            return DbUtils.DeleteWhere<TMInvestigateFillModel>(where);
        }
    }
}