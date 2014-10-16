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
    public class TMTeachInspectDal : BaseRepository<TMTeachInspectModel>
    {
        public static TMTeachInspectDal Instance
        {
            get { return SingletonProvider<TMTeachInspectDal>.Instance; }
        }
        public string GetInitJson(string courseday, string coursetime,int rid,int weeks)
        {
            string sqlstr = string.Format("select KeyId,TeacherID,VClassID,CourseID,CourseRoomID,TrueName,VClassDescription,CourseName,Title,CourseDay,CourseTime,TermStart,Expr1 from V_TM_TeachCourseInfo where CourseWeekStart<={0} and CourseWeekEnd>={0} and CourseDay='{1}' and CourseTime='{2}' and CourseRoomID={3}", weeks, courseday, coursetime,rid);
            SqlDataReader myreader = DbUtils.GetReader(sqlstr);

            while (myreader.Read())
            {
                var jstr = new {InspectorID=SysVisitor.Instance.UserId, KeyId = myreader["KeyId"], TeacherID = myreader["TeacherID"], TrueName = myreader["TrueName"], VClassID = myreader["VClassID"], CourseID = myreader["CourseID"], CourseRoomID = myreader["CourseRoomID"], VClassDescription = myreader["VClassDescription"], CourseName = myreader["CourseName"], Title = myreader["Title"], CourseDay = myreader["CourseDay"], CourseTime = myreader["CourseTime"], TermStart = myreader["TermStart"], TeachCourseDetailID = myreader["Expr1"] };

                return JSONhelper.ToJson(jstr);
            }
            return "";
        }
        public string GetInitCoursesByTeacherID(int uid)
        {
            string sqlstr = string.Format("select distinct KeyId,CourseName from V_TM_TeachCourseInfo where TeacherID={0}", uid);
            SqlDataReader myreader = DbUtils.GetReader(sqlstr);
            List<object> clist = new List<object>();

            while (myreader.Read())
            {
                var jstr = new { CourseID = myreader["KeyId"], CourseName = myreader["CourseName"] };
                clist.Add(jstr);

            }
            if (clist.Count > 0)
            {
                return JSONhelper.ToJson(clist);
            }
            else
            {
                return "";
            }
        }
        public string GetJson(string str,int pageindex, int pagesize, string filterJson, string sort = "keyid",
                              string order = "asc")
        {


            var pcp = new ProcCustomPage("V_TM_TeachInspectInfo")
            {
                PageIndex = pageindex,
                PageSize = pagesize,
                OrderFields = "keyid desc",
                WhereString = FilterTranslator.ToSql(filterJson)

            };
            int recordCount;

            DataTable dt = base.GetPageWithSp(pcp, out recordCount);

            DataView dv = dt.DefaultView;
            dv.Sort = "TeacherID Asc,InspectDate Desc";
            dv.RowFilter = str;
           
            dt = dv.ToTable();
            recordCount = dt.Rows.Count;


            return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);
          
        }
    }
}