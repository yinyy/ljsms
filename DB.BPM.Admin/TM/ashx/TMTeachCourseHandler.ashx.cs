using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using TM.Model;
using TM.Bll;
using DB.Common.Data.Filter;
using Omu.ValueInjecter;
using DB.BPM.Core;
using DB.BPM.Core.Bll;
using DB.Common;
using DB.Common.Data;
namespace TM.WEB.TM.ashx
{
    /// <summary>
    /// dbHandler 的摘要说明
    /// </summary>
    public class TMTeachCourseHandler : IHttpHandler,IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            UserBll.Instance.CheckUserOnlingState();

            int k;
            var json = HttpContext.Current.Request["json"];
            int tid = PublicMethod.GetInt(HttpContext.Current.Request["tid"]);
            var rpm = new RequestParamModel<TMTeachCourseModel>(context) { CurrentContext = context, Action = context.Request["action"], KeyId = PublicMethod.GetInt(context.Request["keyid"]) };
            if (!string.IsNullOrEmpty(json))
            {
                rpm = JSONhelper.ConvertToObject<RequestParamModel<TMTeachCourseModel>>(json);
                 
                rpm.CurrentContext = context;
            }

            switch (rpm.Action)
            { 
                case "add":
                    context.Response.Write(TMTeachCourseBll.Instance.Add(rpm.Entity));
                    break;
                case "edit":
                    TMTeachCourseModel d = new TMTeachCourseModel();
                    d.InjectFrom(rpm.Entity);
                    d.KeyId = rpm.KeyId;
                    context.Response.Write(TMTeachCourseBll.Instance.Update(d));
                    break;
                case "delete":
                    context.Response.Write(TMTeachCourseBll.Instance.Delete(rpm.KeyId));
                    break;
                case "mx":
                    var str = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("TeachCourseID", rpm.KeyId, "eq"));

                    context.Response.Write(
                        TMTeachCourseDetailBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize,
                        str.ToString(), rpm.Sort, rpm.Order)
                        );
                    break;
                case "GetByTeacherID":
                    var str111 = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("TeacherID", tid, "eq"));
                    context.Response.Write(TMTeachCourseBll.Instance.GetCourseByTeacher(rpm.Pageindex, rpm.Pagesize,str111.ToString(), rpm.Sort, rpm.Order));
                    break;
                default:
                    context.Response.Write(TMTeachCourseBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
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