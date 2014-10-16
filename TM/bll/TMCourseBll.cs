using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TM.Dal;
using TM.Model;
using DB.Common;
using DB.Common.Data;
using DB.Common.Data.Filter;
using DB.Common.Provider;
using Newtonsoft.Json.Linq;
namespace TM.Bll
{
    public class TMCourseBll
    {
        public static TMCourseBll Instance
        {
            get { return SingletonProvider<TMCourseBll>.Instance; }
        }

        public int Add(TMCourseModel model)
        {
            return TMCourseDal.Instance.Insert(model);
        }

        public int Update(TMCourseModel model)
        {
            return TMCourseDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMCourseDal.Instance.Delete(keyid);
        }
        public string GetCourseByProfId(int profid)
        {
            IEnumerable<TMCourseModel> courses = TMCourseDal.Instance.GetAll().Where(n => n.CourseProffessionID == profid);
            return JSONhelper.ToJson(courses);
        }
        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMCourseDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }
    }
}
