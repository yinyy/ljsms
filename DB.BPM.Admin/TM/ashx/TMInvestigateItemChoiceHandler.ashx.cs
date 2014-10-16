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
    public class TMInvestigateItemChoiceHandler : IHttpHandler,IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            UserBll.Instance.CheckUserOnlingState();

            //int k;
            var json = HttpContext.Current.Request["json"];
            var rpm = new RequestParamModel<TMInvestigateItemChoiceModel>(context) { CurrentContext = context };
            if (!string.IsNullOrEmpty(json))
            {
                rpm = JSONhelper.ConvertToObject<RequestParamModel<TMInvestigateItemChoiceModel>>(json);
                rpm.CurrentContext = context;
            }

            switch (rpm.Action)
            {
                case "add":
                    context.Response.Write(TMInvestigateItemChoiceBll.Instance.Add(rpm.Entity));
                    break;
                case "edit":
                    TMInvestigateItemChoiceModel d = new TMInvestigateItemChoiceModel();
                    d.InjectFrom(rpm.Entity);
                    d.KeyId = rpm.KeyId;
                    context.Response.Write(TMInvestigateItemChoiceBll.Instance.Update(d));
                    break;
                case "delete":
                    context.Response.Write(TMInvestigateItemChoiceBll.Instance.Delete(rpm.KeyId));
                    break;
                case "choicesByItem":
                    string filter = "";
                    FilterGroup group = new FilterGroup();
                    group.groupOp = GroupOp.AND;
                    group.Rules = new List<FilterRule>();
                    group.Rules.Add(new FilterRule("InvestigateItemId", rpm.KeyId, "eq"));

                    if (rpm.Filter != "")
                    {
                        group.Groups = new List<FilterGroup>();

                        FilterGroup rfg = JSONhelper.ConvertToObject<FilterGroup>(rpm.Filter);
                        group.Groups.Add(rfg);
                    }

                    filter = JSONhelper.ToJson(group);

                    context.Response.Write(TMInvestigateItemChoiceBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, filter, rpm.Sort, rpm.Order));
                    break;
                default:
                    context.Response.Write(TMInvestigateItemChoiceBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
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