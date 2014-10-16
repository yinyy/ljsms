using DB.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using TM.Bll;
using TM.Dal;
using TM.Model;

namespace DB.BPM.Admin.Student.ashx
{
    /// <summary>
    /// LoginHandler 的摘要说明
    /// </summary>
    public class LoginHandler : IHttpHandler, IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            var userName = context.Request["username"];
            var password = context.Request["password"];

            var msg = new { success = false, message = "对不起，您输入的用户名不存在，请检查。" };

            TMStudentsModel student = TMStudentsDal.Instance.GetWhere(new { StudentNumber = userName }).FirstOrDefault();
            if (student != null)
            {
                if (student.Card == password)
                {
                    msg = new { success = true, message = "ok" };

                    //context.Session.Add("StudentId", userName);
                    //context.Session.Add("StudentName", student.Name);
                    context.Session.Add("Student", student);
                }
                else
                {
                    msg = new { success = false, message = "对不起，用户名或密码不正确。" };
                }
            }

            context.Response.Write(JSONhelper.ToJson(msg));
            context.Response.End();
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