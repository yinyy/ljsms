using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using DB.Common.Data;
using DB.Common.Provider;
using DB.Common;
using DB.BPM.Core;
using Newtonsoft.Json.Linq;
using TM.Model;
using DB.Common.Data.Filter;
namespace TM.Dal
{
    public class TMStudentLeaveDal : BaseRepository<TMStudentLeaveModel>
    {
        public static TMStudentLeaveDal Instance
        {
            get { return SingletonProvider<TMStudentLeaveDal>.Instance; }
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "keyid",
                              string order = "asc")
        {

            var pcp = new ProcCustomPage("V_TM_StudentLeaveInfo")
            {
                PageIndex = pageindex,
                PageSize = pagesize,
                OrderFields = "ClassID asc,StudentID asc,LeaveStart desc",
                WhereString = FilterTranslator.ToSql(filterJson)

            };
            int recordCount;

            DataTable dt = base.GetPageWithSp(pcp, out recordCount);
            return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);



          // return base.JsonDataForEasyUIdataGrid(TableConvention.Resolve(typeof(TMStudentLeaveModel)), pageindex, pagesize, filterJson,
                                             //  sort, order);
        }
    }
}