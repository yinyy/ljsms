using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TM.Dal;
using TM.Model;
using DB.Common.Provider;
using DB.Common.Data;
namespace TM.Bll
{
    public class TMTeachCheckDetailsBll
    {
        public static TMTeachCheckDetailsBll Instance
        {
            get { return SingletonProvider<TMTeachCheckDetailsBll>.Instance; }
        }

        public int Add(TMTeachCheckDetailsModel model)
        {
            return TMTeachCheckDetailsDal.Instance.Insert(model);
        }

        public int Update(TMTeachCheckDetailsModel model)
        {
            return TMTeachCheckDetailsDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMTeachCheckDetailsDal.Instance.Delete(keyid);
        }
        public int deleteAll(int rkdid)
        {
            return DbUtils.DeleteWhere<TMTeachCheckDetailsModel>(new { TeachCheckID = rkdid });
        }
        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMTeachCheckDetailsDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }
    }
}
