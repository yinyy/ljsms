using DB.BPM.Core;
using DB.BPM.Core.Bll;
using DB.Common;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using TM.Bll;
using TM.Model;

namespace DB.BPM.Admin.TM.ashx
{
    /// <summary>
    /// TMDocumentOperHandler 的摘要说明
    /// </summary>
    public class TMDocumentOperHandler : IHttpHandler, IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            UserBll.Instance.CheckUserOnlingState();

            var json = HttpContext.Current.Request["json"];
            var rpm = new RequestParamModel<TMDocumentModel>(context) { CurrentContext = context };
            if (!string.IsNullOrEmpty(json))
            {
                rpm = JSONhelper.ConvertToObject<RequestParamModel<TMDocumentModel>>(json);
                rpm.CurrentContext = context;
            }

            switch (rpm.Action)
            {
                case "dept":
                    context.Response.Write(DepartmentBll.Instance.GetDepartmentTreegridData().Replace("KeyId", "id").Replace("DepartmentName", "text"));
                    break;
                case "users":
                    string j = UserBll.Instance.GetJsonData(1, 99999, rpm.Filter,rpm.Sort,rpm.Order);
                    context.Response.Write(j);
                    break;
                default:
                    context.Response.Write(TMDocumentBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
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