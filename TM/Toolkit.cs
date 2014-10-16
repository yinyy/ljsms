using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TM.Model;
using TM.Dal;
using System.Web;


namespace TM
{
    public static class MyExtensionMethods
    {
        public static TMTermModel GetCurrentTerm(this DB.BPM.Core.SysVisitor target)
        {
            return TMTermDal.Instance.GetWhere(new { Status="当前学期"}).FirstOrDefault();
        }

        public static TMStudentsModel GetCurrentStudent(this DB.BPM.Core.SysVisitor target)
        {
            return (TMStudentsModel)HttpContext.Current.Session["Student"];
        }
    }
}
