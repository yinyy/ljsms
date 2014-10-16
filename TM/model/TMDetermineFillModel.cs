using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_DetermineFill")]
	[Description("测评填写表")]
	public class TMDetermineFillModel
	{
		/// <summary>
		/// 主键
		/// </summary>
		[Description("主键")]
		public int KeyId { get; set; }
      
		/// <summary>
		/// 测评ID
		/// </summary>
		[Description("测评ID")]
		public int DetermineId { get; set; }
      
		/// <summary>
		/// 专家ID
		/// </summary>
		[Description("专家ID")]
		public int ExpertId { get; set; }
      
		/// <summary>
		/// 测评教师ID
		/// </summary>
		[Description("测评教师ID")]
		public int TeacherId { get; set; }
      
		/// <summary>
		/// 列索引
		/// </summary>
		[Description("列索引")]
		public int Col { get; set; }
      
		/// <summary>
		/// 分数
		/// </summary>
		[Description("分数")]
		public int Score { get; set; }
      
		/// <summary>
		/// 类型
		/// </summary>
		[Description("类型")]
		public int Kind { get; set; }
      
				
		public override string ToString()
		{
			return JSONhelper.ToJson(this);
		}
	}
}