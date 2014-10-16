using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using DB.BPM.Core;
using DB.BPM.Core.Bll;
namespace DB.BPM.Admin.ashx
{
    /// <summary>
    /// loginout 的摘要说明
    /// </summary>
    public class loginout : IHttpHandler,IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            
            SysVisitor.Instance.LoginOut();

            //context.Response.Redirect("~/default.aspx");
            context.Response.Write("ok");
            //context.Response.Write("系统已经安全退出关闭浏览器！");
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