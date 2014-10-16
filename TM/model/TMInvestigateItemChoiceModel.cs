using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_InvestigateItemChoice")]
	[Description("调查问卷选项表")]
	public class TMInvestigateItemChoiceModel
	{
		/// <summary>
		/// 主键
		/// </summary>
		[Description("主键")]
		public int KeyId { get; set; }
      
		/// <summary>
		/// 问卷题目编号
		/// </summary>
		[Description("问卷题目编号")]
		public int InvestigateItemId { get; set; }
      
		/// <summary>
		/// 内容
		/// </summary>
		[Description("内容")]
		public string Title { get; set; }
      
		/// <summary>
		/// 分值
		/// </summary>
		[Description("分值")]
		public decimal Score { get; set; }
      
		/// <summary>
		/// 是否显示文本框
		/// </summary>
		[Description("是否显示文本框")]
		public int HasOther { get; set; }

        [Description("排序")]
        public int SortNumber { get; set; }
				
		public override string ToString()
		{
			return JSONhelper.ToJson(this);
		}
	}
}