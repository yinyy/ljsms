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
    public class TMTermBll
    {
        public static TMTermBll Instance
        {
            get { return SingletonProvider<TMTermBll>.Instance; }
        }

        public int Add(TMTermModel model)
        {
            return TMTermDal.Instance.Insert(model);
        }

        public int Update(TMTermModel model)
        {
            return TMTermDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMTermDal.Instance.Delete(keyid);
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMTermDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }
        public string GetVirtualClassList()
        {
            var lists = TMTermDal.Instance.GetAll().ToList();

            return JSONhelper.ToJson(lists);
 
        }
        public string GetCurrenTermJson()
        {
            return JSONhelper.ToJson(TMTermDal.Instance.GetAll().Where(n => n.Status == "当前学期").First());
        }
    }
}
