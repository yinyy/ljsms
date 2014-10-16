using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using DB.Common.Data;
using DB.Common.Provider;

using TM.Model;
using System.Data;
using DB.Common;

namespace TM.Dal
{
    public class TMDetermineDal : BaseRepository<TMDetermineModel>
    {
        public static TMDetermineDal Instance
        {
            get { return SingletonProvider<TMDetermineDal>.Instance; }
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "keyid",
                              string order = "asc")
        {
            return base.JsonDataForEasyUIdataGrid("V_TM_Determine", pageindex, pagesize, filterJson,
                                                  sort, order);
            //return base.JsonDataForEasyUIdataGrid(TableConvention.Resolve(typeof(TMDetermineModel)), pageindex, pagesize, filterJson,
            //                                      sort, order);
        }

        internal DataTable Export(int determineId)
        {
            TMDetermineModel dm = Get(determineId);
            string basicCols = dm.BasicCols;
            string[] bcs = basicCols.Split(',');

            string determineCols = dm.DetermineCols;
            string[] dcs = determineCols.Split(',');

            DataTable table = new DataTable("DetermineFill");
            table.Columns.Add("姓名");
            table.Columns.Add("授课地点");
            table.Columns.Add("课题");
            foreach (string c in bcs)
            {
                table.Columns.Add(c);
            }
            foreach (string c in dcs)
            {
                table.Columns.Add(c);
            }
            table.Columns.Add("总分");

            List<TMDetermineFillModel> models = TMDetermineFillDal.Instance.GetWhere(new { DetermineId = determineId }).ToList();
            
            ProcCustomPage pcp = new ProcCustomPage
            {
                TableName = "V_TM_DetermineTeachers",
                PageSize = 9999999,
                PageIndex = 1,
                OrderFields = "Teacher_Name asc",
                WhereString = string.Format("DetermineId={0}", determineId)
            };
            int count = 0;

            foreach (DataRow dr in DbUtils.GetPageWithSp(pcp, out count).Rows)
            {
                int teacherId = Convert.ToInt32(dr["TeacherId"]);
                float score = 0;
                
                DataRow nr = table.Rows.Add(new object[]{dr["Teacher_Name"], dr["Address"], dr["Course"]});
                
                for(int i=0;i<bcs.Length;i++)
                {
                    nr[bcs[i]] = models.Where(m => m.TeacherId == teacherId && m.Kind == 1 && m.Col == i).Select(m => m.Score).FirstOrDefault();
                    score +=Convert.ToSingle( nr[bcs[i]]);
                }
                for (int i = 0; i < dcs.Length; i++)
                {
                    nr[dcs[i]] = models.Where(m => m.TeacherId == teacherId && m.Kind == 2 && m.Col == i).Average(m=>m.Score);
                    score += Convert.ToSingle(nr[dcs[i]]);
                }

                nr["总分"] = score;
            }

            return table;
        }
    }
}