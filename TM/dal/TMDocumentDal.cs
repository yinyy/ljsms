using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DB.Common.Data;
using DB.Common.Provider;
using TM.Model;
using DB.Common.Data.Filter;
using System.Data;
using DB.Common;

namespace TM.Dal
{
 public   class TMDocumentDal: BaseRepository<TMDocumentModel>
    {
     public static TMDocumentDal Instance
        {
            get { return SingletonProvider<TMDocumentDal>.Instance; }
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "keyid",
                              string order = "asc")
        {
            var pcp = new ProcCustomPage()
            {
                OrderFields = sort+" "+order,
                PageIndex=pageindex,
                PageSize = pagesize,
                WhereString = FilterTranslator.ToSql(filterJson),
                TableName="V_TM_DocumentDetail"
            };

            int count = 0;

            DataTable table = base.GetPageWithSp(pcp, out count);
            return JSONhelper.FormatJSONForEasyuiDataGrid(count, table);

            //return base.JsonDataForEasyUIdataGrid(TableConvention.Resolve(typeof(TMDocumentModel)), pageindex, pagesize, filterJson,
            //                                      sort, order);
        }
    }
}
