using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TM.Dal;
using TM.Model;
using DB.Common.Provider;

namespace TM.Bll
{
    public class TMVClassStudentsBll
    {
        public static TMVClassStudentsBll Instance
        {
            get { return SingletonProvider<TMVClassStudentsBll>.Instance; }
        }

        public int Add(TMVClassStudentsModel model)
        {
            return TMVClassStudentsDal.Instance.Insert(model);
        }
        public int AddClasses(string jsonclasses,int vcid)
        {
            return TMVClassStudentsDal.AddClasses(jsonclasses.Substring(1,jsonclasses.Length-2),vcid);
        }
        public int Update(TMVClassStudentsModel model)
        {
            return TMVClassStudentsDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMVClassStudentsDal.Instance.Delete(keyid);
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMVClassStudentsDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }

        public string GetStudentsInfo(int pageindex, int pagesize, string filterJSON)
        {
            return TMVClassStudentsDal.Instance.GetStudentsDetailInfo(pageindex, pagesize, filterJSON);
        }
        public string TCGetStudentsInfo(string str,int pageindex, int pagesize, string filterJSON,DateTime tcdate)
        {
            return TMVClassStudentsDal.Instance.TCGetStudentsDetailInfo(str,pageindex, pagesize, filterJSON,tcdate);
        }
    }
}
