using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DB.BPM.Core.Model;
using DB.Common.Data;
using DB.Common.Provider;

namespace DB.BPM.Core.Dal
{
    public class DicCategoryDal : BaseRepository<DicCategory>
    {
        public static DicCategoryDal Instance
        {
            get { return SingletonProvider<DicCategoryDal>.Instance; }
        }

        
    }

}
