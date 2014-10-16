using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_WarningRecords")]
	[Description("违纪预警记录表")]
	public class TMWarningRecordsModel
	{
		/// <summary>
		/// 序号
		/// </summary>
		[Description("序号")]
		public int KeyId { get; set; }
      
		/// <summary>
		/// 学期ID
		/// </summary>
		[Description("学期ID")]
		public int TermID { get; set; }
      
		/// <summary>
		/// 学生ID
		/// </summary>
		[Description("学生ID")]
		public int StudentID { get; set; }
      
		/// <summary>
		/// 预警项目ID
		/// </summary>
		[Description("预警项目ID")]
		public int WarningItemID { get; set; }
      
		/// <summary>
		/// 违纪次数
		/// </summary>
		[Description("违纪次数")]
		public int WarningCount { get; set; }
      
		/// <summary>
		/// 处理记录
		/// </summary>
		[Description("处理记录")]
		public string WarningProcess { get; set; }
      
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