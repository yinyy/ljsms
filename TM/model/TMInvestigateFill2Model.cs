using DB.Common.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TM.model
{
    [TableName("TM_InvestigateFill2")]
    public class TMInvestigateFill2Model
    {
        public int KeyId { get; set; }
        public DateTime Filled { get; set; }
        public int InvestigateId { get; set; }
        public int TeachCourseId { get; set; }
        public int StudentId { get; set; }
        public string Col1 { get; set; }
        public string Col2 { get; set; }
    }
}
