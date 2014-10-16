using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_VClassStudents")]
	[Description("虚拟学生明细表")]
	public class TMVClassStudentsModel
	{
		/// <summary>
		/// 序号号
		/// </summary>
		[Description("序号号")]
		public int KeyId { get; set; }
      
		/// <summary>
		/// 虚班ID
		/// </summary>
		[Description("虚班ID")]
		public int VClassID { get; set; }
      
		/// <summary>
		/// 学生ID
		/// </summary>
		[Description("学生ID")]
		public int StudentID { get; set; }
      
		/// <summary>
		/// 学生状态
		/// </summary>
		[Description("学生状态")]
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