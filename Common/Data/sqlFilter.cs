using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DB.Common.Data.Filter;

namespace DB.Common.Data
{
    public class SqlFilter
    {
        public string groupOp { get; set; }
        public IList<FilterRule> rules { get; set; }

        public SqlFilter(string _group, FilterRule rule)
        {
            this.groupOp = _group;
            this.rules = new List<FilterRule>();
            rules.Add(rule);
        }


        public override string ToString()
        {
            return JSONhelper.ToJson(this);
        }
    }
}
