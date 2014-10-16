using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_InvestigateFill")]
	[Description("调查问卷填写表")]
	public class TMInvestigateFillModel
	{
		/// <summary>
		/// 主键
		/// </summary>
		[Description("主键")]
		public int KeyId { get; set; }
      
		/// <summary>
		/// 学生编号
		/// </summary>
		[Description("学生编号")]
		public int StudentId { get; set; }
      
		/// <summary>
		/// 授课表主键
		/// </summary>
		[Description("授课表主键")]
		public int TeachCourseId { get; set; }
      
		/// <summary>
		/// 问卷主键
		/// </summary>
		[Description("问卷主键")]
		public int InvestigateId { get; set; }
      
		/// <summary>
		/// 题目主键
		/// </summary>
		[Description("题目主键")]
		public int InvestigateItemId { get; set; }
      
		/// <summary>
		/// 选项主键
		/// </summary>
		[Description("选项主键")]
		public int InvestigateItemChoiceId { get; set; }
      
		/// <summary>
		/// 矩阵选择题列标示
		/// </summary>
		[Description("矩阵选择题列标示")]
		public int InvestigateItemChoiceColumnIndex { get; set; }
      
		/// <summary>
		/// 其它内容
		/// </summary>
		[Description("其它内容")]
		public string Other { get; set; }
      
				
		public override string ToString()
		{
			return JSONhelper.ToJson(this);
		}
	}
}