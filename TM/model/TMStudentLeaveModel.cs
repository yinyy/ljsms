using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_StudentLeave")]
	[Description("学生请假表")]
	public class TMStudentLeaveModel
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
		/// 申请日期
		/// </summary>
		[Description("申请日期")]
		public DateTime ApplyDate { get; set; }
      
		/// <summary>
		/// 开始日期
		/// </summary>
		[Description("开始日期")]
		public DateTime LeaveStart { get; set; }
      
		/// <summary>
		/// 结束日期
		/// </summary>
		[Description("结束日期")]
		public DateTime LeaveEnd { get; set; }
      
		/// <summary>
		/// 请假类别
		/// </summary>
		[Description("请假类别")]
		public int LeaveClassID { get; set; }
      
		/// <summary>
		/// 请假理由
		/// </summary>
		[Description("请假理由")]
		public string LeaveReason { get; set; }
      
		/// <summary>
		/// 班主任审批
		/// </summary>
		[Description("班主任审批")]
		public string ClassApprove { get; set; }
      
		/// <summary>
		/// 院领导审批
		/// </summary>
		[Description("院领导审批")]
		public string LeaderApprove { get; set; }
      
		/// <summary>
		/// 离校情况
		/// </summary>
		[Description("离校情况")]
		public string LeaveSchool { get; set; }
      
		/// <summary>
		/// 备用联系方式
		/// </summary>
		[Description("备用联系方式")]
		public string LeavePhone { get; set; }
      
		/// <summary>
		/// 返校日期
		/// </summary>
		[Description("返校日期")]
		public string LeaveBack { get; set; }
      
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