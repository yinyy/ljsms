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
using DB.BPM.Core.Model;
using System.Data;
using DB.Common.Data.Filter;

namespace DB.BPM.Admin.TM.ashx
{
    /// <summary>
    /// dbHandler 的摘要说明
    /// </summary>
    public class TMDetermineHandler : IHttpHandler,IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            UserBll.Instance.CheckUserOnlingState();

            //int k;
            var json = HttpContext.Current.Request["json"];
            var rpm = new RequestParamModel<TMDetermineModel>(context) { CurrentContext = context };
            if (!string.IsNullOrEmpty(json))
            {
                rpm = JSONhelper.ConvertToObject<RequestParamModel<TMDetermineModel>>(json);
                rpm.CurrentContext = context;
            }

            switch (rpm.Action)
            {
                case "add":
                    context.Response.Write(TMDetermineBll.Instance.Add(rpm.Entity));
                    break;
                case "edit":
                    TMDetermineModel d = new TMDetermineModel();
                    d.InjectFrom(rpm.Entity);
                    d.KeyId = rpm.KeyId;
                    context.Response.Write(TMDetermineBll.Instance.Update(d));
                    break;
                case "delete":
                    context.Response.Write(TMDetermineBll.Instance.Delete(rpm.KeyId));
                    break;
                case "all_teachers":
                    context.Response.Write(JSONhelper.ToJson(DbUtils.GetAll<User>().OrderBy(u => u.TrueName).Where(u => u.UserName != "admin").Select(u => new { KeyId = u.KeyId, Name = string.Format("{0}[{1}]", u.TrueName, u.Department.DepartmentName) }).ToList()));
                    break;
                case "list_teachers":
                    SqlFilter filter = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("DetermineId", rpm.KeyId, "eq"));
                    context.Response.Write(TMDetermineTeachersBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, filter.ToString(), rpm.Sort, rpm.Order));
                    break;
                case "save_teachers":
                    List<TMDetermineTeachersModel> dtms = JSONhelper.ConvertToObject<List<TMDetermineTeachersModel>>(context.Request.Params["data"]);
                    context.Response.Write(TMDetermineTeachersBll.Instance.Save(rpm.KeyId, dtms));
                    break;
                case "save_score":
                    List<TMDetermineFillModel> dfms = JSONhelper.ConvertToObject<List<TMDetermineFillModel>>(context.Request.Params["data"]);
                    int uid = SysVisitor.Instance.CurrentUser.KeyId;
                    int kind = Convert.ToInt32(context.Request.Params["kind"]);

                    foreach (TMDetermineFillModel m in dfms)
                    {
                        m.ExpertId = uid;
                    }
                    context.Response.Write(TMDetermineFillBll.Instance.SaveScore(rpm.KeyId, uid, kind, dfms));
                    break;
                case "preview":
                    context.Response.Write(TMDetermineTeachersBll.Instance.PreviewJson(rpm.KeyId));
                    break;
                case "show_score":
                    kind = Convert.ToInt32(context.Request.Params["kind"]);
                    uid = SysVisitor.Instance.CurrentUser.KeyId;

                    context.Response.Write(TMDetermineFillBll.Instance.ShowScoreJson(rpm.KeyId, uid, kind));
                    break;
                default:
                    context.Response.Write(TMDetermineBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
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