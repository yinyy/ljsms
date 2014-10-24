using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_Document")]
	[Description("用户文档表")]
	public class TMDocumentModel
	{
        public int KeyId { get; set; }
        public int TeacherId { get; set; }
        public DateTime Created { get; set; }
        public string Filename { get; set; }
        public string ExtName { get; set; }
        public int Size { get; set; }
        public string FileUrl { get; set; }
        public string Tag { get; set; }
				
		public override string ToString()
		{
			return JSONhelper.ToJson(this);
		}
	}
}