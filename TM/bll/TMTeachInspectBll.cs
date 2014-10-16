using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TM.Dal;
using TM.Model;
using DB.Common.Provider;

namespace TM.Bll
{
    public class TMTeachInspectBll
    {
        public static TMTeachInspectBll Instance
        {
            get { return SingletonProvider<TMTeachInspectBll>.Instance; }
        }

        public int Add(TMTeachInspectModel model)
        {
            return TMTeachInspectDal.Instance.Insert(model);
        }

        public int Update(TMTeachInspectModel model)
        {
            return TMTeachInspectDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMTeachInspectDal.Instance.Delete(keyid);
        }
        public string GetInitJson(string courseday, string coursetime, int rid, int weeks)
        {
            return TMTeachInspectDal.Instance.GetInitJson(courseday,coursetime,rid,weeks);
        }
        public string GetJson(string str,int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMTeachInspectDal.Instance.GetJson(str,pageindex, pagesize, filterJson, sort, order);
        }
    }
}
