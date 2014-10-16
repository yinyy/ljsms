using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using DB.Common.Data;
using DB.Common.Provider;

using TM.Model;

namespace TM.Dal
{
    public class TMTermDal : BaseRepository<TMTermModel>
    {
        public static TMTermDal Instance
        {
            get { return SingletonProvider<TMTermDal>.Instance; }
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "keyid",
                              string order = "asc")
        {
            return base.JsonDataForEasyUIdataGrid(TableConvention.Resolve(typeof(TMTermModel)), pageindex, pagesize, filterJson,
                                                  sort, order);
        }
    }
}