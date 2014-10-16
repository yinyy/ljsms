using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_TeachCheck")]
	[Description("教师授课日志")]
	public class TMTeachCheckModel
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
		public int VTeachCourseID { get; set; }
      
		/// <summary>
		/// 教师授课节次ID
		/// </summary>
		[Description("教师授课节次ID")]
		public int VTeachCourseDetailID { get; set; }
      
		/// <summary>
		/// 授课日期
		/// </summary>
		[Description("授课日期")]
		public string TeachDate { get; set; }
      
		/// <summary>
		/// 授课节次
		/// </summary>
		[Description("授课节次")]
		public string TeachTime { get; set; }
      
		/// <summary>
		/// 授课地点ID
		/// </summary>
		[Description("授课地点ID")]
		public int TeachRoomID { get; set; }
      
		/// <summary>
		/// 调课信息
		/// </summary>
		[Description("调课信息")]
		public string ClassChange { get; set; }
      
		/// <summary>
		/// 授课日志
		/// </summary>
		[Description("授课日志")]
		public string TeachLog { get; set; }
      
		/// <summary>
		/// 实际授课教师
		/// </summary>
		[Description("授课教师")]
		public int Teacher { get; set; }
      
		/// <summary>
		/// 备注信息
		/// </summary>
		[Description("备注信息")]
		public string Remark { get; set; }
        /// </summary>
        [Description("授课周次")]
        public int TeachWeeks { get; set; }

        [Description("所属学期")]
        public int TermID { get; set; }
        [Description("授课星期")]
        public string TeachDay { get; set; }

        [Description("教师ID")]
        public int TeacherID { get; set; }

        [DbField(false)]
        public List<TMTeachCheckDetailsModel> details { get; set; }
 		
		public override string ToString()
		{
			return JSONhelper.ToJson(this);
		}
	}
}