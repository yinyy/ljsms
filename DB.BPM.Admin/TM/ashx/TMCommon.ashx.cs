using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using TM.Model;
using TM.Bll;
using Omu.ValueInjecter;
using DB.BPM.Core;
using DB.Common.Data.Filter;
using DB.BPM.Core.Bll;
using DB.Common;

using DB.Common.Data;
namespace DB.BPM.Admin.TM.ashx
{
    /// <summary>
    /// TMCommon 的摘要说明
    /// </summary>
    public class TMCommon : IHttpHandler, IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            UserBll.Instance.CheckUserOnlingState();
            string nm = PublicMethod.GetString(HttpContext.Current.Request["nm"]);
            int cid = PublicMethod.GetInt(HttpContext.Current.Request["cid"]);
            switch (nm)
            {
                case "GetUid":
                    context.Response.Write("{\"uid\":"+SysVisitor.Instance.UserId.ToString()+"}");
                    break;
                case "GetTerm":
                    context.Response.Write(TMTermBll.Instance.GetCurrenTermJson());
                    break;
                case "GetTeachers"://教师角色ID为26
                    context.Response.Write(UserBll.Instance.GetUsersByroleID(26));
                    break;
                default :
                    context.Response.Write("");
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