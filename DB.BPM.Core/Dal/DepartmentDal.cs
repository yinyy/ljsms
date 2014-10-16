using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DB.Common.Data;
using DB.BPM.Core.Model;
using DB.Common.Provider;
namespace DB.BPM.Core.Dal
{
    public class DepartmentDal:BaseRepository<Department>
    {
        public static DepartmentDal Instance
        {
            get { return SingletonProvider<DepartmentDal>.Instance; }
        }

        public IEnumerable<Department> GetChildren(int parentid=0)
        {
            return GetAll().Where(d => d.ParentId == parentid);
        }
    }
}
