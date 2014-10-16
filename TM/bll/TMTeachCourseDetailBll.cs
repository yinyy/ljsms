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
    public class TMTeachCourseDetailBll
    {
        public static TMTeachCourseDetailBll Instance
        {
            get { return SingletonProvider<TMTeachCourseDetailBll>.Instance; }
        }

        public int Add(TMTeachCourseDetailModel model)
        {
            return TMTeachCourseDetailDal.Instance.Insert(model);
        }

        public int Update(TMTeachCourseDetailModel model)
        {
            return TMTeachCourseDetailDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMTeachCourseDetailDal.Instance.Delete(keyid);
        }
        /// <summary>
        /// ɾ����ⵥ�����е���ϸ��¼
        /// </summary>
        /// <param name="rkdid">��ⵥID</param>
        /// <returns></returns>
        public int deleteAll(int rkdid)
        {
            return DbUtils.DeleteWhere<TMTeachCourseDetailModel>(new { TeachCourseID = rkdid });
        }
        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMTeachCourseDetailDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }
    }
}
