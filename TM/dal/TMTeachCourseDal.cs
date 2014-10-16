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
    public class TMTeachCourseDal : BaseRepository<TMTeachCourseModel>
    {
        public static TMTeachCourseDal Instance
        {
            get { return SingletonProvider<TMTeachCourseDal>.Instance; }
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "keyid",
                              string order = "asc")
        {

            var pcp = new ProcCustomPage("TM_TeachCourse")
            {
                PageIndex = pageindex,
                PageSize = pagesize,
                OrderFields = sort + " " + order,
                WhereString = FilterTranslator.ToSql(filterJson)
            };
           
            int recordCount;
            DataTable dt = TM.Dal.TMTeachCourseDal.Instance.GetPageWithSp(pcp, out recordCount);
            dt.Columns.Add(new DataColumn("TeacherName"));//教师姓名
            dt.Columns.Add(new DataColumn("CourseName"));//课程名称 
            dt.Columns.Add(new DataColumn("VClassName"));//虚班名称
            dt.Columns.Add(new DataColumn("CourseDetail"));//课程安排
            dt.Columns.Add(new DataColumn("TeachCourseinfo"));//课程安排
            var teachers = DB.BPM.Core.Dal.UserDal.Instance.GetAll().ToList();
            var courses =TM.Dal.TMCourseDal.Instance.GetAll().ToList();
            var vclasses = TM.Dal.TMVirtualClassDal.Instance.GetAll().ToList();

            foreach (DataRow row in dt.Rows)
            {
                var row1 = row;
                var teacher = teachers.Where(n => row1 != null && n.KeyId == (int)row1["TeacherID"]);
               
                if (teacher != null)
                    row["TeacherName"] = teacher.First().TrueName;
                else
                {
                    row["TeacherName"] = "";
                }
                var course = courses.Where(n => row1 != null && n.KeyId == (int)row1["CourseID"]);
                if (course != null)
                    row["CourseName"] = course.First().CourseName;
                else
                {
                    row["CourseName"] = "";
                }
                var vclass = vclasses.Where(n => row1 != null && n.KeyId == (int)row1["VClassID"]);
                if (vclass != null)
                    row["VClassName"] = vclass.First().VClassDescription;
                else
                {
                    row["VClassName"] = "";
                }

                var coursedetails = TMTeachCourseDetailDal.Instance.GetAll().ToList().Where(n => row1 != null && n.TeachCourseID == (int)row1["KeyId"]);
                string coursedetail = "";
                foreach( TMTeachCourseDetailModel tm in coursedetails )
                {
                    coursedetail += "[" + tm.CourseDay +"  "+ tm.CourseTime + "]";
                }
                row["CourseDetail"] = coursedetail;
                row["TeachCourseinfo"] = string.Format("[{0}][{1}]", row["VClassName"], row["CourseName"]);
            }
            return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);




           // return base.JsonDataForEasyUIdataGrid(TableConvention.Resolve(typeof(TMTeachCourseModel)), pageindex, pagesize, filterJson,
                                                 // sort, order);
        }
        public string GetCourseByTeacher(int pageindex, int pagesize, string filterJson, string sort = "TeacherID", string order = "asc")
        {
            var pcp = new ProcCustomPage("V_TM_TeachCourseInfo")
            {
                PageIndex = pageindex,
                PageSize = pagesize,
                OrderFields = "CourseWeekStart asc,CourseDay asc,CourseTime asc",
                WhereString = FilterTranslator.ToSql(filterJson)
            };

            int recordCount;
            DataTable dt = TM.Dal.TMTeachCourseDal.Instance.GetPageWithSp(pcp, out recordCount);

            return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);
 
        }
    }
}