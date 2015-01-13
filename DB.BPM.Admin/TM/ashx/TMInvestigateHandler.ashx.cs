using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using TM.Model;
using TM.Bll;

using Omu.ValueInjecter;
using DB.BPM.Core;
using DB.BPM.Core.Bll;
using DB.Common;
using TM;
using TM.Dal;
using DB.Common.Data;
using DB.Common.Data.Filter;
using System.Data;
using TM.model;

namespace DB.BPM.Admin.TM.ashx
{
    /// <summary>
    /// dbHandler 的摘要说明
    /// </summary>
    public class TMInvestigateHandler : IHttpHandler, IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            UserBll.Instance.CheckUserOnlingState();

            //int k;
            var json = HttpContext.Current.Request["json"];
            var rpm = new RequestParamModel<TMInvestigateModel>(context) { CurrentContext = context };
            if (!string.IsNullOrEmpty(json))
            {
                rpm = JSONhelper.ConvertToObject<RequestParamModel<TMInvestigateModel>>(json);
                rpm.CurrentContext = context;
            }

            switch (rpm.Action)
            {
                case "add":
                    TMInvestigateModel tim = new TMInvestigateModel();
                    tim.InjectFrom(rpm.Entity);

                    tim.Created = DateTime.Now;
                    tim.TermId = SysVisitor.Instance.GetCurrentTerm().KeyId;
                    tim.CreatorId = SysVisitor.Instance.CurrentUser.KeyId;

                    context.Response.Write(TMInvestigateBll.Instance.Add(tim));
                    break;
                case "edit":
                    TMInvestigateModel model = new TMInvestigateModel();
                    model.InjectFrom(rpm.Entity);
                    model.KeyId = rpm.KeyId;

                    context.Response.Write(TMInvestigateBll.Instance.Update(model));
                    break;
                case "delete":
                    context.Response.Write(TMInvestigateBll.Instance.Delete(rpm.KeyId));
                    break;
                case "preview_teacher":
                    context.Response.Write(TMInvestigateBll.Instance.GetTeacherInvestigatePreviewJson(rpm.KeyId));
                    break;
                case "preview_course":
                    context.Response.Write(TMInvestigateBll.Instance.GetCourseInvestigatePreviewJson(SysVisitor.Instance.GetCurrentStudent().KeyId));
                    break;
                case "copy":
                    model = new TMInvestigateModel();
                    model.InjectFrom(rpm.Entity);
                    model.KeyId = rpm.KeyId;
                    model.Created = DateTime.Now;
                    model.CreatorId = SysVisitor.Instance.CurrentUser.KeyId;
                    model.TermId = SysVisitor.Instance.GetCurrentTerm().KeyId;

                    context.Response.Write(TMInvestigateBll.Instance.Copy(model));
                    break;
                case "investigate_teacher_list":
                    context.Response.Write(TMInvestigateBll.Instance.GetTeacherInvestigatesByStudentIdJson(
                        SysVisitor.Instance.GetCurrentStudent().KeyId, 
                        PublicMethod.GetInt(context.Request.Params["kind"]),
                        PublicMethod.GetInt(context.Request.Params["status"])
                        ));
                    break;
                case "investigate_course_list":
                    context.Response.Write(TMInvestigateBll.Instance.GetCourseInvestigatesByStudentIdJson(
                        SysVisitor.Instance.GetCurrentStudent().KeyId,
                        PublicMethod.GetInt(context.Request.Params["kind"]),
                        PublicMethod.GetInt(context.Request.Params["status"])
                        ));
                    break;
                case "save_teacher":
                    List<TMInvestigateFillModel> investigates1 = JSONhelper.ConvertToObject<List<TMInvestigateFillModel>>(context.Request.Params["data"]);
                    int studentId = SysVisitor.Instance.GetCurrentStudent().KeyId;
                    
                    foreach (TMInvestigateFillModel i in investigates1)
                    {
                        i.StudentId = studentId;
                    }

                    context.Response.Write(TMInvestigateBll.Instance.SaveFilledTeacherInvestigate(investigates1));
                    break;
                case "save_course":
                    List<TMInvestigateFill2Model> investigates2 = JSONhelper.ConvertToObject<List<TMInvestigateFill2Model>>(context.Request.Params["data"]);
                    studentId = SysVisitor.Instance.GetCurrentStudent().KeyId;

                    foreach (TMInvestigateFill2Model i in investigates2)
                    {
                        i.Filled = DateTime.Now;
                        i.StudentId = studentId;
                    }

                    context.Response.Write(TMInvestigateBll.Instance.SaveFilledCourseInvestigate(investigates2));
                    break;
                case "show_teacher":
                    context.Response.Write(TMInvestigateBll.Instance.GetFilledTeacherInvestigateJson(
                        PublicMethod.GetInt(context.Request.Params["investigateId"]),
                        PublicMethod.GetInt(context.Request.Params["teachCourseId"]), 
                        PublicMethod.GetInt(context.Request.Params["studentId"])));
                    break;
                case "show_course":
                    context.Response.Write(TMInvestigateBll.Instance.GetFilledCourseInvestigateJson(
                        PublicMethod.GetInt(context.Request.Params["investigateId"]),
                        PublicMethod.GetInt(context.Request.Params["studentId"])));
                    break;
                case "analyseteacher":
                    context.Response.Write(TMInvestigateBll.Instance.AnalyseTeacher(rpm.KeyId));
                    break;
                case "analysecourse":
                    context.Response.Write(TMInvestigateBll.Instance.AnalyseCourse(rpm.KeyId));
                    break;
                default:
                    context.Response.Write(TMInvestigateBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
                    break;
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}