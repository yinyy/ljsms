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
    public class TMStudentsHandler : IHttpHandler,IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            UserBll.Instance.CheckUserOnlingState();
            string nm =PublicMethod.GetString(HttpContext.Current.Request["nm"]);
            int cid = PublicMethod.GetInt(HttpContext.Current.Request["cid"]);
            var id = HttpContext.Current.Request["id"];
            var json = HttpContext.Current.Request["json"];
            var rpm = new RequestParamModel<TMStudentsModel>(context) { CurrentContext = context, Action = context.Request["action"], KeyId = PublicMethod.GetInt(context.Request["keyid"]) };
            if (!string.IsNullOrEmpty(json))
            {
                rpm = JSONhelper.ConvertToObject<RequestParamModel<TMStudentsModel>>(json);
                rpm.CurrentContext = context;
            }

            switch (rpm.Action)
            {
                case "add":
                    context.Response.Write(TMStudentsBll.Instance.Add(rpm.Entity));
                    break;
                case "edit":
                    TMStudentsModel d = new TMStudentsModel();
                    d.InjectFrom(rpm.Entity);
                    d.KeyId = rpm.KeyId;
                    context.Response.Write(TMStudentsBll.Instance.Update(d));
                    break;
                case "delete":
                    context.Response.Write(TMStudentsBll.Instance.Delete(rpm.KeyId));
                    break;
                case "getbycid":
                    context.Response.Write(TMStudentsBll.Instance.GetListByClassID(rpm.KeyId));
                    break;
                case "getstudentbyid":
                    context.Response.Write(TMStudentsBll.Instance.GetStudentInfoByID(cid));//借用CID参数传递学生id，获取学生详细信息
                    break;
                case "colleges"://处理二级学院信息
                    // context.Response.Write(DB.BPM.Core.Bll.DepartmentBll.Instance.GetTopDepartmentJson());
                    context.Response.Write(DB.BPM.Core.Bll.DicBll.Instance.GetDicListBy(1));
                    break;
                case "teachers"://处理班主任或教师信息
                    // context.Response.Write(DB.BPM.Core.Bll.UserBll.Instance.GetUsersByDempartmentID(int.Parse(rpm.Request("depid"))));
                    context.Response.Write(DB.BPM.Core.Bll.UserBll.Instance.GetUsersByDempartmentID(rpm.KeyId));
                    break;
                case "proffession"://处理专业信息
                    //var categoryId = PublicMethod.GetInt(rpm.Request("categoryId"));
                    string dicJson = DicBll.Instance.GetDicListBy(7);
                    context.Response.Write(dicJson);
                    break;
                case "dics"://获取字典中相应类别的数据
                    context.Response.Write(DB.BPM.Core.Bll.DicBll.Instance.GetDicListBy(rpm.KeyId));
                    break;
                case "classes":
                    context.Response.Write(TMClassInfoBll.Instance.GetClasses(rpm.KeyId));
                    break;
                case "getc_p"://根据班级ID，获取其二级学院和专业
                     context.Response.Write(TMClassInfoBll.Instance.GetPandCBycid(rpm.KeyId));
                    break;
                case "GetStudentInfo":
                    if (id == "banzhuren")
                    {
                        //var str = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("ClassLeaderID", SysVisitor.Instance.UserId, "eq"));
                       //string str = "ClassLeaderID == " + SysVisitor.Instance.UserId.ToString();
                        string filter = rpm.Filter;
                        if (filter == "")
                        {
                            var str = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("ClassLeaderID", SysVisitor.Instance.UserId, "eq"));
                            filter = str.ToString();
                        }
                        context.Response.Write(TMStudentsBll.Instance.GetStudentInfoDetail("", rpm.Pageindex, rpm.Pagesize,filter, rpm.Sort, rpm.Order));
                      break;
                    }
                    if (id == "search")
                    {
                        if (cid!= 0)
                        {
                            var strp = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("ClassID", cid, "eq"));
                            context.Response.Write(TMStudentsBll.Instance.GetStudentInfoDetail(" ", rpm.Pageindex, rpm.Pagesize, strp.ToString(), rpm.Sort, rpm.Order));
                            break;
                        }
                        else
                        {
                            context.Response.Write(TMStudentsBll.Instance.GetStudentInfoDetail(" ", rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
                            break;
 
                        }
 
                    }                  
                    break;
                case  "GetBynumber":                    
                    var strnm = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("StudentNumber", nm, "cn"));
                    context.Response.Write(TMStudentsBll.Instance.GetStudentInfoDetail("", rpm.Pageindex, rpm.Pagesize, strnm.ToString(), rpm.Sort, rpm.Order));
                    break;
                case "GetByname":
                    var strnm1 = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("Name", nm, "cn"));
                    context.Response.Write(TMStudentsBll.Instance.GetStudentInfoDetail("", rpm.Pageindex, rpm.Pagesize, strnm1.ToString(), rpm.Sort, rpm.Order));
                    break; 
                default:
                    context.Response.Write(TMStudentsBll.Instance.GetStudentInfoDetail(" ", rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
                           
                  //context.Response.Write(TMStudentsBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
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