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
    public class TMVirtualClassHandler : IHttpHandler,IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            UserBll.Instance.CheckUserOnlingState();

           // int k;
            var json = HttpContext.Current.Request["json"];
            var rpm = new RequestParamModel<TMVirtualClassModel>(context) { CurrentContext = context };
            if (!string.IsNullOrEmpty(json))
            {
                rpm = JSONhelper.ConvertToObject<RequestParamModel<TMVirtualClassModel>>(json);
                rpm.CurrentContext = context;
            }

            switch (rpm.Action)
            {
                case "add":
                    context.Response.Write(TMVirtualClassBll.Instance.Add(rpm.Entity));
                    break;
                case "edit":
                    TMVirtualClassModel d = new TMVirtualClassModel();
                    d.InjectFrom(rpm.Entity);
                    d.KeyId = rpm.KeyId;
                    context.Response.Write(TMVirtualClassBll.Instance.Update(d));
                    break;
                case "delete":
                    context.Response.Write(TMVirtualClassBll.Instance.Delete(rpm.KeyId));
                    break;
                case "list":
                 context.Response.Write(TMVirtualClassBll.Instance.VClassCategoryJson());
                    break;
                case "vclasslist":
                    context.Response.Write(TMVirtualClassBll.Instance.VclassList());
                    break;
                default:
                   context.Response.Write(TMVirtualClassBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
                    
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