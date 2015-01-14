using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TM.Dal;
using TM.Model;
using DB.Common.Provider;
using DB.Common;
using DB.BPM.Core;
using DB.Common.Data;
using TM.model;
using System.Data.SqlClient;
using Excel = Microsoft.Office.Interop.Excel;
using System.Reflection;
using System.IO;
using System.Web;

namespace TM.Bll
{
    public class TMInvestigateBll
    {
        public static TMInvestigateBll Instance
        {
            get { return SingletonProvider<TMInvestigateBll>.Instance; }
        }

        public int Add(TMInvestigateModel model)
        {
            return TMInvestigateDal.Instance.Insert(model);
        }

        public int Update(TMInvestigateModel model)
        {
            TMInvestigateModel old = TMInvestigateDal.Instance.Get(model.KeyId);
            model.Created = old.Created;

            return TMInvestigateDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMInvestigateDal.Instance.Delete(keyid);
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMInvestigateDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }

        public string GetCourseInvestigatePreviewJson(int studentId)
        {
            string sql = "SELECT TM_TeachCourse.KeyId AS TeachCourseId, TM_Course.CourseName " +
                "FROM TM_TeachCourse " +
                "INNER JOIN TM_VirtualClass ON TM_TeachCourse.VClassID = TM_VirtualClass.KeyId " +
                "INNER JOIN TM_VClassStudents ON TM_VirtualClass.KeyId = TM_VClassStudents.VClassID " +
                "INNER JOIN TM_Course ON TM_TeachCourse.CourseID = TM_Course.KeyId " +
                "WHERE TM_TeachCourse.TermID=@TermID AND TM_VClassStudents.StudentID=@StudentId " +
                "ORDER BY TM_TeachCourse.KeyId";

            var q = DbUtils.ExecuteReader<InvestigateTempModel>(sql, new { TermID = SysVisitor.Instance.GetCurrentTerm().KeyId, StudentId = studentId }).ToList();

            return JSONhelper.ToJson(q);
        }

        public string GetTeacherInvestigatePreviewJson(int investigateId)
        {
            List<object> items = new List<object>();
            foreach (TMInvestigateItemModel item in TMInvestigateItemDal.Instance.GetWhere(new { InvestigateId = investigateId }).OrderBy(i => i.SortNumber))
            {
                List<object> choices = new List<object>();
                foreach (TMInvestigateItemChoiceModel choice in TMInvestigateItemChoiceDal.Instance.GetWhere(new { InvestigateItemId = item.KeyId }).OrderBy(c => c.SortNumber))
                {
                    var c = new { KeyId = choice.KeyId, Title = choice.Title, Score = choice.Score, HasOther = choice.HasOther };
                    choices.Add(c);
                }

                var i = new
                {
                    KeyId = item.KeyId,
                    Title = item.Title,
                    Columns = item.Columns,
                    Kind = item.Kind,
                    Choices = choices
                };
                items.Add(i);
            }

            var o = new { KeyId = investigateId, Items = items };

            return JSONhelper.ToJson(o);
        }

        public int Copy(TMInvestigateModel model)
        {
            return TMInvestigateDal.Instance.Copy(model);
        }

        public string GetTeacherInvestigatesByStudentIdJson(int studentId, int kind, int status)
        {
            string sql = "select TM_Investigate.TermId,TM_Investigate.KeyId as InvestigateId, TM_Investigate.Started, TM_Investigate.Ended, TM_Investigate.Title as InvestigateTitle, v1.*, " +
                "(select count(*) from TM_InvestigateFill where TM_InvestigateFill.InvestigateId=TM_Investigate.KeyId and TM_InvestigateFill.StudentId=v1.StudentId and TM_InvestigateFill.TeachCourseId=v1.TeachCourseId) as Status " +
                "from TM_Investigate cross join (SELECT dbo.Sys_Users.TrueName as TeacherName, TM_TeachCourse.KeyId as TeachCourseId, " +
                "dbo.TM_Course.CourseName, dbo.TM_Students.KeyId AS StudentId " +
                "FROM dbo.TM_TeachCourse INNER JOIN " +
                "dbo.Sys_Users ON dbo.TM_TeachCourse.TeacherID = dbo.Sys_Users.KeyId INNER JOIN " +
                "dbo.TM_Course ON dbo.TM_TeachCourse.CourseID = dbo.TM_Course.KeyId INNER JOIN " +
                "dbo.TM_VirtualClass ON dbo.TM_TeachCourse.VClassID = dbo.TM_VirtualClass.KeyId INNER JOIN " +
                "dbo.TM_VClassStudents ON dbo.TM_VirtualClass.KeyId = dbo.TM_VClassStudents.VClassID INNER JOIN " +
                "dbo.TM_Students ON dbo.TM_VClassStudents.StudentID = dbo.TM_Students.KeyId) v1 " +
                "WHERE TM_Investigate.TermId=@TermId and v1.StudentId=@StudentId and TM_Investigate.Started <= getDate() and TM_Investigate.Ended >= getDate() and TM_Investigate.Status=@Status and TM_Investigate.Kind=@Kind";

            return JSONhelper.ToJson(DbUtils.ExecuteReader<InvestigateTempModel>(sql, new { TermId = SysVisitor.Instance.GetCurrentTerm().KeyId, StudentId = studentId, Status = status, Kind = kind }).ToList());
        }

        public string GetCourseInvestigatesByStudentIdJson(int studentId, int kind, int status)
        {
            string sql = "SELECT TM_Investigate.KeyId as InvestigateId, Sys_Users.TrueName as CreatorName, TM_Investigate.Created, TM_Investigate.Started, " +
                "TM_Investigate.Ended, TM_Investigate.Title as InvestigateTitle, " +
                "(select count(*) from TM_InvestigateFill2 where TM_InvestigateFill2.InvestigateId=TM_Investigate.KeyId and TM_InvestigateFill2.StudentId=@StudentId) as Status " +
                "FROM TM_Investigate INNER JOIN Sys_Users ON TM_Investigate.CreatorId = dbo.Sys_Users.KeyId " +
                "where TM_Investigate.TermId=@TermId and TM_Investigate.Status=@Status and TM_Investigate.Started<=getDate() and TM_Investigate.Ended>=getDate() and TM_Investigate.Kind=@Kind";

            var q = DbUtils.ExecuteReader<InvestigateTempModel>(sql, new { StudentId = studentId, TermId = SysVisitor.Instance.GetCurrentTerm().KeyId, Status = status, Kind = kind }).Select(m => new
            {
                InvestigateId = m.InvestigateId,
                Started = m.Started,
                Ended = m.Ended,
                Title = m.InvestigateTitle,
                StudentId = studentId,
                Status = m.Status
            });

            return JSONhelper.ToJson(q.ToList());
        }

        public string GetFilledTeacherInvestigateJson(int iid, int tcid, int sid)
        {
            var models = TMInvestigateFillBll.Instance.GetWhere(new
            {
                StudentId = sid,
                TeachCourseId = tcid,
                InvestigateId = iid
            }).Select(m => new
            {
                InvestigateId = m.InvestigateId,
                ItemId = m.InvestigateItemId,
                ChoiceId = m.InvestigateItemChoiceId,
                Column = m.InvestigateItemChoiceColumnIndex,
                Other = m.Other
            });

            return JSONhelper.ToJson(models);
        }

        public int SaveFilledTeacherInvestigate(List<TMInvestigateFillModel> investigates)
        {
            int count = 0;
            foreach (TMInvestigateFillModel i in investigates)
            {
                if (DbUtils.Insert(i) > 0)
                {
                    count++;
                }
                else
                {
                    throw new Exception("发生错误。");
                }
            }

            return count;
        }

        public int SaveFilledCourseInvestigate(List<TMInvestigateFill2Model> investigates)
        {
            int count = 0;
            foreach (TMInvestigateFill2Model i in investigates)
            {
                if (DbUtils.Insert(i) > 0)
                {
                    count++;
                }
                else
                {
                    throw new Exception("发生错误。");
                }
            }

            return count;
        }

        public string GetFilledCourseInvestigateJson(int iid, int sid)
        {
            return JSONhelper.ToJson(DbUtils.GetWhere<TMInvestigateFill2Model>(new
            {
                InvestigateId = iid,
                StudentId = sid
            }).OrderBy(m => m.TeachCourseId).Select(m => new { TeachCourseId = m.TeachCourseId, Col1 = m.Col1, Col2 = m.Col2 }).ToList());
        }

        public string AnalyseTeacher(int kid)
        {
            Excel.Application app = new Excel.Application();
            Excel.Workbook book = app.Workbooks.Add();
            Excel.Worksheet sheet;
            Excel.Range rng;
            int iRow = 1;
            string sql;
            string file = "";

            try
            {
                #region 问卷详情
                sql = "SELECT dbo.TM_Course.CourseName, dbo.Sys_Users.TrueName, dbo.TM_ClassInfo.ClassName, dbo.TM_Students.Name, t.Score " +
                "FROM V_TM_Fill1_Detail t INNER JOIN " +
                "dbo.TM_TeachCourse ON t.TeachCourseId = dbo.TM_TeachCourse.KeyId INNER JOIN " +
                "dbo.Sys_Users ON dbo.TM_TeachCourse.TeacherID = dbo.Sys_Users.KeyId INNER JOIN " +
                "dbo.TM_Course ON dbo.TM_TeachCourse.CourseID = dbo.TM_Course.KeyId INNER JOIN " +
                "dbo.TM_ClassInfo ON t.ClassID = dbo.TM_ClassInfo.KeyId INNER JOIN " +
                "dbo.TM_Students ON t.StudentId = dbo.TM_Students.KeyId " +
                "where InvestigateId = " + kid;

                using (SqlDataReader reader = DbUtils.GetReader(sql))
                {
                    sheet = book.Worksheets.Add();
                    sheet.Name = "问卷详情";

                    iRow = 1;

                    rng = sheet.Cells[iRow, 1];
                    rng.Value = "教师";
                    rng = sheet.Cells[iRow, 2];
                    rng.Value = "课程";
                    rng = sheet.Cells[iRow, 3];
                    rng.Value = "班级";
                    rng = sheet.Cells[iRow, 4];
                    rng.Value = "学生";
                    rng = sheet.Cells[iRow, 5];
                    rng.Value = "分数";

                    while (reader.Read())
                    {
                        iRow++;

                        rng = sheet.Cells[iRow, 1];
                        rng.Value = reader["TrueName"].ToString();

                        rng = sheet.Cells[iRow, 2];
                        rng.Value = reader["CourseName"].ToString();

                        rng = sheet.Cells[iRow, 3];
                        rng.Value = reader["ClassName"].ToString();

                        rng = sheet.Cells[iRow, 4];
                        string tmp = reader["Name"].ToString();
                        rng.Value = tmp.Substring(0, 1).PadRight(tmp.Length, 'X');

                        rng = sheet.Cells[iRow, 5];
                        rng.Value = "'" + reader["Score"].ToString();
                    }
                }
                #endregion

                #region 按班级统计
                sql = "SELECT dbo.TM_Course.CourseName, dbo.Sys_Users.TrueName, dbo.TM_ClassInfo.ClassName, t.Score " +
                "FROM (select InvestigateId, TeachCourseId, ClassId, AVG(V_TM_Fill1_Detail.Score) as Score from V_TM_Fill1_Detail where InvestigateId = " + kid + " group by InvestigateId, TeachCourseId, ClassId) t INNER JOIN " +
                "dbo.TM_TeachCourse ON t.TeachCourseId = dbo.TM_TeachCourse.KeyId INNER JOIN " +
                "dbo.Sys_Users ON dbo.TM_TeachCourse.TeacherID = dbo.Sys_Users.KeyId INNER JOIN " +
                "dbo.TM_Course ON dbo.TM_TeachCourse.CourseID = dbo.TM_Course.KeyId INNER JOIN " +
                "dbo.TM_ClassInfo ON t.ClassID = dbo.TM_ClassInfo.KeyId";

                using (SqlDataReader reader = DbUtils.GetReader(sql))
                {
                    sheet = book.Worksheets.Add(Type.Missing, sheet);
                    sheet.Name = "按班级汇总";

                    iRow = 1;

                    rng = sheet.Cells[iRow, 1];
                    rng.Value = "教师";
                    rng = sheet.Cells[iRow, 2];
                    rng.Value = "课程";
                    rng = sheet.Cells[iRow, 3];
                    rng.Value = "班级";
                    rng = sheet.Cells[iRow, 4];
                    rng.Value = "分数";

                    while (reader.Read())
                    {
                        iRow++;

                        rng = sheet.Cells[iRow, 1];
                        rng.Value = reader["TrueName"].ToString();

                        rng = sheet.Cells[iRow, 2];
                        rng.Value = reader["CourseName"].ToString();

                        rng = sheet.Cells[iRow, 3];
                        rng.Value = reader["ClassName"].ToString();

                        rng = sheet.Cells[iRow, 4];
                        rng.Value = "'" + reader["Score"].ToString();
                    }
                }
                #endregion

                #region 按教师统计
                sql = "SELECT dbo.TM_Course.CourseName, dbo.Sys_Users.TrueName, t.Score " +
                "FROM (select InvestigateId, TeachCourseId, AVG(V_TM_Fill1_Detail.Score) as Score from V_TM_Fill1_Detail where InvestigateId = " + kid + " group by InvestigateId, TeachCourseId) t INNER JOIN " +
                "dbo.TM_TeachCourse ON t.TeachCourseId = dbo.TM_TeachCourse.KeyId INNER JOIN " +
                "dbo.Sys_Users ON dbo.TM_TeachCourse.TeacherID = dbo.Sys_Users.KeyId INNER JOIN " +
                "dbo.TM_Course ON dbo.TM_TeachCourse.CourseID = dbo.TM_Course.KeyId";

                using (SqlDataReader reader = DbUtils.GetReader(sql))
                {
                    sheet = book.Worksheets.Add(Type.Missing, sheet);
                    sheet.Name = "按教师汇总";

                    iRow = 1;

                    rng = sheet.Cells[iRow, 1];
                    rng.Value = "教师";
                    rng = sheet.Cells[iRow, 2];
                    rng.Value = "课程";
                    rng = sheet.Cells[iRow, 3];
                    rng.Value = "分数";

                    while (reader.Read())
                    {
                        iRow++;

                        rng = sheet.Cells[iRow, 1];
                        rng.Value = reader["TrueName"].ToString();

                        rng = sheet.Cells[iRow, 2];
                        rng.Value = reader["CourseName"].ToString();

                        rng = sheet.Cells[iRow, 3];
                        rng.Value = "'" + reader["Score"].ToString();
                    }
                }
                #endregion
            }
            catch (Exception e)
            {
                return "error_" + e.Message;
            }
            finally
            {
                if (book != null)
                {
                    try
                    {
                        file = string.Format("~/temp/{0}.xlsx", Convert.ToString(DateTime.Now.Ticks, 16));
                        book.SaveAs(System.Web.HttpContext.Current.Server.MapPath(file));
                    }
                    catch (Exception ee)
                    {
                        Console.WriteLine(ee.Message);
                    }
                }
                if (app != null)
                {
                    app.Quit();
                    app = null;
                }
            }

            return "success_" + file;
        }

        public string AnalyseCourse(int kid)
        {
            string sql = string.Format("select Sys_Users.TrueName, TM_Course.CourseName,TM_ClassInfo.ClassName, t.Col1, t.Col2 from (" +
                "SELECT TeachCourseId, classid, 'Col1'=stuff((select '；' + Col1 from TM_InvestigateFill2 f2 where f2.InvestigateId = {0} for xml path('')) , 1 , 1 , ''),'Col2'=stuff((select '；' + Col2 from TM_InvestigateFill2 f2 where f2.InvestigateId = {0} for xml path('')) , 1 , 1 , '')" +
                "FROM dbo.TM_InvestigateFill2 INNER JOIN " +
                "dbo.TM_Students ON dbo.TM_InvestigateFill2.StudentId = dbo.TM_Students.KeyId INNER JOIN " +
                "dbo.TM_ClassInfo ON dbo.TM_Students.ClassID = dbo.TM_ClassInfo.KeyId " +
                "WHERE (dbo.TM_InvestigateFill2.InvestigateId = {0}) " +
                "group by TeachCourseId, classid) t inner join TM_TeachCourse on t.TeachCourseId=TM_TeachCourse.KeyId " +
                "inner join Sys_Users on TM_TeachCourse.TeacherID=Sys_Users.KeyId " +
                "inner join TM_Course on TM_TeachCourse.CourseID = TM_Course.KeyId " +
                "inner join TM_ClassInfo on t.ClassID=TM_ClassInfo.KeyId", kid);


            Excel.Application app = new Excel.Application();
            Excel.Workbook book = app.Workbooks.Add();
            Excel.Worksheet sheet;
            Excel.Range rng;
            int iRow = 1;
            string file = "";

            try
            {
                using (SqlDataReader reader = DbUtils.GetReader(sql))
                {
                    sheet = book.Worksheets.Add();
                    sheet.Name = "问卷汇总";

                    iRow = 1;

                    rng = sheet.Cells[iRow, 1];
                    rng.Value = "教师";
                    rng = sheet.Cells[iRow, 2];
                    rng.Value = "课程";
                    rng = sheet.Cells[iRow, 3];
                    rng.Value = "班级";
                    rng = sheet.Cells[iRow, 4];
                    rng.Value = "存在问题";
                    rng = sheet.Cells[iRow, 5];
                    rng.Value = "反馈意见及建议";

                    while (reader.Read())
                    {
                        iRow++;

                        rng = sheet.Cells[iRow, 1];
                        rng.Value = reader["TrueName"].ToString();

                        rng = sheet.Cells[iRow, 2];
                        rng.Value = reader["CourseName"].ToString();

                        rng = sheet.Cells[iRow, 3];
                        rng.Value = reader["ClassName"].ToString();

                        rng = sheet.Cells[iRow, 4];
                        rng.Value = reader["Col1"].ToString();

                        rng = sheet.Cells[iRow, 5];
                        rng.Value = reader["Col2"].ToString();
                    }
                }
            }
            catch (Exception e)
            {
                return "error_" + e.Message;
            }
            finally
            {
                if (book != null)
                {
                    try
                    {
                        file = string.Format("~/temp/{0}.xlsx", Convert.ToString(DateTime.Now.Ticks, 16));
                        book.SaveAs(System.Web.HttpContext.Current.Server.MapPath(file));
                    }
                    catch (Exception ee)
                    {
                        Console.WriteLine(ee.Message);
                    }
                }
                if (app != null)
                {
                    app.Quit();
                    app = null;
                }
            }

            return "success_" + file;
        }

        public string ImportExcel(string filename, int iid)
        {
            Excel.Application app = new Excel.Application();
            Excel.Workbook book = app.Workbooks.Open(filename);
            Excel.Worksheet sheet = book.Worksheets[1];
            Excel.Range rng;
            int iRow = 2;
            int iCol;
            int iiid;
            string tmp;

            try
            {
                #region 先删除目前的题目设置
                IEnumerable<TMInvestigateItemModel> iims = TMInvestigateItemDal.Instance.GetWhere(new { InvestigateId = iid });
                foreach (TMInvestigateItemModel iim in iims)
                {
                    IEnumerable<TMInvestigateItemChoiceModel> iicms = TMInvestigateItemChoiceDal.Instance.GetWhere(new { InvestigateItemId = iim.KeyId });
                    foreach (TMInvestigateItemChoiceModel iicm in iicms)
                    {
                        TMInvestigateItemChoiceDal.Instance.Delete(iicm.KeyId);
                    }

                    TMInvestigateItemDal.Instance.Delete(iim.KeyId);
                }
                #endregion

                rng = sheet.Cells[iRow, 1];
                tmp = Convert.ToString(rng.Value);
                while (!string.IsNullOrWhiteSpace(tmp))
                {
                    TMInvestigateItemModel iim = new TMInvestigateItemModel();
                    iim.InvestigateId = iid;
                    iim.SortNumber = Convert.ToInt32(tmp);

                    rng = sheet.Cells[iRow, 2];
                    tmp = rng.Value;
                    iim.Kind = tmp == "单选题" ? 196 : 197;//这块是一个bug

                    rng = sheet.Cells[iRow, 3];
                    tmp = rng.Value;
                    iim.Title = tmp;

                    iim.Columns = "";
                    iiid = TMInvestigateItemDal.Instance.Insert(iim);

                    iCol = 4;
                    rng = sheet.Cells[iRow, iCol];
                    tmp = rng.Value;
                    while (!string.IsNullOrWhiteSpace(tmp))
                    {
                        TMInvestigateItemChoiceModel iicm = new TMInvestigateItemChoiceModel();
                        iicm.InvestigateItemId = iiid;
                        iicm.HasOther = 0;
                        iicm.SortNumber = (iCol - 4) / 2 + 1;
                        iicm.Title = tmp;

                        rng = sheet.Cells[iRow, ++iCol];
                        tmp = Convert.ToString(rng.Value);
                        iicm.Score = Convert.ToDecimal(tmp);

                        TMInvestigateItemChoiceDal.Instance.Insert(iicm);

                        rng = sheet.Cells[iRow, ++iCol];
                        tmp = rng.Value;
                    }

                    rng = sheet.Cells[++iRow, 1];
                    tmp = Convert.ToString(rng.Value);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
            finally
            {
                if (book != null)
                {
                    book.Close();
                }
                if (app != null)
                {
                    app.Quit();
                    app = null;
                }
            }

            return "success";
        }

        public string ExportExcel(int keyid)
        {
            Excel.Application app = new Excel.Application();
            Excel.Workbook book = app.Workbooks.Add();
            Excel.Worksheet sheet = book.Worksheets.Add();
            Excel.Range rng;
            int iRow;
            int iCol;
            string file = null;

            try
            {
                rng = sheet.Cells[1, 1];
                rng.Value = "序号";

                rng = sheet.Cells[1, 2];
                rng.Value = "类型";

                rng = sheet.Cells[1, 3];
                rng.Value = "题目";

                iRow = 2;
                IEnumerable<TMInvestigateItemModel> iims = TMInvestigateItemDal.Instance.GetWhere(new { InvestigateId = keyid }).OrderBy(a => a.SortNumber);
                foreach (TMInvestigateItemModel iim in iims)
                {
                    rng = sheet.Cells[iRow, 1];
                    rng.Value = Convert.ToString(iRow - 1);

                    rng = sheet.Cells[iRow, 2];
                    rng.Value = DB.BPM.Core.Dal.DicDal.Instance.Get(iim.Kind).Title;

                    rng = sheet.Cells[iRow, 3];
                    rng.Value = iim.Title;

                    iCol = 0;
                    IEnumerable<TMInvestigateItemChoiceModel> iicms = TMInvestigateItemChoiceDal.Instance.GetWhere(new { InvestigateItemId = iim.KeyId }).OrderBy(a => a.SortNumber);
                    foreach (TMInvestigateItemChoiceModel iicm in iicms)
                    {
                        rng = sheet.Cells[1, iCol * 2 + 4];
                        rng.Value = "选项" + (iCol + 1);
                        
                        rng = sheet.Cells[iRow, iCol * 2 + 4];
                        rng.Value = iicm.Title;

                        rng = sheet.Cells[1, iCol * 2 + 5];
                        rng.Value = "分值" + (iCol + 1); 
                        
                        rng = sheet.Cells[iRow, iCol * 2 + 5];
                        rng.Value = Convert.ToString(iicm.Score);

                        iCol++;
                    }

                    iRow++;
                }

                file = string.Format("~/temp/{0}.xlsx", Convert.ToString(DateTime.Now.Ticks, 16));
                book.SaveAs(System.Web.HttpContext.Current.Server.MapPath(file));
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return "error_" + e.Message;
            }
            finally
            {
                if (app != null)
                {
                    app.Quit();
                    app = null;
                }
            }

            return "success_" + file;
        }
    }

    internal class InvestigateTempModel
    {
        public int TermId { get; set; }
        public int InvestigateId { get; set; }
        public DateTime Started { get; set; }
        public DateTime Ended { get; set; }
        public string InvestigateTitle { get; set; }
        public string TeacherName { get; set; }
        public int TeachCourseId { get; set; }
        public string CourseName { get; set; }
        public int StudentId { get; set; }
        public int Status { get; set; }
    }
}
