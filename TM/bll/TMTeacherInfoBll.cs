using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TM.Dal;
using TM.Model;
using DB.Common.Provider;

namespace TM.Bll
{
    public class TMTeacherInfoBll
    {
        public static TMTeacherInfoBll Instance
        {
            get { return SingletonProvider<TMTeacherInfoBll>.Instance; }
        }

        public int Add(TMTeacherInfoModel model)
        {
            return TMTeacherInfoDal.Instance.Insert(model);
        }

        public int Update(TMTeacherInfoModel model)
        {
            return TMTeacherInfoDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMTeacherInfoDal.Instance.Delete(keyid);
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMTeacherInfoDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }
    }
}
