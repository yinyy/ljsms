using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_TeacherInfo")]
	[Description("教师档案信息表")]
	public class TMTeacherInfoModel
	{
		/// <summary>
		/// KeyId
		/// </summary>
		[Description("KeyId")]
		public int KeyId { get; set; }
      
		/// <summary>
		/// 姓名
		/// </summary>
		[Description("姓名")]
		public string Name { get; set; }
      
		/// <summary>
		/// 性别
		/// </summary>
		[Description("性别")]
		public string Gender { get; set; }
      
		/// <summary>
		/// 出生年月
		/// </summary>
		[Description("出生年月")]
		public string BirthYM { get; set; }
      
		/// <summary>
		/// 民族
		/// </summary>
		[Description("民族")]
		public string NationNanlity { get; set; }
      
		/// <summary>
		/// 政治面貌
		/// </summary>
		[Description("政治面貌")]
		public string PoliticalStatus { get; set; }
      
		/// <summary>
		/// 入党时间
		/// </summary>
		[Description("入党时间")]
		public string RuDangTime { get; set; }
      
		/// <summary>
		/// 工作时间
		/// </summary>
		[Description("工作时间")]
		public string WorkTime { get; set; }
      
		/// <summary>
		/// 进入本单位时间
		/// </summary>
		[Description("进入本单位时间")]
		public string InTime { get; set; }
      
		/// <summary>
		/// 任课类别
		/// </summary>
		[Description("任课类别")]
		public string RenKeClass { get; set; }
      
		/// <summary>
		/// 身份证号
		/// </summary>
		[Description("身份证号")]
		public string CardNumber { get; set; }
      
		/// <summary>
		/// 教师资格证号
		/// </summary>
		[Description("教师资格证号")]
		public string TeacherNumber { get; set; }
      
		/// <summary>
		/// 资格取得方式
		/// </summary>
		[Description("资格取得方式")]
		public string TeacherWay { get; set; }
      
		/// <summary>
		/// 资格发证机关
		/// </summary>
		[Description("资格发证机关")]
		public string TeacherDepartment { get; set; }
      
		/// <summary>
		/// 资格获取时间
		/// </summary>
		[Description("资格获取时间")]
		public string TeacherGetTime { get; set; }
      
		/// <summary>
		/// 任教课程
		/// </summary>
		[Description("任教课程")]
		public string TeacherCourse { get; set; }
      
		/// <summary>
		/// 职称学科
		/// </summary>
		[Description("职称学科")]
		public string ZhiChengXueKe { get; set; }
      
		/// <summary>
		/// 聘前身份
		/// </summary>
		[Description("聘前身份")]
		public string PinQianShenFen { get; set; }
      
		/// <summary>
		/// 行政级别
		/// </summary>
		[Description("行政级别")]
		public string XingZhengJiBie { get; set; }
      
		/// <summary>
		/// 行政职务
		/// </summary>
		[Description("行政职务")]
		public string XingZhengZhiWu { get; set; }
      
		/// <summary>
		/// 专业技术职称
		/// </summary>
		[Description("专业技术职称")]
		public string ZhiCheng { get; set; }
      
		/// <summary>
		/// 职称取得时间
		/// </summary>
		[Description("职称取得时间")]
		public string ZhiChengTime { get; set; }
      
		/// <summary>
		/// 职称首聘时间
		/// </summary>
		[Description("职称首聘时间")]
		public string ZhiChengShouPinTime { get; set; }
      
		/// <summary>
		/// 籍贯
		/// </summary>
		[Description("籍贯")]
		public string JiGuan { get; set; }
      
		/// <summary>
		/// 第一学历
		/// </summary>
		[Description("第一学历")]
		public string XueLi { get; set; }
      
		/// <summary>
		/// 第一学历学校
		/// </summary>
		[Description("第一学历学校")]
		public string XueLiSchool { get; set; }
      
		/// <summary>
		/// 第一学历专业
		/// </summary>
		[Description("第一学历专业")]
		public string XueLiZhuanye { get; set; }
      
		/// <summary>
		/// 第一学历时间
		/// </summary>
		[Description("第一学历时间")]
		public string XueLiTime { get; set; }
      
		/// <summary>
		/// 最高学历
		/// </summary>
		[Description("最高学历")]
		public string LastXueLi { get; set; }
      
		/// <summary>
		/// 最高学历学校
		/// </summary>
		[Description("最高学历学校")]
		public string LastXueLiSchool { get; set; }
      
		/// <summary>
		/// 最高学历专业
		/// </summary>
		[Description("最高学历专业")]
		public string LastXueLiZhuanye { get; set; }
      
		/// <summary>
		/// 最高学历时间
		/// </summary>
		[Description("最高学历时间")]
		public string LastXueLiTime { get; set; }
      
		/// <summary>
		/// UserID
		/// </summary>
		[Description("UserID")]
		public int UserID { get; set; }
      
				
		public override string ToString()
		{
			return JSONhelper.ToJson(this);
		}
	}
}