using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DB.BPM.Core.Model;
using DB.Common.Data;
using DB.Common.Provider;

namespace DB.BPM.Core.Dal
{
    public class LogDetailDal:BaseRepository<LogDetailModel>
    {
        public static LogDetailDal Instance
        {
            get { return SingletonProvider<LogDetailDal>.Instance; }
        }

        public IEnumerable<LogDetailModel> GetBy(int logId)
        {
            return DbUtils.GetWhere<LogDetailModel>(new {LogId = logId});
        }

        public int DeleteBy(string logIds)
        {
            string s = "delete sys_logdetails where logid in (" + logIds + ")";
            return DbUtils.ExecuteNonQuery(s, null);
        }
    }
}
