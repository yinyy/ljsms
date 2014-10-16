using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TM.Dal;
using TM.Model;
using DB.Common.Provider;
using Newtonsoft.Json.Linq;
using DB.Common;
namespace TM.Bll
{
    public class TMStudentsBll
    {
        public static TMStudentsBll Instance
        {
            get { return SingletonProvider<TMStudentsBll>.Instance; }
        }

        public int Add(TMStudentsModel model)
        {
            return TMStudentsDal.Instance.Insert(model);
        }

        public int Update(TMStudentsModel model)
        {
            return TMStudentsDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMStudentsDal.Instance.Delete(keyid);
        }
        public string GetStudentInfoByID(int sid)
        {
            var student = TMStudentsDal.Instance.Get(sid);
            return JSONhelper.ToJson(student);
        }
        public string GetListByClassID(int cid)
        {
            var students = TMStudentsDal.Instance.GetWhere(new {ClassID=cid }).ToList();
            return JSONhelper.ToJson(students);
        }
        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMStudentsDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }
        public string GetStudentInfoDetail(string str, int pageindex, int pagesize, string filterJson, string sort = "StudentNumber", string order = "asc")
        {
            return TMStudentsDal.Instance.GetStudentDetailInfo(str,pageindex,pagesize,filterJson,sort,order);
        }
    }
}
