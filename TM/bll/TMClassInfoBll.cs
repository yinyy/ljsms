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
    public class TMClassInfoBll
    {
        public static TMClassInfoBll Instance
        {
            get { return SingletonProvider<TMClassInfoBll>.Instance; }
        }

        public int Add(TMClassInfoModel model)
        {
            return TMClassInfoDal.Instance.Insert(model);
        }

        public int Update(TMClassInfoModel model)
        {
            return TMClassInfoDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMClassInfoDal.Instance.Delete(keyid);
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMClassInfoDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }
        public string GetClasses(int pid)
        {
            return TMClassInfoDal.Instance.GetClassesByProfession(pid);
        }
        public string GetClassesBytid(int tid)
        {
            //IEnumerable<TMClassInfoModel> classes = TMClassInfoDal.Instance.GetAll().Where(n => n.ClassLeaderID == tid);
            var classes = TMClassInfoDal.Instance.GetAll().Where(n => n.ClassLeaderID == tid).ToList();
            return JSONhelper.ToJson(classes);
        }
        public string GetPandCBycid(int cid)
        {
            return TMClassInfoDal.Instance.GetPandCByClassID(cid);
        }
        public string GetAllClasses()//获取所有班级列表
        {
            var classes = TMClassInfoDal.Instance.GetAll().ToList();
           return JSONhelper.ToJson(classes);
        }
    }
}
