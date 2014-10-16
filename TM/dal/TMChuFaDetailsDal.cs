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
using DB.Common.Data.SqlServer;
using System.Data.SqlClient;
namespace TM.Dal
{
    public class TMChuFaDetailsDal : BaseRepository<TMChuFaDetailsModel>
    {
        public static TMChuFaDetailsDal Instance
        {
            get { return SingletonProvider<TMChuFaDetailsDal>.Instance; }
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "keyid", string order = "asc")
        {
            var pcp = new ProcCustomPage("V_TM_ChuFaDetailsInfo")
            {
                PageIndex = pageindex,
                PageSize = pagesize,
                OrderFields = "WeiJiDate desc,WeiJiClass asc,WeiJiStudent asc",
                WhereString = FilterTranslator.ToSql(filterJson)

            };
            int recordCount;

            DataTable dt = base.GetPageWithSp(pcp, out recordCount);
            return JSONhelper.FormatJSONForEasyuiDataGrid(recordCount, dt);
        }
        
   
    public string datesumgetByTeacherID(int uid)
        {            
            int recordCount;
            string s = "SELECT   WeiJiDate as WeiJi, ChuFaRen, SUM(ChuFaScore) AS Score FROM   dbo.V_TM_ChuFaDetailsInfo  where ChuFaRen=@cfid GROUP BY WeiJiDate,ChuFaRen order by WeiJiDate desc ";
            DataTable dt = SqlEasy.ExecuteDataTable(s, new SqlParameter("@cfid",uid));
            recordCount = dt.Rows.Count;            
            return JSONhelper.ToJson(dt);
        }
    public string classsumgetByTeacherID(int uid)
    {
        int recordCount;
        string s = "SELECT   WeiJiClass,ClassName as WeiJi, ChuFaRen, SUM(ChuFaScore) AS Score FROM   dbo.V_TM_ChuFaDetailsInfo  where ChuFaRen=@cfid GROUP BY WeiJiClass,ClassName,ChuFaRen order by ClassName desc ";
        DataTable dt = SqlEasy.ExecuteDataTable(s, new SqlParameter("@cfid", uid));
        recordCount = dt.Rows.Count;
        return JSONhelper.ToJson(dt);
    }
    public string datesumgetByClassLeaderID(int uid)
    {
        int recordCount;
        string s = "SELECT   WeiJiClass,ClassName , WeiJiDate as WeiJi,ClassLeaderID, SUM(ChuFaScore) AS Score FROM   dbo.V_TM_ChuFaDetailsInfo  where ClassLeaderID=@cfid GROUP BY WeiJiClass,ClassName,WeiJiDate,ClassLeaderID order by ClassName desc, WeiJiDate desc ";
        DataTable dt = SqlEasy.ExecuteDataTable(s, new SqlParameter("@cfid", uid));
        recordCount = dt.Rows.Count;
        return JSONhelper.ToJson(dt);
    }
    public string studentsumgetByClassLeaderID(int uid)
    {
        int recordCount;
        string s = "SELECT   WeiJiClass,ClassName , StudentName as WeiJi,ClassLeaderID, SUM(ChuFaScore) AS Score FROM   dbo.V_TM_ChuFaDetailsInfo  where ClassLeaderID=@cfid GROUP BY WeiJiClass,ClassName,StudentName,ClassLeaderID order by ClassName desc, StudentName desc ";
        DataTable dt = SqlEasy.ExecuteDataTable(s, new SqlParameter("@cfid", uid));
        recordCount = dt.Rows.Count;
        return JSONhelper.ToJson(dt);
    }
    public string weeksumgetByClassLeaderID(int uid)
    {
        int recordCount;
        string s = "SELECT   WeiJiClass,ClassName , Weeks as WeiJi,ClassLeaderID, SUM(ChuFaScore) AS Score FROM   dbo.V_TM_ChuFaDetailsInfo  where ClassLeaderID=@cfid GROUP BY WeiJiClass,ClassName,Weeks,ClassLeaderID order by ClassName desc, Weeks desc ";
        DataTable dt = SqlEasy.ExecuteDataTable(s, new SqlParameter("@cfid", uid));
        recordCount = dt.Rows.Count;
        return JSONhelper.ToJson(dt);
    }
    public int shenhe(int uid,int keyid)
    {
        string s = "update dbo.TM_ChuFaDetails set ShenHeYiJian='审批通过', ShenHeDate=getdate(), ShenHeRen=@shid where KeyId=@kid";
        int r = SqlEasy.ExecuteNonQuery(s, new SqlParameter("@shid", uid),new SqlParameter("@kid", keyid));
        return r;
    }
    public int shenheall(int uid)
    {
        string s = "update dbo.TM_ChuFaDetails set ShenHeYiJian='审批通过', ShenHeDate=getdate(), ShenHeRen=@shid where ShenHeYiJian='未审批'";
        int r = SqlEasy.ExecuteNonQuery(s, new SqlParameter("@shid", uid));
        return r;
    }
    public int quxiaoshenhe(int uid, int keyid)
    {
        string s = "update dbo.TM_ChuFaDetails set ShenHeYiJian='未审批', ShenHeDate=getdate(), ShenHeRen=@shid where KeyId=@kid";
        int r = SqlEasy.ExecuteNonQuery(s, new SqlParameter("@shid", uid), new SqlParameter("@kid", keyid));
        return r;
    }
    public string datechufasum(DateTime startday, DateTime endday)//按指定闭区间日期范围统计
    {
        int recordCount;
        string s = "SELECT   WeiJiDate as WeiJi, SUM(ChuFaScore) AS Score FROM   dbo.V_TM_ChuFaDetailsInfo  where WeiJiDate>=@sday and WeiJiDate<=@eday GROUP BY WeiJiDate order by WeiJiDate desc ";
        DataTable dt = SqlEasy.ExecuteDataTable(s, new SqlParameter("@sday", startday), new SqlParameter("@eday", endday));
        recordCount = dt.Rows.Count;
        return JSONhelper.ToJson(dt);
       
    }
    public string personchufasum(DateTime startday, DateTime endday)//按指定闭区间日期范围统计
    {
        int recordCount;
        string s = "SELECT   ChuFaren,ChuFaRenName as WeiJi, SUM(ChuFaScore) AS Score FROM   dbo.V_TM_ChuFaDetailsInfo  where WeiJiDate>=@sday and WeiJiDate<=@eday GROUP BY ChuFaren,ChuFaRenName order by  ChuFaren asc ";
        DataTable dt = SqlEasy.ExecuteDataTable(s, new SqlParameter("@sday", startday), new SqlParameter("@eday", endday));
        recordCount = dt.Rows.Count;
        return JSONhelper.ToJson(dt);
    }
    public string classchufasum(DateTime startday, DateTime endday)//按指定闭区间日期范围统计
    {
        int recordCount;
        string s = "SELECT   WeiJiClass,ClassName as WeiJi, SUM(ChuFaScore) AS Score FROM   dbo.V_TM_ChuFaDetailsInfo  where WeiJiDate>=@sday and WeiJiDate<=@eday GROUP BY WeiJiClass,ClassName order by WeiJiClass asc ";
        DataTable dt = SqlEasy.ExecuteDataTable(s, new SqlParameter("@sday", startday), new SqlParameter("@eday", endday));
        recordCount = dt.Rows.Count;
        return JSONhelper.ToJson(dt);
    }
//扣分类别统计
    }
}
