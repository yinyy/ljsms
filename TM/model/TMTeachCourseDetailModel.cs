using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_TeachCourseDetail")]
	[Description("教师授课节次表")]
	public class TMTeachCourseDetailModel
	{
		/// <summary>
		/// 序号
		/// </summary>
		[Description("序号")]
		public int KeyId { get; set; }
      
		/// <summary>
		/// 教师授课ID
		/// </summary>
		[Description("教师授课ID")]
		public int TeachCourseID { get; set; }
      
		/// <summary>
		/// 授课地点ID
		/// </summary>
		[Description("授课地点ID")]
		public int CourseRoomID { get; set; }
      
		/// <summary>
		/// 授课星期
		/// </summary>
		[Description("授课星期")]
		public string CourseDay { get; set; }
      
		/// <summary>
		/// 授课节次
		/// </summary>
		[Description("授课节次")]
		public string CourseTime { get; set; }
      
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