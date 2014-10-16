using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_TeachCheckDetails")]
	[Description("授课考勤记录")]
	public class TMTeachCheckDetailsModel
	{
		/// <summary>
		/// 序号
		/// </summary>
		[Description("序号")]
		public int KeyId { get; set; }
      
		/// <summary>
		/// 学生ID
		/// </summary>
		[Description("学生ID")]
		public int StudentID { get; set; }
      
		/// <summary>
		/// 授课日志ID
		/// </summary>
		[Description("授课日志ID")]
		public int TeachCheckID { get; set; }
      
		/// <summary>
		/// 授课信息
		/// </summary>
		[Description("授课信息")]
		public string CourseInfo { get; set; }
      
		/// <summary>
		/// 迟到
		/// </summary>
		[Description("迟到")]
		public string CheckCD { get; set; }
      
		/// <summary>
		/// 早退
		/// </summary>
		[Description("早退")]
		public string CheckZT { get; set; }
      
		/// <summary>
		/// 旷课
		/// </summary>
		[Description("旷课")]
		public string CheckKK { get; set; }
      
		/// <summary>
		/// 病假
		/// </summary>
		[Description("病假")]
		public string CheckBJ { get; set; }
      
		/// <summary>
		/// 事假
		/// </summary>
		[Description("事假")]
		public string CheckSJ { get; set; }
      
		/// <summary>
		/// 课堂表现
		/// </summary>
		[Description("课堂表现")]
		public string CheckBX { get; set; }
      
		/// <summary>
		/// 考勤时间
		/// </summary>
		[Description("考勤时间")]
		public DateTime CheckTime { get; set; }
      
		/// <summary>
		/// 学期ID
		/// </summary>
		[Description("学期ID")]
		public int TermID { get; set; }
      
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