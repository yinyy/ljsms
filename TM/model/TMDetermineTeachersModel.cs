using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_DetermineTeachers")]
	[Description("测评教师")]
	public class TMDetermineTeachersModel
	{
		/// <summary>
		/// 主键
		/// </summary>
		[Description("主键")]
		public int KeyId { get; set; }
      
		/// <summary>
		/// 测评表ID
		/// </summary>
		[Description("测评表ID")]
		public int DetermineId { get; set; }
      
		/// <summary>
		/// 测评时间
		/// </summary>
		[Description("测评时间")]
		public DateTime Time { get; set; }
      
		/// <summary>
		/// 教师ID
		/// </summary>
		[Description("教师ID")]
		public int TeacherId { get; set; }
      
		/// <summary>
		/// 授课地点
		/// </summary>
		[Description("授课地点")]
		public string Address { get; set; }
      
		/// <summary>
		/// 课题
		/// </summary>
		[Description("课题")]
		public string Course { get; set; }
      
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