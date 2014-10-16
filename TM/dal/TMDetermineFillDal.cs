using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using DB.Common.Data;
using DB.Common.Provider;

using TM.Model;
using DB.Common;

namespace TM.Dal
{
    public class TMDetermineFillDal : BaseRepository<TMDetermineFillModel>
    {
        public static TMDetermineFillDal Instance
        {
            get { return SingletonProvider<TMDetermineFillDal>.Instance; }
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "keyid",
                              string order = "asc")
        {
            return base.JsonDataForEasyUIdataGrid(TableConvention.Resolve(typeof(TMDetermineFillModel)), pageindex, pagesize, filterJson,
                                                  sort, order);
        }

        internal int SaveScore(int determineId,int expertId,  int kind, List<TMDetermineFillModel> dfms)
        {
            try
            {
                //先删除原来的
                    
                if (kind == 1)
                {
                    DbUtils.DeleteWhere<TMDetermineFillModel>(new { DetermineId = determineId, Kind = kind });
                }
                else
                {
                    DbUtils.DeleteWhere<TMDetermineFillModel>(new { DetermineId = determineId, Kind = kind, ExpertId = expertId });
                }

                //再把新的增加进去
                foreach (TMDetermineFillModel m in dfms)
                {
                    Insert(m);
                }
            }
            catch
            {
                return 0;
            }

            return 1;
        }

        internal string ShowScoreJson(int determineId, int expertId, int kind)
        {
            if (kind == 1)
            {
                return JSONhelper.ToJson(GetWhere(new { DetermineId = determineId, Kind = kind }));
            }
            else
            {
                return JSONhelper.ToJson(GetWhere(new { DetermineId = determineId, Kind = kind, ExpertId=expertId }));
            }
        }
    }
}