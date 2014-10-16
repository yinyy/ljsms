using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TM.Dal;
using TM.Model;
using DB.Common.Provider;

namespace TM.Bll
{
    public class TMStudentLeaveBll
    {
        public static TMStudentLeaveBll Instance
        {
            get { return SingletonProvider<TMStudentLeaveBll>.Instance; }
        }

        public int Add(TMStudentLeaveModel model)
        {
            return TMStudentLeaveDal.Instance.Insert(model);
        }

        public int Update(TMStudentLeaveModel model)
        {
            return TMStudentLeaveDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMStudentLeaveDal.Instance.Delete(keyid);
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMStudentLeaveDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }
    }
}
