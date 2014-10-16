using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_Determine")]
	[Description("测评表")]
	public class TMDetermineModel
	{
		/// <summary>
		/// 主键
		/// </summary>
		[Description("主键")]
		public int KeyId { get; set; }
      
		/// <summary>
		/// 创建者ID
		/// </summary>
		[Description("创建者ID")]
		public int CreatorId { get; set; }
      
		/// <summary>
		/// 创建时间
		/// </summary>
		[Description("创建时间")]
		public DateTime Created { get; set; }
      
		/// <summary>
		/// 学期编号
		/// </summary>
		[Description("学期编号")]
		public int TermId { get; set; }
      
		/// <summary>
		/// 标题
		/// </summary>
		[Description("标题")]
		public string Title { get; set; }
      
		/// <summary>
		/// 状态
		/// </summary>
		[Description("状态")]
		public int Status { get; set; }
      
		/// <summary>
		/// 基础项目
		/// </summary>
		[Description("基础项目")]
		public string BasicCols { get; set; }
      
		/// <summary>
		/// 测评项目
		/// </summary>
		[Description("测评项目")]
		public string DetermineCols { get; set; }
      
				
		public override string ToString()
		{
			return JSONhelper.ToJson(this);
		}
	}
}