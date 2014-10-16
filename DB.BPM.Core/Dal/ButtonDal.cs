﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using DB.Common;
using DB.Common.Provider;
using DB.Common.Data;
using DB.Common.Data.Filter;
using DB.BPM.Core.Model;
namespace DB.BPM.Core.Dal
{
    public class ButtonDal : BaseRepository<Button>
    {
        
        public static ButtonDal Instance
        {
            get { return SingletonProvider<ButtonDal>.Instance; }
        }

        public string JsonDataForEasyUIdataGrid(int pageindex, int pagesize,string filterJson,string sort="keyid",string order="asc")
        {
            string sortorder = sort + " " + order;

            var pcp = new ProcCustomPage("sys_buttons")
                          {
                              PageIndex = pageindex,
                              PageSize = pagesize,
                              OrderFields = sortorder,
                              WhereString = FilterTranslator.ToSql(filterJson)
                          };
            int recordCount ;
            DataTable dt = base.GetPageWithSp(pcp,out recordCount);
            return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);

        }

        /// <summary>
        /// 获取菜单中的按钮列表
        /// </summary>
        /// <param name="navid">菜单ID</param>
        /// <returns></returns>
        public  IEnumerable<Button> GetButtonsBy(int navid)
        {
            const string sql = "select b.*,n.sortnum sn from Sys_NavButtons n join sys_buttons b on n.buttonid=b.keyid where n.navid=@NavId order by n.Sortnum";
            return GetList(sql, new {NavId = navid});
        }

        
    }
}
