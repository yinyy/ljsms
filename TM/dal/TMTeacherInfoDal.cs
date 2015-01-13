using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using DB.Common.Data;
using DB.Common.Provider;

using TM.Model;

namespace TM.Dal
{
    public class TMTeacherInfoDal : BaseRepository<TMTeacherInfoModel>
    {
        public static TMTeacherInfoDal Instance
        {
            get { return SingletonProvider<TMTeacherInfoDal>.Instance; }
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "keyid",
                              string order = "asc")
        {
            return base.JsonDataForEasyUIdataGrid(TableConvention.Resolve(typeof(TMTeacherInfoModel)), pageindex, pagesize, filterJson,
                                                  sort, order);
        }
    }
}