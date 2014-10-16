using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TM.Dal;
using TM.Model;
using DB.Common.Provider;
using DB.BPM.Core;

namespace TM.Bll
{
    public class TMTeachCheckBll
    {
        public static TMTeachCheckBll Instance
        {
            get { return SingletonProvider<TMTeachCheckBll>.Instance; }
        }

        public int Add(TMTeachCheckModel model) 
        {
            int rkdid = TMTeachCheckDal.Instance.Insert(model); ;
            if (rkdid > 0)
            {
                //�����ϸ 

                //ѭ�������ϸ

                if (model.details.Count > 0)
                {
                    foreach (var mx in model.details)
                    {

                        mx.TeachCheckID = rkdid;
                        mx.CheckCD = mx.CheckCD == null ? "0" : mx.CheckCD;
                        mx.CheckZT = mx.CheckZT == null ? "0" : mx.CheckZT;
                        mx.CheckKK = mx.CheckKK == null ? "0" : mx.CheckKK;
                        mx.CheckBJ = mx.CheckBJ == null ? "0" : mx.CheckBJ;
                        mx.CheckSJ = mx.CheckSJ == null ? "0" : mx.CheckSJ;
                        mx.CheckBX = mx.CheckBX == null ? "0" : mx.CheckBX;
                        TM.Bll.TMTeachCheckDetailsBll.Instance.Add(mx);
                    }
                }

            }
            return rkdid;

            
        }

        public int Update(TMTeachCheckModel model)
        {
            int rkdid = model.KeyId;

            TM.Bll.TMTeachCheckDetailsBll.Instance.deleteAll(rkdid);

            if (model.details.Count > 0)
            {
                foreach (var mx in model.details)
                {
                    mx.TeachCheckID = rkdid;
                    TM.Bll.TMTeachCheckDetailsBll.Instance.Add(mx);
                }
            }



            return TMTeachCheckDal.Instance.Update(model);





           
        }

        public int Delete(int keyid)
        {
            return TMTeachCheckDal.Instance.Delete(keyid);
        }
        //ctid�ǿγ̽�ʦID�����ν�ʦѡ��ʱ�ǿγ�ԭ����ʦ��ID������ʱ�Ǳ��˵�ID
        public string GetInitJson( string courseday, string coursetime,int ws,int ctid)//�ݽ���BINDADD����
        {
           return TMTeachCheckDal.Instance.GetInitJson(ctid, courseday, coursetime,ws);
        }
        public string GetInitCourses()
        {
            return TMTeachCheckDal.Instance.GetInitCoursesByTeacherID(SysVisitor.Instance.UserId);
        }

        public string GetInitVClasses()
        {
            return TMTeachCheckDal.Instance.GetInitVclassesByTeacherID(SysVisitor.Instance.UserId);
        }
        public string GetJson(string str,int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMTeachCheckDal.Instance.GetJson(str,pageindex, pagesize, filterJson, sort, order);
        }
        public string GetTCStudentDetailInfo(string str, int pageindex, int pagesize, string filterJson, string sort = "TeachDate", string order = "asc")
        {
            return TMTeachCheckDal.Instance.GetTCStudentDetailInfo(str, pageindex, pagesize, filterJson, sort, order);
 
        }
        public string GetTCSumByCourse(string str, int pageindex, int pagesize, string filterJson, string sort = "CourseID", string order = "asc")
        {
            return TMTeachCheckDal.Instance.GetTCSumByCourse(str, pageindex, pagesize, filterJson, sort, order);
 
        }
        public string GetTCSumByStudent(string str, int pageindex, int pagesize, string filterJson, string sort = "ClassID", string order = "asc")
        {
            return TMTeachCheckDal.Instance.GetTCSumByStudent(str, pageindex, pagesize, filterJson, sort, order);

        }
        //�������н�ѧ��־�Ϳγ���ϸ��Ϣ����ѯ����������str
        public string GetTCCourseInfo(string str, int pageindex, int pagesize, string filterJson, string sort = "TeachDate", string order = "asc")
        {
            return TMTeachCheckDal.Instance.GetTCCourseDetailInfo(str, pageindex, pagesize, filterJson, sort, order);

        }
    }
}
