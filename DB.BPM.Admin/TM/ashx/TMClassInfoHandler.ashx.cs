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
    public class TMClassInfoHandler : IHttpHandler,IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            UserBll.Instance.CheckUserOnlingState();

           // int k;
            var json = HttpContext.Current.Request["json"];
            var rpm = new RequestParamModel<TMClassInfoModel>(context) { CurrentContext = context, Action = context.Request["action"] };
            if (!string.IsNullOrEmpty(json))
            {
                rpm = JSONhelper.ConvertToObject<RequestParamModel<TMClassInfoModel>>(json);
                rpm.CurrentContext = context;
            }

            switch (rpm.Action)
            {
                case "userdep"://根据用户ID获取部门ID,实际是先获取用户对象，然后取得
                    context.Response.Write(JSONhelper.ToJson(UserBll.Instance.GetUser(rpm.KeyId)));
                    break;
                case "deps"://获取班主任所在部门树
                    context.Response.Write(UserBll.Instance.GetDepartmentTreeData());
                    break;
                case "add":
                    context.Response.Write(TMClassInfoBll.Instance.Add(rpm.Entity));
                    break;
                case "edit":
                    TMClassInfoModel d = new TMClassInfoModel();
                    d.InjectFrom(rpm.Entity);
                    d.KeyId = rpm.KeyId;
                    context.Response.Write(TMClassInfoBll.Instance.Update(d));
                    break;
                case "delete":
                    context.Response.Write(TMClassInfoBll.Instance.Delete(rpm.KeyId));
                    break;
                case "getclassesBytid":
                    context.Response.Write(TMClassInfoBll.Instance.GetClassesBytid(SysVisitor.Instance.UserId));
                    break;
                case "colleges":
                   // context.Response.Write(DB.BPM.Core.Bll.DepartmentBll.Instance.GetTopDepartmentJson());
                    context.Response.Write(DB.BPM.Core.Bll.DicBll.Instance.GetDicListBy(1));
                    break;
                case "teachers":
                   // context.Response.Write(DB.BPM.Core.Bll.UserBll.Instance.GetUsersByDempartmentID(int.Parse(rpm.Request("depid"))));
                    context.Response.Write(DB.BPM.Core.Bll.UserBll.Instance.GetUsersByDempartmentID(rpm.KeyId));
                    break;
                case "proffession":
                    //var categoryId = PublicMethod.GetInt(rpm.Request("categoryId"));
                    string dicJson = DicBll.Instance.GetDicListBy(7);
                    context.Response.Write(dicJson); 
                    break;
                case "getAllClasses":
                    context.Response.Write(TMClassInfoBll.Instance.GetAllClasses());
                    break;
                default:
                    context.Response.Write(TMClassInfoBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
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