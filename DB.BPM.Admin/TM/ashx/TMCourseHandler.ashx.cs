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
    public class TMCourseHandler : IHttpHandler,IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            UserBll.Instance.CheckUserOnlingState();
            int profid = PublicMethod.GetInt(HttpContext.Current.Request["profid"]);
            int k;
            var json = HttpContext.Current.Request["json"];
            var rpm = new RequestParamModel<TMCourseModel>(context) { CurrentContext = context, Action = context.Request["action"] };
            if (!string.IsNullOrEmpty(json))
            {
                rpm = JSONhelper.ConvertToObject<RequestParamModel<TMCourseModel>>(json);
                rpm.CurrentContext = context;
            }

            switch (rpm.Action)
            {
                case "add":
                    context.Response.Write(TMCourseBll.Instance.Add(rpm.Entity));
                    break;
                case "edit":
                    TMCourseModel d = new TMCourseModel();
                    d.InjectFrom(rpm.Entity);
                    d.KeyId = rpm.KeyId;
                    context.Response.Write(TMCourseBll.Instance.Update(d));
                    break;
                case "delete":
                    context.Response.Write(TMCourseBll.Instance.Delete(rpm.KeyId));
                    break;
                case "getCourseByProfid":
                    //context.Response.Write(TMCourseBll.Instance.GetCourseByProfId(profid));
                    var str1 = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("CourseProffessionID", profid, "eq"));

                    context.Response.Write(TMCourseBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, str1.ToString(), rpm.Sort, rpm.Order));
                    break;
                case "GetcourseslistbyProfid"://用于授课安排中根据专业获取课程
                    context.Response.Write(TMCourseBll.Instance.GetCourseByProfId(profid));
                    break;
                default:
                    context.Response.Write(TMCourseBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
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