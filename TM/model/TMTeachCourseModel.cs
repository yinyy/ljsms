using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_TeachCourse")]
	[Description("教师授课表")]
	public class TMTeachCourseModel
	{
		/// <summary>
		/// 序号
		/// </summary>
		[Description("序号")]
		public int KeyId { get; set; }
      
		/// <summary>
		/// 教师ID
		/// </summary>
		[Description("教师ID")]
		public int TeacherID { get; set; }
      
		/// <summary>
		/// 虚班ID
		/// </summary>
		[Description("虚班ID")]
		public int VClassID { get; set; }
      
		/// <summary>
		/// 课程ID
		/// </summary>
		[Description("课程ID")]
		public int CourseID { get; set; }
      
		/// <summary>
		/// 开课周次
		/// </summary>
		[Description("开课周次")]
		public int CourseWeekStart { get; set; }
      
		/// <summary>
		/// 结课周次
		/// </summary>
		[Description("结课周次")]
		public int CourseWeekEnd { get; set; }
      
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

        [DbField(false)]
        public List<TMTeachCourseDetailModel> details { get; set; }
		
		public override string ToString()
		{
			return JSONhelper.ToJson(this);
		}
	}
}