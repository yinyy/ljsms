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
    public class TMTeachCheckDetailsDal : BaseRepository<TMTeachCheckDetailsModel>
    {
        public static TMTeachCheckDetailsDal Instance
        {
            get { return SingletonProvider<TMTeachCheckDetailsDal>.Instance; }
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "keyid",
                              string order = "asc")
        {
            var pcp = new ProcCustomPage("TM_TeachCheckDetails")
            {
                PageIndex = pageindex,
                PageSize = pagesize,
                OrderFields = sort + " " + order,
                WhereString = FilterTranslator.ToSql(filterJson)
            };

            int recordCount;
            DataTable dt = TM.Dal.TMTeachCheckDetailsDal.Instance.GetPageWithSp(pcp, out recordCount);
            dt.Columns.Add(new DataColumn("ClassName"));//°à¼¶
            dt.Columns.Add(new DataColumn("StudentNumber"));//Ñ§ºÅ 
            dt.Columns.Add(new DataColumn("Name"));//ÐÕÃû

            var students = TM.Dal.TMStudentsDal.Instance.GetAll().ToList(); ;
            var classes = TM.Dal.TMClassInfoDal.Instance.GetAll().ToList();
           
            foreach (DataRow row in dt.Rows)
            {
                var row1 = row;
                var student = students.Where(n => row1 != null && n.KeyId == (int)row1["StudentID"]);
                int classid;
                if (student != null)
                { 
                    row["StudentNumber"] = student.First().StudentNumber;
                    row["Name"] = student.First().Name;
                    classid=student.First().ClassID;
                }
                else
                {
                    row["StudentNumber"] = "";
                    row["Name"] = "";
                    classid=0;
                }
                if (classid != 0)
                {
                    var classinfo = classes.Where(n => row1 != null && n.KeyId == classid);
                    if (classinfo != null)
                    {
                        row["ClassName"] = classinfo.First().ClassName;
                    }
                    else
                    {
                        row["ClassName"] = "";

                    }
                }
                else
                {
                    row["ClassName"] = "";
                }                
            }
            return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);

           
        }
    }
}