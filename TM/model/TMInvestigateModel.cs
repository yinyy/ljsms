using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_Investigate")]
	[Description("调查问卷表")]
	public class TMInvestigateModel
	{
		/// <summary>
		/// 主键
		/// </summary>
		[Description("主键")]
		public int KeyId { get; set; }
      
		/// <summary>
		/// 学期编号
		/// </summary>
		[Description("学期编号")]
		public int TermId { get; set; }
      
		/// <summary>
		/// 创建者
		/// </summary>
		[Description("创建者")]
		public int CreatorId { get; set; }
      
		/// <summary>
		/// 创建时间
		/// </summary>
		[Description("创建时间")]
		public DateTime Created { get; set; }
      
		/// <summary>
		/// 开始调查时间
		/// </summary>
		[Description("开始调查时间")]
		public DateTime Started { get; set; }
      
		/// <summary>
		/// 结束调查时间
		/// </summary>
		[Description("结束调查时间")]
		public DateTime Ended { get; set; }
      
		/// <summary>
		/// 标题
		/// </summary>
		[Description("标题")]
		public string Title { get; set; }

        [Description("当前的状态")]
        public int Status { get; set; }

        public int Kind { get; set; }
				
		public override string ToString()
		{
			return JSONhelper.ToJson(this);
		}
	}
}