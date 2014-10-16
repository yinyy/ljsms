using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DB.Common;
using Newtonsoft.Json.Linq;
using DB.Common.Data;
using DB.Common.Provider;
using System.Data;
using TM.Model;
using DB.Common.Data.Filter;


namespace TM.Dal
{
    public class TMWarningIndexDal : BaseRepository<TMWarningIndexModel>
    {
        public static TMWarningIndexDal Instance
        {
            get { return SingletonProvider<TMWarningIndexDal>.Instance; }
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "keyid",
                              string order = "asc")
        {
            var pcp = new ProcCustomPage("TM_WarningIndex")
            {
                PageIndex = pageindex,
                PageSize = pagesize,
                OrderFields = "WarningItemID asc,WarningIndexLow asc",
                WhereString = FilterTranslator.ToSql(filterJson)
            };
             int recordCount;
            DataTable dt = TM.Dal.TMStudentsDal.Instance.GetPageWithSp(pcp, out recordCount);
            dt.Columns.Add(new DataColumn("WarningName"));//Ô¤¾¯ÏîÄ¿Ãû³Æ 
            var dics = DB.BPM.Core.Dal.DicDal.Instance.GetAll().ToList();

            foreach (DataRow row in dt.Rows)
            {
                var row1 = row;
                var warningitem = dics.Where(n => row1 != null && n.KeyId == (int)row1["WarningItemID"]);
                if (warningitem != null)
                    row["WarningName"] = warningitem.First().Title;
                else
                {
                    row["WarningName"] = "";
                }
            }

            return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);
        }
    }
}