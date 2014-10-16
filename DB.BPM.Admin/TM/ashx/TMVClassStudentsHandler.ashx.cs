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

namespace TM.Web.TM.ashx
{
    /// <summary>
    /// dbHandler 的摘要说明
    /// </summary>
    public class TMVClassStudentsHandler : IHttpHandler,IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            UserBll.Instance.CheckUserOnlingState();
            
            //int k;
            var json = HttpContext.Current.Request["json"];
            var jsonclasses = HttpContext.Current.Request["jsonclasses"];
            var vcid=PublicMethod.GetInt(HttpContext.Current.Request["vcid"]);
            var tcdate =HttpContext.Current.Request["tcdate"];
            
            var rpm = new RequestParamModel<TMVClassStudentsModel>(context) { CurrentContext = context,
         Action = context.Request["action"],
                KeyId = PublicMethod.GetInt( context.Request["KeyId"])
            
                
        };
            if (!string.IsNullOrEmpty(json))
            {
                rpm = JSONhelper.ConvertToObject<RequestParamModel<TMVClassStudentsModel>>(json);
                rpm.CurrentContext = context;
            }

            switch (rpm.Action)
            {
                case "add":
                    context.Response.Write(TMVClassStudentsBll.Instance.AddClasses(jsonclasses,vcid));
                    break;
                case "edit":
                    TMVClassStudentsModel d = new TMVClassStudentsModel();
                    d.InjectFrom(rpm.Entity);
                    d.KeyId = rpm.KeyId;
                    context.Response.Write(TMVClassStudentsBll.Instance.Update(d));
                    break;
                case "delete":
                    context.Response.Write(TMVClassStudentsBll.Instance.Delete(rpm.KeyId));
                    break;
                case "vlist":
                     var str = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("VClassID", rpm.KeyId, "eq"));
                    context.Response.Write(TMVClassStudentsBll.Instance.GetStudentsInfo(rpm.Pageindex, rpm.Pagesize,str.ToString()));                 
                    break;
                case "vslist":
                     var strvs = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("VClassID", vcid, "eq"));
                     DateTime dtime = Convert.ToDateTime(tcdate);
                    context.Response.Write(TMVClassStudentsBll.Instance.TCGetStudentsInfo("",rpm.Pageindex, rpm.Pagesize,strvs.ToString(),dtime));
                    break;
              
                default:
                    //context.Response.Write(TMVClassStudentsBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
                    var str1 = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("VClassID", rpm.KeyId, "eq"));
                    context.Response.Write(TMVClassStudentsBll.Instance.GetStudentsInfo(rpm.Pageindex, rpm.Pagesize,str1.ToString()));
                 
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