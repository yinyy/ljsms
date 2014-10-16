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
    public class TMClassInfoDal : BaseRepository<TMClassInfoModel>
    {
        public static TMClassInfoDal Instance
        {
            get { return SingletonProvider<TMClassInfoDal>.Instance; }
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "keyid", string order = "asc")
        {
            //return base.JsonDataForEasyUIdataGrid(TableConvention.Resolve(typeof(TMClassInfoModel)), pageindex, pagesize, filterJson, sort, order);
            var pcp = new ProcCustomPage("TM_ClassInfo")
            {
                PageIndex = pageindex,
                PageSize = pagesize,
                OrderFields = sort + " " + order,
                WhereString = FilterTranslator.ToSql(filterJson)
            };
            var users = DB.BPM.Core.Dal.UserDal.Instance.GetAll();
            int recordCount;
            DataTable dt =TM.Dal.TMClassInfoDal.Instance.GetPageWithSp(pcp, out recordCount);
            dt.Columns.Add(new DataColumn("LeaderName"));//班主任真实姓名
            dt.Columns.Add(new DataColumn("ProffessionName"));//专业名称 
            //dt.Columns.Add(new DataColumn("CollegeName"));//二级学院名称

            var leaders = DB.BPM.Core.Dal.UserDal.Instance.GetAll().ToList();
            var colleges = DB.BPM.Core.Dal.DicDal.Instance.GetAll().ToList();
            foreach (DataRow row in dt.Rows)
            {
                var row1 = row;
                var leader = leaders.Where(n => row1 != null && n.KeyId == (int)row1["ClassLeaderId"]);
               // var enumerable = dep as Department[] ?? dep.ToArray();
                if (leader!=null)
                    row["LeaderName"] =leader.First().TrueName;
                else
                {
                    row["LeaderName"] = "";
                }
               var college = colleges.Where(n=>row1!=null && n.KeyId==(int)row1["College"]);
                //if (college != null)
                //    row["CollegeName"] = college.First().Title;
                //else
                //{
                //    row["CollegeName"] = "";
                //}
                var proffession = colleges.Where(n => row1 != null && n.KeyId == (int)row1["Proffession"]);
                if (college != null)
                    row["ProffessionName"] = proffession.First().Title;
                else
                {
                    row["ProffessionName"] = "";
                }
              
               
            }
            return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);
        }

        public string GetClassesByProfession(int pid)
        {

            var classes = TMClassInfoDal.Instance.GetAll().Where(n => n.Proffession == pid);
            return JSONhelper.ToJson(classes);

        }
        public string GetPandCByClassID(int cid)
        {
            var pcs = TMClassInfoDal.Instance.GetAll().Where(n => n.KeyId == cid);
            return JSONhelper.ToJson(pcs);
 
        }
       
    }
}