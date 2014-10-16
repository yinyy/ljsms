using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TM.Dal;
using TM.Model;
using DB.Common.Provider;
using DB.Common.Data;
using DB.Common.Data.Filter;
using DB.BPM.Core;
namespace TM.Bll
{
    public class TMTeachCourseBll
    {
        public static TMTeachCourseBll Instance
        {
            get { return SingletonProvider<TMTeachCourseBll>.Instance; }
        }

        public int Add(TMTeachCourseModel model)
        {  
            
            int rkdid = TMTeachCourseDal.Instance.Insert(model); ;
            if (rkdid > 0)
            {
                //添加明细 

                //循环添加明细

                if (model.details.Count > 0)
                {
                    foreach (var mx in model.details)
                    {
                        mx.TeachCourseID = rkdid;
                        TM.Bll.TMTeachCourseDetailBll.Instance.Add(mx);
                    }
                }

            }

            return rkdid;
        }

        public int Update(TMTeachCourseModel model)
        {
            int rkdid = model.KeyId;

            TM.Bll.TMTeachCourseDetailBll.Instance.deleteAll(rkdid);

            if (model.details.Count > 0)
            {
                foreach (var mx in model.details)
                {
                    mx.TeachCourseID= rkdid;
                    TM.Bll.TMTeachCourseDetailBll.Instance.Add(mx);
                }
            }


            
            return TMTeachCourseDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMTeachCourseDal.Instance.Delete(keyid);
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMTeachCourseDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }
        public string GetJsonByTeacherID(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {//下一步改成授课ID或者代课ID等于即可
            var str = new SqlFilter(GroupOp.AND.ToString(), new FilterRule("TeacherID",SysVisitor.Instance.UserId , "eq"));
            return TMTeachCourseDal.Instance.GetJson(pageindex, pagesize, str.ToString(), sort, order);
        }
        public string GetJsonByTID(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMTeachCourseDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }
        public string GetCourseByTeacher(int pageindex, int pagesize, string filterJson, string sort = "TeacherID", string order = "asc")//获取教师本人课程表信息
        {
            
            return TMTeachCourseDal.Instance.GetCourseByTeacher(pageindex, pagesize, filterJson, sort, order);
 
        }
    }
}
