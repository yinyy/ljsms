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
namespace DB.BPM.Admin.TM.ashx
{
    /// <summary>
    /// dbHandler 的摘要说明
    /// </summary>
    public class TMChuFaHandler : IHttpHandler,IRequiresSessionState
    {
        
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            UserBll.Instance.CheckUserOnlingState();

            int k;
            var json = HttpContext.Current.Request["json"];
            var rpm = new RequestParamModel<TMChuFaDetailsModel>(context) { CurrentContext = context };
            if (!string.IsNullOrEmpty(json))
            {
                rpm = JSONhelper.ConvertToObject<RequestParamModel<TMChuFaDetailsModel>>(json);
                rpm.CurrentContext = context;
            }

            switch (rpm.Action)
            {
                case "add":
                    context.Response.Write(TMChuFaDetailsBll.Instance.Add(rpm.Entity));
                    break;
                case "edit":
                    TMChuFaDetailsModel d = new TMChuFaDetailsModel();
                    d.InjectFrom(rpm.Entity);
                    d.KeyId = rpm.KeyId;
                    context.Response.Write(TMChuFaDetailsBll.Instance.Update(d));
                    break;
                case "delete":
                    context.Response.Write(TMChuFaDetailsBll.Instance.Delete(rpm.KeyId));
                    break;
                case "getByTeacherID"://根据登录者的ID，仅显示他本人提交的罚分单
                    string filterstr = "";
                    if (rpm.Filter == "")
                    {
                        var tt = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("ChuFaRen", SysVisitor.Instance.UserId, "eq"));
                        filterstr = tt.ToString();
                    }
                    else
                    {
                        filterstr = rpm.Filter;

                    }
                    context.Response.Write(TMChuFaDetailsBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, filterstr, rpm.Sort, rpm.Order));
                    break;
                case "datesumgetByTeacherID":
                    context.Response.Write(TMChuFaDetailsBll.Instance.datesumgetByTeacherID(SysVisitor.Instance.UserId));
                
                    break;
                default:
                    context.Response.Write(TMChuFaDetailsBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
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