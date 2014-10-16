using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TM.Dal;
using TM.Model;
using DB.Common.Provider;
using DB.Common.Data;
using System.Data;
using DB.Common;

namespace TM.Bll
{
    public class TMDetermineTeachersBll
    {
        public static TMDetermineTeachersBll Instance
        {
            get { return SingletonProvider<TMDetermineTeachersBll>.Instance; }
        }

        public int Add(TMDetermineTeachersModel model)
        {
            return TMDetermineTeachersDal.Instance.Insert(model);
        }

        public int Update(TMDetermineTeachersModel model)
        {
            return TMDetermineTeachersDal.Instance.Update(model);
        }

        public int Delete(int keyid)
        {
            return TMDetermineTeachersDal.Instance.Delete(keyid);
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMDetermineTeachersDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }

        public int Save(int determineId, List<TMDetermineTeachersModel> dtms)
        {
            return TMDetermineTeachersDal.Instance.Save(determineId, dtms);
        }

        public string PreviewJson(int determineId)
        {
            ProcCustomPage pcp = new ProcCustomPage
            {
                TableName = "V_TM_DetermineTeachers",
                PageSize = 99999,
                PageIndex = 1,
                OrderFields = "SortNumber",
                WhereString = " DetermineId = " + determineId
            };

            int count = 0;
            DataTable table = TMDetermineTeachersDal.Instance.GetPageWithSp(pcp, out count);
            return JSONhelper.ToJson(table.AsEnumerable().Select(r => new
            {
                TeacherId = r["TeacherId"],
                Address = r["Address"],
                Course = r["Course"],
                Teacher_Title = r["Teacher_Title"],
                Teacher_Name=r["Teacher_Name"]
            }));
        }
    }
}
