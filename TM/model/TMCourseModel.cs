using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_Course")]
	[Description("课程表")]
	public class TMCourseModel
	{
		/// <summary>
		/// 课程ID
		/// </summary>
		[Description("课程ID")]
		public int KeyId { get; set; }
      
		/// <summary>
		/// 课程名称
		/// </summary>
		[Description("课程名称")]
		public string CourseName { get; set; }
      
		/// <summary>
		/// 课程代码
		/// </summary>
		[Description("课程代码")]
		public string CourseNumber { get; set; }
      
		/// <summary>
		/// 课程学时
		/// </summary>
		[Description("课程学时")]
		public int CourseLearningTime { get; set; }
      
		/// <summary>
		/// 教材
		/// </summary>
		[Description("教材")]
		public string CourseBook { get; set; }
      
		/// <summary>
		/// 课程类型ID
		/// </summary>
		[Description("课程类型ID")]
		public int CourseClassID { get; set; }
      
		/// <summary>
		/// 归属专业ID
		/// </summary>
		[Description("归属专业ID")]
		public int CourseProffessionID { get; set; }
      
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