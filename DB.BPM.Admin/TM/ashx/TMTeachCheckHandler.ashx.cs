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
namespace TM.WEB.TM.ashx
{
    /// <summary>
    /// dbHandler 的摘要说明
    /// </summary>
    public class TMTeachCheckHandler : IHttpHandler,IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
             
            UserBll.Instance.CheckUserOnlingState();

            int k;
            var rq = HttpContext.Current.Request["rq"];
            string nm = PublicMethod.GetString(HttpContext.Current.Request["nm"]);
            int cid = PublicMethod.GetInt(HttpContext.Current.Request["cid"]);
            var json = HttpContext.Current.Request["json"];
            var cw = HttpContext.Current.Request["cw"];//星期
            var ct = HttpContext.Current.Request["ct"];//节次
            int ws = PublicMethod.GetInt(HttpContext.Current.Request["ws"]);//教学周
            int coursetid = PublicMethod.GetInt(HttpContext.Current.Request["tt"]);//课程教师ID，用于查找教师授课，实际授课教师ID，存到TEACHER字段
            var sttj = HttpContext.Current.Request["str"];
            var rpm = new RequestParamModel<TMTeachCheckModel>(context) { CurrentContext = context, Action = context.Request["action"], KeyId = PublicMethod.GetInt(context.Request["keyid"]) };
            if (!string.IsNullOrEmpty(json))
            {
                rpm = JSONhelper.ConvertToObject<RequestParamModel<TMTeachCheckModel>>(json);
                rpm.CurrentContext = context;
            }

            switch (rpm.Action)
            {
                case "add": 
                    context.Response.Write(TMTeachCheckBll.Instance.Add(rpm.Entity));
                    break;
                case "edit":
                    TMTeachCheckModel d = new TMTeachCheckModel();
                    d.InjectFrom(rpm.Entity);
                    d.KeyId = rpm.KeyId; 
                    context.Response.Write(TMTeachCheckBll.Instance.Update(d));
                    break;
                case "delete":
                    context.Response.Write(TMTeachCheckBll.Instance.Delete(rpm.KeyId));
                    break;
                case "bindadd":
                    context.Response.Write(TMTeachCheckBll.Instance.GetInitJson(cw,ct,ws,coursetid)); 
                    break;
                case "tcourses":
                    context.Response.Write(TMTeachCheckBll.Instance.GetInitCourses());
                    break;
                case "GetJsonByTeacherID":
                    context.Response.Write(TMTeachCourseBll.Instance.GetJsonByTeacherID(rpm.Pageindex, rpm.Pagesize, "", rpm.Sort, rpm.Order));
                    break;
                case "GetJsonByTID":
                    var strfilter = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("TeacherID", cid, "eq"));
                    context.Response.Write(TMTeachCourseBll.Instance.GetJsonByTID(rpm.Pageindex, rpm.Pagesize,strfilter.ToString(), rpm.Sort, rpm.Order));
                    break;

                case "tvclasses":
                    context.Response.Write(TMTeachCheckBll.Instance.GetInitVClasses());
                    break;
                case "GetTCListByTeacherID":

                    string str = "TeacherID = '"+SysVisitor.Instance.UserId.ToString()+"'";
                    //以下这行为tm_teachcheck添加了teacherid字段后加的过滤条件，获取的是实际授过课的信息，再增加一个或条件，本人课程的也要显示，未写
                    string filterstr = "";
                    if (rpm.Filter =="")
                    {
                       
                        
                       SqlFilter tt = new SqlFilter(GroupOp.OR.ToString(), new FilterRule("Teacher", SysVisitor.Instance.UserId, "eq"));
                        tt.rules.Add(new FilterRule("TeacherID", SysVisitor.Instance.UserId, "eq"));

                      filterstr = tt.ToString();
                    }
                    else
                    {
                        filterstr = rpm.Filter;
 
                    }
                     context.Response.Write(TMTeachCheckBll.Instance.GetJson(str,rpm.Pageindex, rpm.Pagesize,filterstr, rpm.Sort, rpm.Order));
                    break;
                case "GetTCListAll"://本action用于管理查询-教学情况                    
                   
                    context.Response.Write(TMTeachCheckBll.Instance.GetJson("", rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
                   break;
                case "GetTCListToday"://获取今天授课日志信息
                   var tt1 = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("TeachDate", DateTime.Now, "eq"));
                   context.Response.Write(TMTeachCheckBll.Instance.GetJson("", rpm.Pageindex, rpm.Pagesize, tt1.ToString(), rpm.Sort, rpm.Order));
                 
                   break;
                case "GetTCStudentInfo"://以下为获取每个学生每次课考勤明细信息
                    context.Response.Write(TMTeachCheckBll.Instance.GetTCStudentDetailInfo("", rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
                    break;
                case "GetByTeacherID":
                    string filterstrbytid = "";
                    if (rpm.Filter == "")
                    {
                        var tt = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("TeacherID", SysVisitor.Instance.UserId, "eq"));
                        filterstrbytid = tt.ToString();
                    }
                    else
                    {
                        filterstrbytid = rpm.Filter;

                    }
                    //string strtid = "TeacherID =" + SysVisitor.Instance.UserId.ToString() ;
                    context.Response.Write(TMTeachCheckBll.Instance.GetTCStudentDetailInfo("", rpm.Pageindex, rpm.Pagesize, filterstrbytid, rpm.Sort, rpm.Order));
                    break;
                case "GetByClass"://原来应用于班级考勤明细，已经换用到下一个action.，后面如果没用的话就悬空了
                    string strcid = "1=1 ";
                    if (cid != 0)
                    {
                         strcid = "ClassID =" + cid.ToString();
                    }
                     if (rq == "teacher")
                     {
                         strcid += " and TeacherID =" + SysVisitor.Instance.UserId.ToString();
                     }
                     if (rq == "class")
                     {
                         strcid += " and ClassLeaderID =" + SysVisitor.Instance.UserId.ToString();

                     }


                    context.Response.Write(TMTeachCheckBll.Instance.GetTCStudentDetailInfo(strcid, rpm.Pageindex, rpm.Pagesize,rpm.Filter, rpm.Sort, rpm.Order));
                    break; 
                case "GetTClistByClass":
                     string filterstrbyclass = "";
                    if (rpm.Filter == "")
                    {
                        var tt = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("ClassLeaderID", SysVisitor.Instance.UserId, "eq"));
                        filterstrbyclass = tt.ToString();
                    }
                    else
                    {
                        filterstrbyclass = rpm.Filter;

                    }
                    
                    context.Response.Write(TMTeachCheckBll.Instance.GetTCStudentDetailInfo("", rpm.Pageindex, rpm.Pagesize, filterstrbyclass, rpm.Sort, rpm.Order));
                    break;
                   
                case "GetBynumber":
                    string strn = "StudentNumber like '%" + nm+"%'" ;
                     if (rq == "teacher")
                     {
                         strn += " and TeacherID =" + SysVisitor.Instance.UserId.ToString();
                     }
                     if (rq == "class")
                     {
                         strn += " and ClassLeaderID =" + SysVisitor.Instance.UserId.ToString();
 
                     }
                     context.Response.Write(TMTeachCheckBll.Instance.GetTCStudentDetailInfo(strn, rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
                      break;

                case "GetByname":
                     string strm = "Name like '%" + nm+"%'" ;
                     if (rq == "teacher")
                     {
                         strm += " and TeacherID =" + SysVisitor.Instance.UserId.ToString();
                     }
                     if (rq == "class")
                     {
                         strm += " and ClassLeaderID =" + SysVisitor.Instance.UserId.ToString();

                     }
                     context.Response.Write(TMTeachCheckBll.Instance.GetTCStudentDetailInfo(strm, rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
                      break;
                case "GetCourseSumByTeacher"://以下为获取每门课程每个学生考勤汇总
                    // string strtidsum = "TeacherID =" + SysVisitor.Instance.UserId.ToString() ;
                     string filterstrsumbyteacher = "";
                    if (rpm.Filter == "")
                    {
                        var tt = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("TeacherID", SysVisitor.Instance.UserId, "eq"));
                        filterstrsumbyteacher = tt.ToString();
                    }
                    else
                    {
                        filterstrsumbyteacher = rpm.Filter;

                    }


                    context.Response.Write(TMTeachCheckBll.Instance.GetTCSumByCourse("", rpm.Pageindex, rpm.Pagesize, filterstrsumbyteacher, rpm.Sort, rpm.Order));
                    break;
                case "GetCourseSumByClass":
                    string strcidcs = "1=1 ";
                    if (cid != 0)
                    {
                         strcidcs = "ClassID =" + cid.ToString();
                    }
                     if (rq == "teacher")
                     {
                         strcidcs += " and TeacherID =" + SysVisitor.Instance.UserId.ToString();
                     }
                     if (rq == "class")
                     {
                         strcidcs += " and ClassLeaderID =" + SysVisitor.Instance.UserId.ToString();

                     }
                     context.Response.Write(TMTeachCheckBll.Instance.GetTCSumByCourse(strcidcs, rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
                    break;                     
                case "GetCourseSumByNumber":
                     string strncs = "StudentNumber like '%" + nm+"%'" ;
                     if (rq == "teacher")
                     {
                         strncs += " and TeacherID =" + SysVisitor.Instance.UserId.ToString();
                     }
                     if (rq == "class")
                     {
                         strncs += " and ClassLeaderID =" + SysVisitor.Instance.UserId.ToString();
 
                     }
                     context.Response.Write(TMTeachCheckBll.Instance.GetTCSumByCourse(strncs, rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
                      break;
                case "GetCourseSumByName":
                    string strmcs = "Name like '%" + nm+"%'" ;
                     if (rq == "teacher")
                     {
                         strmcs += " and TeacherID =" + SysVisitor.Instance.UserId.ToString();
                     }
                     if (rq == "class")
                     {
                         strmcs += " and ClassLeaderID =" + SysVisitor.Instance.UserId.ToString();

                     }
                     context.Response.Write(TMTeachCheckBll.Instance.GetTCSumByCourse(strmcs, rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
                      break;
                case "GetStudentSum"://以下为获取每个学生考勤汇总
                      context.Response.Write(TMTeachCheckBll.Instance.GetTCSumByStudent("", rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
                    break;
                case "GetStudentSumByClass":
                      string strcidss = "1=1 ";
                    if (cid != 0)
                    {
                         strcidss = "ClassID =" + cid.ToString();
                    }
                     if (rq == "teacher")
                     {
                         strcidss += " and TeacherID =" + SysVisitor.Instance.UserId.ToString();
                     }
                     if (rq == "class")
                     {
                         strcidss += " and ClassLeaderID =" + SysVisitor.Instance.UserId.ToString();

                     }
                     context.Response.Write(TMTeachCheckBll.Instance.GetTCSumByStudent(strcidss, rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
                    break;  
                case "GetTCListSumByClass":
                     string filterstrsumbyclass = "";
                    if (rpm.Filter == "")
                    {
                        var tt = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("ClassLeaderID", SysVisitor.Instance.UserId, "eq"));
                        filterstrsumbyclass = tt.ToString();
                    }
                    else
                    {
                        filterstrsumbyclass = rpm.Filter;

                    }
                    context.Response.Write(TMTeachCheckBll.Instance.GetTCSumByStudent("", rpm.Pageindex, rpm.Pagesize, filterstrsumbyclass, rpm.Sort, rpm.Order));
                   

                    break;
                case "GetStudentSumByNumber":
                      string strnss = "StudentNumber like '%" + nm+"%'" ;
                     if (rq == "teacher")
                     {
                         strnss += " and TeacherID =" + SysVisitor.Instance.UserId.ToString();
                     }
                     if (rq == "class")
                     {
                         strnss += " and ClassLeaderID =" + SysVisitor.Instance.UserId.ToString();
 
                     }
                     context.Response.Write(TMTeachCheckBll.Instance.GetTCSumByStudent(strnss, rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
                      break;
                case "GetStudentSumByName":
                      string strmss = "Name like '%" + nm+"%'" ;
                     if (rq == "teacher")
                     {
                         strmss += " and TeacherID =" + SysVisitor.Instance.UserId.ToString();
                     }
                     if (rq == "class")
                     {
                         strmss += " and ClassLeaderID =" + SysVisitor.Instance.UserId.ToString();

                     }
                     context.Response.Write(TMTeachCheckBll.Instance.GetTCSumByStudent(strmss, rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
                      break;

                default:
                      string str1 = "";
                      if (sttj != "")
                      {
                          str1 = sttj;
                      }                  

                    context.Response.Write(TMTeachCheckBll.Instance.GetJson(str1,rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
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