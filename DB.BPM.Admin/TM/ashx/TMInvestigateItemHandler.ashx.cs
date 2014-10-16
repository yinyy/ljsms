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
using DB.Common.Data;
using DB.Common.Data.Filter;
using System.Data;

namespace DB.BPM.Admin.TM.ashx
{
    /// <summary>
    /// dbHandler 的摘要说明
    /// </summary>
    public class TMInvestigateItemHandler : IHttpHandler,IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            UserBll.Instance.CheckUserOnlingState();

            //int k;
            var json = HttpContext.Current.Request["json"];
            var rpm = new RequestParamModel<TMInvestigateItemModel>(context) { CurrentContext = context };
            if (!string.IsNullOrEmpty(json))
            {
                rpm = JSONhelper.ConvertToObject<RequestParamModel<TMInvestigateItemModel>>(json);
                rpm.CurrentContext = context;
            }

            switch (rpm.Action)
            {
                case "add":
                    context.Response.Write(TMInvestigateItemBll.Instance.Add(rpm.Entity));
                    break;
                case "edit":
                    TMInvestigateItemModel d = new TMInvestigateItemModel();
                    d.InjectFrom(rpm.Entity);
                    d.KeyId = rpm.KeyId;

                    context.Response.Write(TMInvestigateItemBll.Instance.Update(d));
                    break;
                case "delete":
                    context.Response.Write(TMInvestigateItemBll.Instance.Delete(rpm.KeyId));
                    break;
                case "dics":
                    context.Response.Write(DicBll.Instance.GetDicListBy(rpm.KeyId));
                    break;
                case "itemsByInvestigate":
                    string filter = "";
                    FilterGroup group = new FilterGroup();
                    group.groupOp=GroupOp.AND;
                    group.Rules = new List<FilterRule>();
                    group.Rules.Add(new FilterRule("InvestigateId", rpm.KeyId, "eq"));

                    if (rpm.Filter != "")
                    {
                        group.Groups = new List<FilterGroup>();

                        FilterGroup rfg = JSONhelper.ConvertToObject<FilterGroup>(rpm.Filter);
                        group.Groups.Add(rfg);
                    }

                    filter = JSONhelper.ToJson(group);

                    context.Response.Write(TMInvestigateItemBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, filter, rpm.Sort, rpm.Order));

                    break;
                default:
                    context.Response.Write(TMInvestigateItemBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
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