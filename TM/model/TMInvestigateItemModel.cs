using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_InvestigateItem")]
	[Description("问卷题目表")]
	public class TMInvestigateItemModel
	{
		/// <summary>
		/// 主键
		/// </summary>
		[Description("主键")]
		public int KeyId { get; set; }
      
		/// <summary>
		/// 问卷表主键
		/// </summary>
		[Description("问卷表主键")]
		public int InvestigateId { get; set; }
      
		/// <summary>
		/// 题目内容
		/// </summary>
		[Description("题目内容")]
		public string Title { get; set; }
      
		/// <summary>
		/// 类型
		/// </summary>
		[Description("类型")]
		public int Kind { get; set; }
      
		/// <summary>
		/// 列集合
		/// </summary>
		[Description("列集合")]
		public string Columns { get; set; }
      
		/// <summary>
		/// 排序
		/// </summary>
		[Description("排序")]
		public int SortNumber { get; set; }
      
				
		public override string ToString()
		{
			return JSONhelper.ToJson(this);
		}
	}
}