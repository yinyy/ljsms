using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_VirtualClass")]
	[Description("虚拟班信息表")]
	public class TMVirtualClassModel
	{
		/// <summary>
		/// 虚班Id
		/// </summary>
		[Description("虚班Id")]
		public int KeyId { get; set; }
      
		/// <summary>
		/// 虚拟班描述
		/// </summary>
		[Description("虚拟班描述")]
		public string VClassDescription { get; set; }
      
		/// <summary>
		/// 学期ID
		/// </summary>
		[Description("学期ID")]
		public int TermID { get; set; }
      
		/// <summary>
		/// 虚班状态
		/// </summary>
		[Description("虚班状态")]
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