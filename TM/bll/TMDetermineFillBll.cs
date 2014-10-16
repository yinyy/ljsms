using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TM.Dal;
using TM.Model;
using DB.Common.Provider;

namespace TM.Bll
{
    public class TMDetermineFillBll
    {
        public static TMDetermineFillBll Instance
        {
            get { return SingletonProvider<TMDetermineFillBll>.Instance; }
        }

        public int Add(TMDetermineFillModel model)
        {
            return TMDetermineFillDal.Instance.Insert(model);
        }

        public int Update(TMDetermineFillModel model)
        {
            return TMDetermineFillDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMDetermineFillDal.Instance.Delete(keyid);
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMDetermineFillDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }

        public int SaveScore(int determineId, int expertId, int kind, List<TMDetermineFillModel> dfms)
        {
            return TMDetermineFillDal.Instance.SaveScore(determineId, expertId, kind, dfms);
        }

        public string ShowScoreJson(int determineId, int expertId, int kind)
        {
            return TMDetermineFillDal.Instance.ShowScoreJson(determineId, expertId, kind);
        }
    }
}
