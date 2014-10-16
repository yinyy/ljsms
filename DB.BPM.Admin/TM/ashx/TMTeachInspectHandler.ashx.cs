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
    public class TMTeachInspectHandler : IHttpHandler,IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            UserBll.Instance.CheckUserOnlingState(); 

            
            var json = HttpContext.Current.Request["json"];
            var cw = HttpContext.Current.Request["cw"];
            var ct = HttpContext.Current.Request["ct"];
            int rid = PublicMethod.GetInt(HttpContext.Current.Request["rid"]);
            int ws =  PublicMethod.GetInt(HttpContext.Current.Request["weeks"]);
            var rpm = new RequestParamModel<TMTeachInspectModel>(context) { CurrentContext = context, Action = context.Request["action"], KeyId = PublicMethod.GetInt(context.Request["keyid"]) };
            if (!string.IsNullOrEmpty(json))
            {
                rpm = JSONhelper.ConvertToObject<RequestParamModel<TMTeachInspectModel>>(json);
                rpm.CurrentContext = context;
            }

            switch (rpm.Action)
            {
                case "add":
                    rpm.Entity.InspectorID = SysVisitor.Instance.UserId;
                    context.Response.Write(TMTeachInspectBll.Instance.Add(rpm.Entity));
                    break;
                case "edit":
                    TMTeachInspectModel d = new TMTeachInspectModel();
                    d.InjectFrom(rpm.Entity);
                    d.KeyId = rpm.KeyId;
                    context.Response.Write(TMTeachInspectBll.Instance.Update(d));
                    break;
                case "delete":
                    context.Response.Write(TMTeachInspectBll.Instance.Delete(rpm.KeyId));
                    break;
                case "GetlistByInspectorID":
                    string str = "InspectorID = " + SysVisitor.Instance.UserId.ToString() ;
                    context.Response.Write(TMTeachInspectBll.Instance.GetJson(str,rpm.Pageindex, rpm.Pagesize,rpm.Filter, rpm.Sort, rpm.Order));
                    break;
                case "GetInfoByTeacherID":
                     string strteacher = "TeacherID = " + SysVisitor.Instance.UserId.ToString() ;
                    context.Response.Write(TMTeachInspectBll.Instance.GetJson(strteacher,rpm.Pageindex, rpm.Pagesize,rpm.Filter, rpm.Sort, rpm.Order));
                    break;
                case "bindadd":
                    context.Response.Write(TMTeachInspectBll.Instance.GetInitJson(cw, ct,rid,ws));
                    break;
                case "GetJsonByTeacherID":
                    context.Response.Write(TMTeachCourseBll.Instance.GetJsonByTeacherID(rpm.Pageindex, rpm.Pagesize, "", rpm.Sort, rpm.Order));
                    break;
                default:
                    context.Response.Write(TMTeachInspectBll.Instance.GetJson("",rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
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