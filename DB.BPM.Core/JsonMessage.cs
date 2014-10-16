using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DB.BPM.Core
{
    public class JsonMessage
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string Data { get; set; }

        public override string ToString()
        {
            return DB.Common.JSONhelper.ToJson(this);
        }
    }
}
