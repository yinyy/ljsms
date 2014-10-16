using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_Term")]
	[Description("学期表")]
	public class TMTermModel
	{
		/// <summary>
		/// 学期ID
		/// </summary>
		[Description("学期ID")]
		public int KeyId { get; set; }
      
		/// <summary>
		/// 学期描述
		/// </summary>
		[Description("学期描述")]
		public string TermDescription { get; set; }
      
		/// <summary>
		/// 开始日期
		/// </summary>
		[Description("开始日期")]
		public DateTime TermStart { get; set; }
      
		/// <summary>
		/// 结束日期
		/// </summary>
		[Description("结束日期")]
		public DateTime TermEnd { get; set; }
      
		/// <summary>
		/// 学期状态
		/// </summary>
		[Description("学期状态")]
		public string Status { get; set; }
      
		/// <summary>
		/// 备注信息
		/// </summary>
		[Description("备注信息")]
		public string Remark { get; set; }
      
				
		public override string ToString()
		{
			return JSONhelper.ToJson(this);
		}
	}
}