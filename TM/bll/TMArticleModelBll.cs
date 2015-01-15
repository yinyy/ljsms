using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DB.Common.Provider;
using TM.Model;
using TM.Dal;
namespace TM.Bll
{
 public   class TMArticleBll
    {
        public static TMArticleBll Instance
        {
            get { return SingletonProvider<TMArticleBll>.Instance; 
            }
        }

        public int Add(TMArticleModel model)
        {
            return TMArticleDal.Instance.Insert(model);
        }

        public int Update(TMArticleModel model)
        {
            return TMArticleDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMArticleDal.Instance.Delete(keyid);
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMArticleDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }
    }
}
