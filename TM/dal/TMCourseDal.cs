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
    public class TMCourseDal : BaseRepository<TMCourseModel>
    {
        public static TMCourseDal Instance
        {
            get { return SingletonProvider<TMCourseDal>.Instance; }
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "keyid",
                              string order = "asc")
        {

            var pcp = new ProcCustomPage("TM_Course")
            {
                PageIndex = pageindex,
                PageSize = pagesize,
                OrderFields = sort + " " + order,
                WhereString = FilterTranslator.ToSql(filterJson)
            };
            var users = DB.BPM.Core.Dal.UserDal.Instance.GetAll();
            int recordCount;
            DataTable dt = TM.Dal.TMCourseDal.Instance.GetPageWithSp(pcp, out recordCount);
          
            dt.Columns.Add(new DataColumn("ProffessionName"));//专业名称 
            dt.Columns.Add(new DataColumn("CourseClass"));//课程类型
          
            var colleges = DB.BPM.Core.Dal.DicDal.Instance.GetAll().ToList();
            foreach (DataRow row in dt.Rows)
            {
                var row1 = row;
                var leader = colleges.Where(n => row1 != null && n.KeyId == (int)row1["CourseProffessionID"]);
                // var enumerable = dep as Department[] ?? dep.ToArray();
                if (leader != null)
                    row["ProffessionName"] = leader.First().Title;
                else
                {
                    row["ProffessionName"] = "";
                }
                var college = colleges.Where(n => row1 != null && n.KeyId == (int)row1["CourseClassID"]);
                if (college != null)
                    row["CourseClass"] = college.First().Title;
                else
                {
                    row["CourseClass"] = "";
                }
                


            }
            return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);


        }
    }
}