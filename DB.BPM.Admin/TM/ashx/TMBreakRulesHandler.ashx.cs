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

namespace DB.BPM.Admin.TM.ashx
{
    /// <summary>
    /// dbHandler 的摘要说明
    /// </summary>
    public class TMBreakRulesHandler : IHttpHandler,IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            UserBll.Instance.CheckUserOnlingState();

            int k;
            var json = HttpContext.Current.Request["json"];
            var rpm = new RequestParamModel<TMBreakRulesModel>(context) { CurrentContext = context };
            if (!string.IsNullOrEmpty(json))
            {
                rpm = JSONhelper.ConvertToObject<RequestParamModel<TMBreakRulesModel>>(json);
                rpm.CurrentContext = context;
            }

            switch (rpm.Action)
            {
                case "add":
                    context.Response.Write(TMBreakRulesBll.Instance.Add(rpm.Entity));
                    break;
                case "edit":
                    TMBreakRulesModel d = new TMBreakRulesModel();
                    d.InjectFrom(rpm.Entity);
                    d.KeyId = rpm.KeyId;
                    context.Response.Write(TMBreakRulesBll.Instance.Update(d));
                    break;
                case "delete":
                    context.Response.Write(TMBreakRulesBll.Instance.Delete(rpm.KeyId));
                    break;
                default:
                    context.Response.Write(TMBreakRulesBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
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