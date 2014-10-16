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
        //���ݻ�ȡ�İ༶ѡ�����飬���Ӷ��ʵ��༶������༶��
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
        //��ȡ��ͼ��ѧ����ϸ��Ϣ
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

        //��ȡ��ͼ��ѧ����ϸ��Ϣ
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
            var leaves = TM.Dal.TMStudentLeaveDal.Instance.GetAll().Where(n => n.ClassApprove=="ͬ��" || n.LeaderApprove=="ͬ��").ToList();//��ȡѧ��������
            if (leaves != null)
            {
                var leavetitles = DB.BPM.Core.Dal.DicDal.Instance.GetAll().ToList();//��ȡ������������Ϣ

                dt.Columns.Add(new DataColumn("CheckBJ"));//������           
                string leaveinfo;
                foreach (DataRow row in dt.Rows)
                {
                    leaveinfo = "";
                    var row1 = row;
                    int s = (int)row["KeyId"];
                    //��ȡ������������Ч���ڷ�Χ�ڣ������ǰ�����ͬ�������Ժ�쵼ͬ���
                   // var leave11 = leaves.Where(n => n.StudentID == s && n.LeaveStart <= tcdate && n.LeaveEnd >= tcdate && (n.ClassApprove.Equals("ͬ��")||n.LeaderApprove.Equals("ͬ��"))).ToList();
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
                        leaveinfo += "[" + leave11.First().LeaveStart.ToString("MM-dd") + "��" + leave11.First().LeaveEnd.ToString("MM-dd") + "]";
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

        //��ȡָ������༶��ѧ����Ϣ
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