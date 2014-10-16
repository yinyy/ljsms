using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using DB.Common.Data;
using DB.Common.Provider;
using DB.Common;
using DB.BPM.Core;
using TM.Model;
using DB.Common.Data.Filter;
namespace TM.Dal
{
    public class TMBreakRulesDal : BaseRepository<TMBreakRulesModel>
    {
        public static TMBreakRulesDal Instance
        {
            get { return SingletonProvider<TMBreakRulesDal>.Instance; }
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "keyid",
                              string order = "asc")
        {
            var pcp = new ProcCustomPage("V_TM_RuleTypeInfo")
            {
                PageIndex = pageindex,
                PageSize = pagesize,
                OrderFields = "RuleType asc,RuleGrade asc,RuleName asc",
                WhereString = FilterTranslator.ToSql(filterJson)

            };
            int recordCount;

            DataTable dt = base.GetPageWithSp(pcp, out recordCount);
            return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);

            


        }
    }
}