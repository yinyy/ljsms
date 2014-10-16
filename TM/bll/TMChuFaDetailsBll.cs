using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TM.Dal;
using TM.Model;
using DB.Common.Provider;

namespace TM.Bll
{
    public class TMChuFaDetailsBll
    {
        public static TMChuFaDetailsBll Instance
        {
            get { return SingletonProvider<TMChuFaDetailsBll>.Instance; }
        }

        public int Add(TMChuFaDetailsModel model)
        {
            return TMChuFaDetailsDal.Instance.Insert(model);
        }

        public int Update(TMChuFaDetailsModel model)
        {
            return TMChuFaDetailsDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMChuFaDetailsDal.Instance.Delete(keyid);
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMChuFaDetailsDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }
        public string datesumgetByTeacherID(int uid)
        {
            return TMChuFaDetailsDal.Instance.datesumgetByTeacherID(uid);
        }
        public string classsumgetByTeacherID(int uid)
        {
            return TMChuFaDetailsDal.Instance.classsumgetByTeacherID(uid);
        }
        public int shenhe(int uid, int keyid)
        {
            return TMChuFaDetailsDal.Instance.shenhe(uid, keyid);
 
        }
        public int shenheall(int uid)
        {
            return TMChuFaDetailsDal.Instance.shenheall(uid);

        }
        public int quxiaoshenhe(int uid, int keyid)
        {
            return TMChuFaDetailsDal.Instance.quxiaoshenhe(uid, keyid);
        }
        public string datechufasum(DateTime startday, DateTime endday)//按指定闭区间日期范围统计
        {
            return TMChuFaDetailsDal.Instance.datechufasum(startday, endday);
        }
        public string personchufasum(DateTime startday, DateTime endday)//按指定闭区间日期范围统计,扣分人统计
        {
            return TMChuFaDetailsDal.Instance.personchufasum(startday, endday);
        }
        public string classchufasum(DateTime startday, DateTime endday)//按指定闭区间日期范围统计
        {
            return TMChuFaDetailsDal.Instance.classchufasum(startday, endday);
        }
        public string weeksumgetByClassLeaderID(int uid)
        {
            return TMChuFaDetailsDal.Instance.weeksumgetByClassLeaderID(uid);
        }
        public string studentsumgetByClassLeaderID(int uid)
        {
            return TMChuFaDetailsDal.Instance.studentsumgetByClassLeaderID(uid);
        }
        public string datesumgetByClassLeaderID(int uid)
        {
            return TMChuFaDetailsDal.Instance.datesumgetByClassLeaderID(uid);
        }
        
    }
}
