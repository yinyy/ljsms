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
    public class TMTeachCheckDetailsHandler : IHttpHandler,IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            UserBll.Instance.CheckUserOnlingState();

            int k;
            var json = HttpContext.Current.Request["json"];
            var tcid = HttpContext.Current.Request["tcid"];
            var rpm = new RequestParamModel<TMTeachCheckDetailsModel>(context) { CurrentContext = context, Action = context.Request["action"], KeyId = PublicMethod.GetInt(context.Request["keyid"]) };
            if (!string.IsNullOrEmpty(json))
            {
                rpm = JSONhelper.ConvertToObject<RequestParamModel<TMTeachCheckDetailsModel>>(json);
                rpm.CurrentContext = context;
            }

            switch (rpm.Action)
            {
                case "add":
                    context.Response.Write(TMTeachCheckDetailsBll.Instance.Add(rpm.Entity));
                    break;
                case "edit":
                    TMTeachCheckDetailsModel d = new TMTeachCheckDetailsModel();
                    d.InjectFrom(rpm.Entity);
                    d.KeyId = rpm.KeyId;
                    context.Response.Write(TMTeachCheckDetailsBll.Instance.Update(d));
                    break;
                case "delete":
                    context.Response.Write(TMTeachCheckDetailsBll.Instance.Delete(rpm.KeyId));
                    break;
                case "checklist":
                    var str = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("TeachCheckID", tcid, "eq"));

                    context.Response.Write(
                        TMTeachCheckDetailsBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize,
                        str.ToString(), rpm.Sort, rpm.Order)
                        );
                    break;
                default:
                    context.Response.Write(TMTeachCheckDetailsBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
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