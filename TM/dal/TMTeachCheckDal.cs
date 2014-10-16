using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using DB.Common.Data;
using DB.Common.Provider;
using DB.Common;
using DB.BPM.Core;
using Newtonsoft.Json.Linq;
using DB.Common.Data.SqlServer;
using DB.Common.Data.Filter;
using TM.Model;

namespace TM.Dal
{
    public class TMTeachCheckDal : BaseRepository<TMTeachCheckModel>
    {
        public static TMTeachCheckDal Instance
        {
            get { return SingletonProvider<TMTeachCheckDal>.Instance; }
        }
        public string GetInitJson(int uid, string courseday, string coursetime,int courseweek)
        {
            string sqlstr =string.Format( "select KeyId,TeacherID,VClassID,CourseID,CourseRoomID,TrueName,VClassDescription,CourseName,Title,CourseDay,CourseTime,TermStart from V_TM_TeachCourseInfo where TeacherID={0} and CourseDay='{1}' and CourseTime='{2}' and CourseWeekStart<={3} and CourseWeekEnd>={3}",uid,courseday,coursetime,courseweek);
            SqlDataReader myreader = DbUtils.GetReader(sqlstr);
            var jstr=new object();
            int flag = 0;
            while(myreader.Read())
            {
                flag = 1;
                jstr = new { KeyId = myreader["KeyId"], TeacherID = myreader["TeacherID"], VClassID = myreader["VClassID"], CourseID = myreader["CourseID"], CourseRoomID = myreader["CourseRoomID"], TrueName = myreader["TrueName"], VClassDescription = myreader["VClassDescription"], CourseName = myreader["CourseName"], Title = myreader["Title"], CourseDay = myreader["CourseDay"], CourseTime = myreader["CourseTime"], TermStart = myreader["TermStart"] };
                      
           }
            if (flag == 0)
            {
                myreader.Dispose();
                return "";
            }
            else
            {
                myreader.Dispose();
                return JSONhelper.ToJson(jstr);
            }
        }
        public string GetInitCoursesByTeacherID(int uid)
        {
            string sqlstr = string.Format("select distinct KeyId,CourseName from V_TM_TeachCourseInfo where TeacherID={0}", uid);
            SqlDataReader myreader = DbUtils.GetReader(sqlstr);
            List<object> clist = new List<object>();
           
            while (myreader.Read())
            {
                 var jstr = new {  CourseID = myreader["KeyId"], CourseName = myreader["CourseName"] };
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
        public string GetInitVclassesByTeacherID(int uid)
        {
            string sqlstr = string.Format("select distinct VClassID,VClassDescription from V_TM_TeachCourseInfo where TeacherID={0}", uid);
            SqlDataReader myreader = DbUtils.GetReader(sqlstr);
            List<object> clist = new List<object>();

            while (myreader.Read())
            {
                var jstr = new { VClassID = myreader["VClassID"], VClassDescription = myreader["VClassDescription"] };
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

        public string GetJson(string str,int pageindex, int pagesize, string filterJson, string sort = "TeachDate",
                              string order = "asc")
        {
            var pcp = new ProcCustomPage("TM_TeachCheck")
            {
                PageIndex = pageindex,
                PageSize = pagesize,
                OrderFields = "TeacherID asc,VTeachCourseID asc,TeachWeeks desc,TeachDate desc,TeachTime asc",
                WhereString = FilterTranslator.ToSql(filterJson)
            };
             
            int recordCount;
            DataTable dt = TM.Dal.TMTeachCheckDal.Instance.GetPageWithSp(pcp, out recordCount);
            dt.Columns.Add(new DataColumn("TeacherName"));//教师姓名
            dt.Columns.Add(new DataColumn("CourseName"));//课程名称 
            dt.Columns.Add(new DataColumn("VClassName"));//虚班名称
            dt.Columns.Add(new DataColumn("TeachInfoj"));//计划授课信息
            dt.Columns.Add(new DataColumn("TeachInfor"));//实际授课信息
            dt.Columns.Add(new DataColumn("CheckDetail"));//考勤汇总
            dt.Columns.Add(new DataColumn("DKTeacherName"));//代课教师姓名
            dt.Columns.Add(new DataColumn("CourseID"));//课程ID
            var teachcourses = TM.Dal.TMTeachCourseDal.Instance.GetAll().ToList();
            var teachers = DB.BPM.Core.Dal.UserDal.Instance.GetAll().ToList();
            var dics = DB.BPM.Core.Dal.DicDal.Instance.GetAll().ToList();
            var courses = TM.Dal.TMCourseDal.Instance.GetAll().ToList();
            var vclasses = TM.Dal.TMVirtualClassDal.Instance.GetAll().ToList();
            var tcdetails = TM.Dal.TMTeachCourseDetailDal.Instance.GetAll().ToList();
            var students = TM.Dal.TMStudentsDal.Instance.GetAll().ToList();
            foreach (DataRow row in dt.Rows)
            { 
                var row1 = row;
               
                var teachcourse = teachcourses.Where(n => row1 != null && n.KeyId == (int)row["VTeachCourseID"]);
                var tc = teachcourse.First();//获取授课信息记录
                var teacher = teachers.Where(n => row1 != null && n.KeyId == tc.TeacherID);

                if (teacher != null)
                {
                    row["TeacherName"] = teacher.First().TrueName;
                    //row["TeacherID"] = tc.TeacherID;
                }
                else
                {
                   // row["TeacherID"] = 0;
                    row["TeacherName"] = "";
                }
                //处理代课教师，获取代课教师姓名
                var dkteacher = teachers.Where(n => row1 != null && n.KeyId == (int)row["Teacher"]);
                if (dkteacher != null)
                {
                    row["DKTeacherName"] = dkteacher.First().TrueName;
                    
                }
                else
                {
                    
                    row["DKTeacherName"] = "";
                }
                var course = courses.Where(n => row1 != null && n.KeyId == tc.CourseID);
                if (course != null)
                {
                    row["CourseID"] = tc.CourseID;
                    row["CourseName"] = course.First().CourseName;
                }
                else
                {
                    row["CourseID"] = 0;
                    row["CourseName"] = "";
                }
                var vclass = vclasses.Where(n => row1 != null && n.KeyId == tc.VClassID);
                if (vclass != null)
                    row["VClassName"] = vclass.First().VClassDescription;
                else
                {
                    row["VClassName"] = "";
                }

                int rroomid = (int)row["TeachRoomID"];
                var tr1 = dics.Where(n => row1 != null && n.KeyId == rroomid);
                string rroom = "";
                if (tr1 != null)
                {
                    rroom = tr1.First().Title;
                }
                string rday = (string)row["TeachDay"];
                string rtime = (string)row["TeachTime"];

                string jinfo="";
                //var tcdetail = tcdetails.Where(n => row1 != null && n.KeyId == (int)row["VTeachCourseDetailID"]);

                //if (tcdetail != null)
                //{
                //    var tcd = tcdetail.First();
                //    var tr2 = dics.Where(n => row1 != null && n.KeyId == tcd.CourseRoomID);
                //    string jroom ="";
                //    if (tr2 != null)
                //    {
                //       jroom= tr2.First().Title;
                //    }
                //    string jday = tcd.CourseDay;
                //    string jtime = tcd.CourseTime;
                //     jinfo= "[" + jday + "][" + jtime + "][" + jroom + "]";
                //}
                //else
                //{
                //    jinfo = "";
                //}
                string rinfo = "[" + rday + "][" + rtime + "][" + rroom + "]";
               
                row["TeachInfoj"] = jinfo;
                row["TeachInfor"] = rinfo;


                var coursedetails = TMTeachCheckDetailsDal.Instance.GetAll().ToList().Where(n => row1 != null && n.TeachCheckID== (int)row["KeyId"]);
                string scd = "";
                string szt = "";
                string skk = "";
                string sbj = "";
                string ssj = "";
                foreach (TMTeachCheckDetailsModel tm in coursedetails)
                {
                   
                    var student = students.Where(n => n.KeyId ==tm.StudentID);
                    var s = student.First();
                    string sname = "[xx]";
                    if (s != null)
                    {
                        sname = "[" + s.Name + "]";
                    }
                    szt += tm.CheckZT.Equals("0") || tm.CheckZT.Equals("") ? "" : sname;
                    scd += tm.CheckCD.Equals("0") || tm.CheckCD.Equals("") ? "" : sname;
                    skk += tm.CheckKK.Equals("0") || tm.CheckKK.Equals("") ? "" : sname;
                    sbj += tm.CheckBJ.Equals("0") || tm.CheckBJ.Equals("")? "" : sname;
                    ssj += tm.CheckSJ.Equals("0") || tm.CheckSJ.Equals("") ? "" : sname;
                }
                string checkinfo = "";
                checkinfo = skk == "" ? "" : "旷课：" + skk;
                checkinfo +=scd==""?"":"迟到："+scd;
                checkinfo += szt == "" ? "" : "早退：" + szt;
                checkinfo += sbj == "" ? "" : "请假：" + sbj;
                checkinfo += ssj == "" ? "" : "迟到：" + ssj;
                row["CheckDetail"] = checkinfo;
            }


            //数据库增加了TeacherID字段后注释了视图的过滤
            //DataView dv = dt.DefaultView;
            //dv.Sort = "TeacherID Asc,CourseID Desc,TeachDate Desc";
            //dv.RowFilter = str;
            
            //dt = dv.ToTable();
            //recordCount = dt.Rows.Count;
            return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);
            
        }
        //返回所有考勤明细信息，查询过滤条件是str,根据classid,还是学号或姓名过滤，classleaderid班主任，teacherid授课教师
        public string GetTCStudentDetailInfo(string str, int pageindex, int pagesize, string filterJson, string sort = "TeachDate", string order = "asc")
        {
            var pcp = new ProcCustomPage("V_TM_TeachCheckStudentDetailInfo")
            {
                PageIndex = pageindex,
                PageSize = pagesize,
                OrderFields = " VTeachCourseID Asc,TeachWeeks Desc,TeachDate Desc,ClassID Asc ",
                WhereString = FilterTranslator.ToSql(filterJson)
            };

            int recordCount;
            
            DataTable dt =base.GetPageWithSp(pcp, out recordCount);
            //2014.4.24因为发现获取的DT无法获取分页数据，重写了rpm.filter
            //DataView dv = dt.DefaultView;
            //dv.Sort = "CollegeName Asc,ProffessionName Asc,VTeachCourseID Asc,ClassID Asc,StudentNumber Asc,TeachDate Desc";
            //dv.RowFilter = str;
            //dt = dv.ToTable();
            //recordCount = dt.Rows.Count;
            return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);
        }
        //返回所有考勤汇总(明细到每班每课程)，查询过滤条件是str,根据classid,还是学号或姓名过滤，classleaderid班主任，teacherid授课教师
        public string GetTCSumByCourse(string str, int pageindex, int pagesize, string filterJson, string sort = "CourseID", string order = "asc")
        {
            var pcp = new ProcCustomPage("V_TM_TeachCheckSumByCourse")
            {
                PageIndex = pageindex,
                PageSize = pagesize,
                OrderFields = "CourseID Asc,ClassID Asc",
                WhereString = FilterTranslator.ToSql(filterJson)
            };

            int recordCount;
            
            DataTable dt = base.GetPageWithSp(pcp, out recordCount);
            //2014.4.24日考虑到dt转换成视图后影响分页，在上层用rpm.filter过滤
            //DataView dv = dt.DefaultView;
            //dv.Sort = "CourseID Asc,ClassID Asc,StudentNumber Asc";
            //dv.RowFilter = str;
            //dt = dv.ToTable();
            //recordCount = dt.Rows.Count;
            return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);
        }
        //返回所有考勤汇总(明细到每班每人)，查询过滤条件是str,根据classid,还是学号或姓名过滤，classleaderid班主任
        public string GetTCSumByStudent(string str, int pageindex, int pagesize, string filterJson, string sort = "CourseID asc,studentid asc", string order = "asc")
        {
            var pcp = new ProcCustomPage("V_TM_TeachCheckSumByStudent")
            {
                PageIndex = pageindex,
                PageSize = pagesize,
               // OrderFields =sort.Equals("CourseID")? "ClassID asc,studentid asc":sort,//如果有旷课排名的话，使用传入的参数
                OrderFields = sort,
                WhereString = FilterTranslator.ToSql(filterJson)
            };

            int recordCount;
            DataTable dt = TM.Dal.TMTeachCheckDal.Instance.GetPageWithSp(pcp, out recordCount);
            dt.Columns.Add(new DataColumn("WarningProcess"));
            dt.Columns.Add(new DataColumn("WarningStyle"));
            var warnings = TMWarningIndexDal.Instance.GetAll().Where(n=>n.WarningItemID==75).ToList();//处理旷课预警
            foreach (DataRow row in dt.Rows)
            {
                var row1 = row;
                var warning = warnings.Where(n => row1 != null &&( n.WarningIndexLow <= (int)row1["CheckKK"] && n.WarningIndexHigh > (int)row1["CheckKK"])).ToList();
                int wl = warning.Count;
                if (wl>0)
                {
                    row["WarningProcess"] = warning.First().WarningProcess;
                    row["WarningStyle"] = warning.First().WarningColorStyle; 

                }
                else
                {
                    row["WarningProcess"] = "";
                    row["WarningStyle"] = ""; 
                }
            }


            //DataView dv = dt.DefaultView;
            //dv.Sort = "ClassID Asc,StudentNumber Asc";
            //dv.RowFilter = str;
            //dt = dv.ToTable();
            //recordCount = dt.Rows.Count;
            return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);
        }
        //返回所有教学日志和课程明细信息
        public string GetTCCourseDetailInfo(string str, int pageindex, int pagesize, string filterJson, string sort = "TeachDate", string order = "asc")
        {
            var pcp = new ProcCustomPage("V_TM_TeachCheckCourseInfo")
            {
                PageIndex = pageindex,
                PageSize = pagesize,
                OrderFields = " TeachWeeks Desc,VClassDescription Asc,CourseName Desc ",
                WhereString = FilterTranslator.ToSql(filterJson)
            };

            int recordCount;

            DataTable dt = base.GetPageWithSp(pcp, out recordCount);
            
            return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);
        }

    }
}