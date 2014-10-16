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
    public class TMVirtualClassBll
    {
        public static TMVirtualClassBll Instance
        {
            get { return SingletonProvider<TMVirtualClassBll>.Instance; }
        }

        public int Add(TMVirtualClassModel model)
        {
            return TMVirtualClassDal.Instance.Insert(model);
        }

        public int Update(TMVirtualClassModel model)
        {
            return TMVirtualClassDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMVirtualClassDal.Instance.Delete(keyid);
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMVirtualClassDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }
        public string VClassCategoryJson()
        {
            return TMVirtualClassDal.Instance.VClassCategoryJson();
        }

        public string VclassList()
        {
            return JSONhelper.ToJson(TMVirtualClassDal.Instance.GetAll().ToList().OrderBy(n => n.TermID)
                                       .Select(n => new
                                       {
                                           id = n.KeyId,
                                           text = n.VClassDescription + " [" + n.Status + "]",
                                           iconCls = "icon-bullet_green",
                                           attributes = new { n.TermID, n.Remark }
                                       })
                                    );
        }
    }
}
