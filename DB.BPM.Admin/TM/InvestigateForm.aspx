<%@ Page Language="C#"%>

<link href="../../css/investigate.css?d=1" rel="stylesheet" />
<div id="investigate_page">
    <div id="investigate_title">
        <p style="text-align:center;margin:40px auto;font-size: 36px; font-weight:bolder;"><%=TM.Dal.TMInvestigateDal.Instance.Get(Convert.ToInt32(Request.Params["InvestigateId"])).Title%></p>
        <p style="text-align:center; font-size: 14px; color: #0000ff;">
            <%
                TM.Model.TMTeachCourseModel tcm = TM.Dal.TMTeachCourseDal.Instance.Get(Convert.ToInt32(Request.Params["TeachCourseId"]));
                DB.BPM.Core.Model.User teacher = DB.BPM.Core.Dal.UserDal.Instance.Get(tcm.TeacherID);
                TM.Model.TMCourseModel course = TM.Dal.TMCourseDal.Instance.Get(tcm.CourseID);
            %>

            <%=course.CourseName %> -- <%=teacher.TrueName %>
        </p>
        <p style="font-weight:bolder;"><%=ConfigurationManager.AppSettings["investigate_line2"] %></p>
        <p style="text-indent:32px;line-height:24px;"><%=ConfigurationManager.AppSettings["investigate_line3"] %></p>

    </div>
    <div id="investigate_range">

    </div>
</div>