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

namespace TM.Web.TM.ashx
{
    /// <summary>
    /// dbHandler 的摘要说明
    /// </summary>
    public class TMTermHandler : IHttpHandler,IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            UserBll.Instance.CheckUserOnlingState();

           // int k;
            var json = HttpContext.Current.Request["json"];
            var rpm = new RequestParamModel<TMTermModel>(context) { CurrentContext = context };
            if (!string.IsNullOrEmpty(json))
            {
                rpm = JSONhelper.ConvertToObject<RequestParamModel<TMTermModel>>(json);
                rpm.CurrentContext = context;
            }

            switch (rpm.Action)
            {
                case "add":
                    context.Response.Write(TMTermBll.Instance.Add(rpm.Entity));
                    break;
                case "edit":
                    TMTermModel d = new TMTermModel();
                    d.InjectFrom(rpm.Entity);
                    d.KeyId = rpm.KeyId;
                    context.Response.Write(TMTermBll.Instance.Update(d));
                    break;
                case "delete":
                    context.Response.Write(TMTermBll.Instance.Delete(rpm.KeyId));
                    break;
                case "list":
                     context.Response.Write(TMTermBll.Instance.GetVirtualClassList());
                    break;
                case "termlist":
                    context.Response.Write(TMTermBll.Instance.GetVirtualClassList());
                    break;
                default:
                    context.Response.Write(TMTermBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
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