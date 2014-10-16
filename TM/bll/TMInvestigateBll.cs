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
            string sql = "SELECT TM_TeachCourse.KeyId AS TeachCourseId, TM_Course.CourseName "+
                "FROM TM_TeachCourse "+
                "INNER JOIN TM_VirtualClass ON TM_TeachCourse.VClassID = TM_VirtualClass.KeyId "+
                "INNER JOIN TM_VClassStudents ON TM_VirtualClass.KeyId = TM_VClassStudents.VClassID "+
                "INNER JOIN TM_Course ON TM_TeachCourse.CourseID = TM_Course.KeyId "+
                "WHERE TM_TeachCourse.TermID=@TermID AND TM_VClassStudents.StudentID=@StudentId "+
                "ORDER BY TM_TeachCourse.KeyId";

            var q = DbUtils.ExecuteReader<InvestigateTempModel>(sql, new {TermID=SysVisitor.Instance.GetCurrentTerm().KeyId, StudentId=studentId }).ToList();

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
            string sql = "select TM_Investigate.TermId,TM_Investigate.KeyId as InvestigateId, TM_Investigate.Started, TM_Investigate.Ended, TM_Investigate.Title as InvestigateTitle, v1.*, "+
                "(select count(*) from TM_InvestigateFill where TM_InvestigateFill.InvestigateId=TM_Investigate.KeyId and TM_InvestigateFill.StudentId=v1.StudentId and TM_InvestigateFill.TeachCourseId=v1.TeachCourseId) as Status "+
                "from TM_Investigate cross join (SELECT dbo.Sys_Users.TrueName as TeacherName, TM_TeachCourse.KeyId as TeachCourseId, " +
                "dbo.TM_Course.CourseName, dbo.TM_Students.KeyId AS StudentId "+
                "FROM dbo.TM_TeachCourse INNER JOIN "+
                "dbo.Sys_Users ON dbo.TM_TeachCourse.TeacherID = dbo.Sys_Users.KeyId INNER JOIN "+
                "dbo.TM_Course ON dbo.TM_TeachCourse.CourseID = dbo.TM_Course.KeyId INNER JOIN "+
                "dbo.TM_VirtualClass ON dbo.TM_TeachCourse.VClassID = dbo.TM_VirtualClass.KeyId INNER JOIN "+
                "dbo.TM_VClassStudents ON dbo.TM_VirtualClass.KeyId = dbo.TM_VClassStudents.VClassID INNER JOIN "+
                "dbo.TM_Students ON dbo.TM_VClassStudents.StudentID = dbo.TM_Students.KeyId) v1 "+
                "WHERE TM_Investigate.TermId=@TermId and v1.StudentId=@StudentId and TM_Investigate.Started <= getDate() and TM_Investigate.Ended >= getDate() and TM_Investigate.Status=@Status and TM_Investigate.Kind=@Kind";

            return JSONhelper.ToJson(DbUtils.ExecuteReader<InvestigateTempModel>(sql, new { TermId = SysVisitor.Instance.GetCurrentTerm().KeyId, StudentId = studentId, Status=status, Kind=kind }).ToList());
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
