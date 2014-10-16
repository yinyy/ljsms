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
    public class TMStudentsDal : BaseRepository<TMStudentsModel>
    {
        public static TMStudentsDal Instance
        {
            get { return SingletonProvider<TMStudentsDal>.Instance; }
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "keyid",
                              string order = "asc")
        {

            var pcp = new ProcCustomPage("TM_Students")
            {
                PageIndex = pageindex,
                PageSize = pagesize,
                OrderFields = sort + " " + order,
                WhereString = FilterTranslator.ToSql(filterJson)
            };
            var users = DB.BPM.Core.Dal.UserDal.Instance.GetAll();
            int recordCount;
            DataTable dt = TM.Dal.TMStudentsDal.Instance.GetPageWithSp(pcp, out recordCount);
            dt.Columns.Add(new DataColumn("ClassName"));//班级名称
            dt.Columns.Add(new DataColumn("ProffessionName"));//专业名称 
            dt.Columns.Add(new DataColumn("CollegeName"));//二级学院名称
            dt.Columns.Add(new DataColumn("NationName"));//民族 
            dt.Columns.Add(new DataColumn("PoliticsStatus"));//政治面貌
            var classes = TM.Dal.TMClassInfoDal.Instance.GetAll();
            var colleges = DB.BPM.Core.Dal.DicDal.Instance.GetAll().ToList();
            foreach (DataRow row in dt.Rows)
            {
                var row1 = row;
                var leader = classes.Where(n => row1 != null && n.KeyId == (int)row1["ClassID"]);
                // var enumerable = dep as Department[] ?? dep.ToArray();
                if (leader != null)
                    row["ClassName"] = leader.First().ClassName;
                else
                {
                    row["ClassName"] = "";
                }
                var college = colleges.Where(n => row1 != null && n.KeyId == (int)row1["College"]);
                if (college != null)
                    row["CollegeName"] = college.First().Title;
                else
                {
                    row["CollegeName"] = "";
                }
                var proffession = colleges.Where(n => row1 != null && n.KeyId == (int)row1["Profession"]);
                if (college != null)
                    row["ProffessionName"] = proffession.First().Title;
                else
                {
                    row["ProffessionName"] = "";
                }

               var nation = colleges.Where(n => row1 != null && n.KeyId == int.Parse(row1["Nationality"].ToString()));
                if (nation != null)
                    row["NationName"] = nation.First().Title;
                else
                {
                    row["NationName"] = "";
                }

                var politic = colleges.Where(n => row1 != null && n.KeyId == int.Parse(row1["PoliticalStatus"].ToString()));
                if (politic != null)
                    row["PoliticsStatus"] = politic.First().Title;
                else
                {
                    row["PoliticsStatus"] = "";
                }



            }

            return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);


           // return base.JsonDataForEasyUIdataGrid(TableConvention.Resolve(typeof(TMStudentsModel)), pageindex, pagesize, filterJson,
            //                                      sort, order);
        }
        public string GetStudentDetailInfo(string str, int pageindex, int pagesize, string filterJson, string sort = "StudentNumber", string order = "asc")
        {
            var pcp = new ProcCustomPage("V_TM_StudentInfoDetail")
            {
                PageIndex = pageindex,
                PageSize = pagesize,
                OrderFields = sort + " " + order,
                WhereString = FilterTranslator.ToSql(filterJson)
              
            };

            int recordCount;
           DataTable dt = TM.Dal.TMTeachCheckDal.Instance.GetPageWithSp(pcp, out recordCount);
           //DataView dv = dt.DefaultView;
           //dv.Sort = "Expr2 Asc,Title Asc,ClassID Asc,StudentNumber Asc";
           //dv.RowFilter = "TrueName = '管理员'";
           //dt = dv.ToTable();
           //recordCount = dt.Rows.Count;
            return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);
        }
    }
}