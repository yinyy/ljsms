using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using DB.Common.Data;
using DB.Common.Provider;
using DB.Common;
using DB.BPM.Core;
using Newtonsoft.Json.Linq;
using System.Data.SqlClient;
using DB.Common.Data.SqlServer;
using DB.Common.Data.Filter;
using TM.Model;

namespace TM.Dal
{
    public class TMVirtualClassDal : BaseRepository<TMVirtualClassModel>
    {
        public static TMVirtualClassDal Instance
        {
            get { return SingletonProvider<TMVirtualClassDal>.Instance; }
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "keyid",
                              string order = "asc")
        {
           // return base.JsonDataForEasyUIdataGrid(TableConvention.Resolve(typeof(TMVirtualClassModel)), pageindex, pagesize, filterJson,
                                                 // sort, order);
            var pcp = new ProcCustomPage("TM_VirtualClass")
            {
                PageIndex = pageindex,
                PageSize = pagesize,
                OrderFields = sort + " " + order,
                WhereString = FilterTranslator.ToSql(filterJson)
            };
            var terms =TM.Dal.TMTermDal.Instance.GetAll();
            int recordCount;
            DataTable dt = TM.Dal.TMVirtualClassDal.Instance.GetPageWithSp(pcp, out recordCount);
            dt.Columns.Add(new DataColumn("TermName"));//Ñ§ÆÚÏêÏ¸ÃèÊö           
           
            foreach (DataRow row in dt.Rows)
            {
                var row1 = row;
                var leader = terms.Where(n => row1 != null && n.KeyId == (int)row1["TermID"]);
                // var enumerable = dep as Department[] ?? dep.ToArray();
                if (leader != null)
                    row["TermName"] = leader.First().TermDescription;
                else
                {
                    row["TermName"] = "";
                }               

            }
            return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);




        }
        public string VClassCategoryJson()
        {
            return JSONhelper.ToJson(TMVirtualClassDal.Instance.GetAll().ToList().OrderBy(n => n.TermID)
                                    .Select(n => new
                                    {
                                        id = n.KeyId,
                                        text = n.VClassDescription + " [" + n.Status + "]",
                                        iconCls = "icon-bullet_green",
                                        attributes = new { n.TermID, n.Remark }
                                    })
                                 );
        }
    }
}