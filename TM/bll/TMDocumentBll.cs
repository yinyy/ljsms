using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DB.Common.Provider;
using TM.Model;
using TM.Dal;
namespace TM.Bll
{
 public   class TMDocumentBll
    {
        public static TMDocumentBll Instance
        {
            get { return SingletonProvider<TMDocumentBll>.Instance; }
        }

        public int Add(TMDocumentModel model)
        {
            return TMDocumentDal.Instance.Insert(model);
        }

        public int Update(TMDocumentModel model)
        {
            return TMDocumentDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMDocumentDal.Instance.Delete(keyid);
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMDocumentDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }

        public TMDocumentModel Get(int keyId)
        {
            return TMDocumentDal.Instance.Get(keyId);
        }
    }
}
