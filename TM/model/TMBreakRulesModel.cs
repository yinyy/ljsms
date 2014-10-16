using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_BreakRules")]
	[Description("违纪种类表")]
	public class TMBreakRulesModel
	{
		/// <summary>
		/// 序号
		/// </summary>
		[Description("序号")]
		public int KeyId { get; set; }
      
		/// <summary>
		/// 违纪类别
		/// </summary>
		[Description("违纪类别")]
        public int RuleType { get; set; }
      
		/// <summary>
		/// 违纪名称
		/// </summary>
		[Description("违纪名称")]
		public string RuleName { get; set; }
      
		/// <summary>
		/// 违纪扣分
		/// </summary>
		[Description("违纪扣分")]
		public int RuleScore { get; set; }
      
		/// <summary>
		/// 违纪级别
		/// </summary>
		[Description("违纪级别")]
		public string RuleGrade { get; set; }
      
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