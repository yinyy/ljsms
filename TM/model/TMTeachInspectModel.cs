using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_TeachInspect")]
	[Description("教学督导情况")]
	public class TMTeachInspectModel
	{
		/// <summary>
		/// KeyId
		/// </summary>
		[Description("KeyId")]
		public int KeyId { get; set; }
      
		/// <summary>
		/// 督导员ID
		/// </summary>
		[Description("督导员ID")]
		public int InspectorID { get; set; }
      
		/// <summary>
		/// 教师ID
		/// </summary>
		[Description("教师ID")]
		public int TeacherID { get; set; }
      
		/// <summary>
		/// 授课详细信息ID
		/// </summary>
		[Description("授课详细信息ID")]
		public int TeachCourseDetailID { get; set; }
      
		/// <summary>
		/// 督导日期
		/// </summary>
		[Description("督导日期")]
		public string InspectDate { get; set; }
      
		/// <summary>
		/// 督导节次
		/// </summary>
		[Description("督导节次")]
		public string InspectTime { get; set; }
      
		/// <summary>
		/// 授课地点ID
		/// </summary>
		[Description("授课地点ID")]
		public int InspectRoomID { get; set; }
      
		/// <summary>
		/// 调课信息
		/// </summary>
		[Description("调课信息")]
		public string InspectChange { get; set; }
      
		/// <summary>
		/// 督导记录
		/// </summary>
		[Description("督导记录")]
		public string InspectLog { get; set; }
      
		/// <summary>
		/// 督导评价
		/// </summary>
		[Description("督导评价")]
		public string InspectAppraise { get; set; }
      
		/// <summary>
		/// 教师迟到
		/// </summary>
		[Description("教师迟到")]
		public string InspectCD { get; set; }
      
		/// <summary>
		/// 教师早退
		/// </summary>
		[Description("教师早退")]
		public string InspectZT { get; set; }
      
		/// <summary>
		/// 教师旷课
		/// </summary>
		[Description("教师旷课")]
		public string InspectKK { get; set; }
      
		/// <summary>
		/// 备注信息
		/// </summary>
		[Description("备注信息")]
		public string Remark { get; set; }
      
		/// <summary>
		/// 督导周次
		/// </summary>
		[Description("督导周次")]
		public int InspectWeeks { get; set; }
      
		/// <summary>
		/// 督导星期
		/// </summary>
		[Description("督导星期")]
		public string InspectDay { get; set; }
        [Description("学期ID")]
        public int TermID { get; set; }
				
		public override string ToString()
		{
			return JSONhelper.ToJson(this);
		}
	}
}