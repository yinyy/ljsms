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
    public class TMVClassStudentsDal : BaseRepository<TMVClassStudentsModel>
    {
        public static TMVClassStudentsDal Instance
        {
            get { return SingletonProvider<TMVClassStudentsDal>.Instance; }
        }
        //根据获取的班级选择数组，增加多个实体班级到虚拟班级中
        public static int AddClasses(string jsonclasses,int vcid)
        {
            string[] classes = jsonclasses.Split(new char[]{ ',' });
            if (classes.Length == 0)
            {
                return 0;
            }
            else
            {
                return DbUtils.ExecuteNonQuerySp("AddVitualClassStudents", new { id = jsonclasses, VClassID = vcid });
               
            }
        }
        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "keyid",
                              string order = "asc")
        {
            return base.JsonDataForEasyUIdataGrid(TableConvention.Resolve(typeof(TMVClassStudentsModel)), pageindex, pagesize, filterJson,
                                                  sort, order);
        }
        //获取视图中学生详细信息
        public string GetStudentsDetailInfo(int pageindex, int pagesize, string filterJSON)
        {
            var pcp = new ProcCustomPage("V_TM_VclassStudentInfoDetail")
            {
                PageIndex = pageindex,
                PageSize = pagesize,
                OrderFields = "keyid desc",
               WhereString = FilterTranslator.ToSql(filterJSON)
               
            };
            int recordCount;
           
            DataTable dt = base.GetPageWithSp(pcp, out recordCount);
            return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);

        }

        //获取视图中学生详细信息
        public string TCGetStudentsDetailInfo(string str,int pageindex, int pagesize, string filterJSON,DateTime tcdate)
        {
            var pcp = new ProcCustomPage("V_TM_VclassStudentInfoDetail")
            {
                PageIndex = pageindex,
                PageSize = pagesize,
                OrderFields = "keyid desc",
                WhereString = FilterTranslator.ToSql(filterJSON)
                 
            };
            int recordCount;

            DataTable dt = base.GetPageWithSp(pcp, out recordCount);
            var leaves = TM.Dal.TMStudentLeaveDal.Instance.GetAll().Where(n => n.ClassApprove=="同意" || n.LeaderApprove=="同意").ToList();//获取学生请假情况
            if (leaves != null)
            {
                var leavetitles = DB.BPM.Core.Dal.DicDal.Instance.GetAll().ToList();//获取请假类别名称信息

                dt.Columns.Add(new DataColumn("CheckBJ"));//请假情况           
                string leaveinfo;
                foreach (DataRow row in dt.Rows)
                {
                    leaveinfo = "";
                    var row1 = row;
                    int s = (int)row["KeyId"];
                    //获取请假情况，在有效日期范围内，并且是班主任同意或者是院领导同意的
                   // var leave11 = leaves.Where(n => n.StudentID == s && n.LeaveStart <= tcdate && n.LeaveEnd >= tcdate && (n.ClassApprove.Equals("同意")||n.LeaderApprove.Equals("同意"))).ToList();
                    var leave11 = leaves.Where(n => n.StudentID == s && n.LeaveStart <= tcdate && n.LeaveEnd >= tcdate).ToList();
                   
                    int l = leave11.Count;
                    if (leave11.Count>0)
                    {
                        int leaveid = (int)leave11.First().LeaveClassID;
                        var leavetitle = leavetitles.Where(n1 => n1.KeyId == leaveid);
                        if (leavetitle != null)
                        {
                            leaveinfo = leavetitle.First().Title;
                        }
                        leaveinfo += "[" + leave11.First().LeaveStart.ToString("MM-dd") + "至" + leave11.First().LeaveEnd.ToString("MM-dd") + "]";
                    }
                    else
                    {
                        leaveinfo = "";
                    }
                    row["CheckBJ"] = leaveinfo;

                }
            }
             
            DataView dv = dt.DefaultView;
            dv.Sort = "Expr2 Asc,Title Asc,ClassID Asc,StudentNumber Asc";
            dv.RowFilter = str;
            dt = dv.ToTable();
            recordCount = dt.Rows.Count;
            return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);

        }

        //获取指定虚拟班级中学生信息
        //public string GetVclassStudentsInfo(int pageindex, int pagesize, int vclassid)
        //{
        //    var pcp = new ProcCustomPage("V_TM_StudentInfoDetail")
        //    {
        //        PageIndex = pageindex,
        //        PageSize = pagesize,
        //        OrderFields = "keyid desc",               
        //    };
        //    int recordCount;
        //    DataTable dt = base.GetPageWithSp(pcp, out recordCount);
        //    return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);
        //}
    }
}