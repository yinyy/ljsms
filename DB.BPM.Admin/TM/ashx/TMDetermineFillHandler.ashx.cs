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
using DB.Common.Data.Filter;
using DB.Common.Data;

namespace DB.BPM.Admin.TM.ashx
{
    /// <summary>
    /// dbHandler 的摘要说明
    /// </summary>
    public class TMDetermineFillHandler : IHttpHandler,IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            UserBll.Instance.CheckUserOnlingState();

            //int k;
            var json = HttpContext.Current.Request["json"];
            var rpm = new RequestParamModel<TMDetermineFillModel>(context) { CurrentContext = context };
            if (!string.IsNullOrEmpty(json))
            {
                rpm = JSONhelper.ConvertToObject<RequestParamModel<TMDetermineFillModel>>(json);
                rpm.CurrentContext = context;
            }

            switch (rpm.Action)
            {
                case "add":
                    context.Response.Write(TMDetermineFillBll.Instance.Add(rpm.Entity));
                    break;
                case "edit":
                    TMDetermineFillModel d = new TMDetermineFillModel();
                    d.InjectFrom(rpm.Entity);
                    d.KeyId = rpm.KeyId;
                    context.Response.Write(TMDetermineFillBll.Instance.Update(d));
                    break;
                case "delete":
                    context.Response.Write(TMDetermineFillBll.Instance.Delete(rpm.KeyId));
                    break;
                case "list_determines":
                    SqlFilter filter = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("Status", Convert.ToInt32(context.Request.Params["status"]), "eq"));

                    context.Response.Write(TMDetermineBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, filter.ToString(), rpm.Sort, rpm.Order));
                    break;
                default:
                    context.Response.Write(TMDetermineFillBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
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