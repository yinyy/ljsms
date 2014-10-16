using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using DB.Common.Data;
using DB.Common.Provider;

using TM.Model;

namespace TM.Dal
{
    public class TMDetermineTeachersDal : BaseRepository<TMDetermineTeachersModel>
    {
        public static TMDetermineTeachersDal Instance
        {
            get { return SingletonProvider<TMDetermineTeachersDal>.Instance; }
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "keyid",
                              string order = "asc")
        {
            return base.JsonDataForEasyUIdataGrid("V_TM_DetermineTeachers", pageindex, pagesize, filterJson,
                                                  sort, order);
        }

        internal int Save(int determineId, List<TMDetermineTeachersModel> dtms)
        {
            try
            {
                #region 先删除已有的数据
                DbUtils.DeleteWhere<TMDetermineTeachersModel>(new { DetermineId = determineId });
                #endregion

                #region 把现有数据加进去
                foreach (TMDetermineTeachersModel m in dtms)
                {
                    Insert(m);
                }
                #endregion

                return 1;
            }
            catch
            {
                return 0;
            }
        }
    }
}