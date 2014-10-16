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
            var rpm = new RequestParamModel<TMChuFaDetailsModel>(context) { CurrentContext = context, Action = context.Request["action"], KeyId = PublicMethod.GetInt(context.Request["keyid"]) };
            DateTime StartDay = PublicMethod.GetDateTime(context.Request["sday"]);
            DateTime EndDay = PublicMethod.GetDateTime(context.Request["eday"]);
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
                case "getByClassLeaderID"://根据登录者的ID，作为班主任ID，获取相应班级罚分单信息
                    string filterstrclass = "";
                    if (rpm.Filter == "")
                    {
                        var tt = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("ClassLeaderID", SysVisitor.Instance.UserId, "eq"));

                        filterstrclass = tt.ToString();
                    }
                    else
                    {
                        filterstrclass = rpm.Filter;

                    }
                    context.Response.Write(TMChuFaDetailsBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, filterstrclass, rpm.Sort, rpm.Order));
                    break;
                case "datesumgetByClassLeaderID":
                    context.Response.Write(TMChuFaDetailsBll.Instance.datesumgetByClassLeaderID(SysVisitor.Instance.UserId));
                    break;
                case "studentsumgetByClassLeaderID":
                    context.Response.Write(TMChuFaDetailsBll.Instance.studentsumgetByClassLeaderID(SysVisitor.Instance.UserId));
                    break;
                case "weeksumgetByClassLeaderID":
                    context.Response.Write(TMChuFaDetailsBll.Instance.weeksumgetByClassLeaderID(SysVisitor.Instance.UserId));                    
                    break;
                case "datesumgetByTeacherID":
                    context.Response.Write(TMChuFaDetailsBll.Instance.datesumgetByTeacherID(SysVisitor.Instance.UserId));
                    break;
                case "classsumgetByTeacherID":
                    context.Response.Write(TMChuFaDetailsBll.Instance.classsumgetByTeacherID(SysVisitor.Instance.UserId));
                    break;
                case "shenhe":
                    context.Response.Write(TMChuFaDetailsBll.Instance.shenhe(SysVisitor.Instance.UserId,rpm.KeyId));
                    break;
                case "shenheall":
                    context.Response.Write(TMChuFaDetailsBll.Instance.shenheall(SysVisitor.Instance.UserId));
                    break;
                case "quxiaoshenhe":
                    context.Response.Write(TMChuFaDetailsBll.Instance.quxiaoshenhe(SysVisitor.Instance.UserId,rpm.KeyId));
                    break;
                case "datechufasum"://按日期汇总所有罚分
                    context.Response.Write(TMChuFaDetailsBll.Instance.datechufasum(StartDay,EndDay));
                    break;
                case "personchufasum"://按处罚人汇总所有罚分
                    context.Response.Write(TMChuFaDetailsBll.Instance.personchufasum(StartDay, EndDay));
                    break;
                case "classchufasum"://按班级汇总所有罚分
                    context.Response.Write(TMChuFaDetailsBll.Instance.classchufasum(StartDay, EndDay));
                    break;
                default:
                   // context.Response.Write(TMChuFaDetailsBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
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