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

namespace TM.Web.TM.ashx
{
    /// <summary>
    /// dbHandler 的摘要说明
    /// </summary>
    public class TMStudentLeaveHandler : IHttpHandler,IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            UserBll.Instance.CheckUserOnlingState();

           // int k;
            var json = HttpContext.Current.Request["json"];
            var sdate = HttpContext.Current.Request["sdate"];
            int sid = PublicMethod.GetInt(HttpContext.Current.Request["sid"]);
            var rpm = new RequestParamModel<TMStudentLeaveModel>(context) { CurrentContext = context, Action = context.Request["action"] };
            if (!string.IsNullOrEmpty(json))
            {
                rpm = JSONhelper.ConvertToObject<RequestParamModel<TMStudentLeaveModel>>(json);
                rpm.CurrentContext = context;
            }

            switch (rpm.Action)
            {
                case "add":
                    context.Response.Write(TMStudentLeaveBll.Instance.Add(rpm.Entity));
                    break;
                case "edit":
                    TMStudentLeaveModel d = new TMStudentLeaveModel();
                    d.InjectFrom(rpm.Entity);
                    d.KeyId = rpm.KeyId;
                    context.Response.Write(TMStudentLeaveBll.Instance.Update(d));
                    break;
                case "delete":
                    context.Response.Write(TMStudentLeaveBll.Instance.Delete(rpm.KeyId));
                    break;
                case "getgridBysid_date":
                    var str1 = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("StudentID", sid, "eq"));
                    context.Response.Write(TMStudentLeaveBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, str1.ToString(), rpm.Sort, rpm.Order));
                    break;
                case "getByClassLeader":
                    var str2 = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("ClassLeaderID", SysVisitor.Instance.UserId, "eq"));
                    context.Response.Write(TMStudentLeaveBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, str2.ToString(), rpm.Sort, rpm.Order));
                  
                    break;

                default:
                    context.Response.Write(TMStudentLeaveBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
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