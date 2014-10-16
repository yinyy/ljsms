using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_Students")]
	[Description("学生基本信息表")]
	public class TMStudentsModel
	{
		/// <summary>
		/// 学生ID
		/// </summary>
		[Description("学生ID")]
		public int KeyId { get; set; }
      
		/// <summary>
		/// 学号
		/// </summary>
		[Description("学号")]
		public string StudentNumber { get; set; }
      
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
		/// 民族
		/// </summary>
		[Description("民族")]
		public string Nationality { get; set; }
      
		/// <summary>
		/// 政治面貌
		/// </summary>
		[Description("政治面貌")]
		public string PoliticalStatus { get; set; }
      
		/// <summary>
		/// 身份证号
		/// </summary>
		[Description("身份证号")]
		public string Card { get; set; }
      
		/// <summary>
		/// 所在学院
		/// </summary>
		[Description("所在学院")]
		public int College { get; set; }
      
		/// <summary>
		/// 所学专业
		/// </summary>
		[Description("所学专业")]
		public int Profession { get; set; }
      
		/// <summary>
		/// 班级ID
		/// </summary>
		[Description("班级ID")]
		public int ClassID { get; set; }
      
		/// <summary>
		/// 通讯地址
		/// </summary>
		[Description("通讯地址")]
		public string Address { get; set; }
      
		/// <summary>
		/// 家庭电话
		/// </summary>
		[Description("家庭电话")]
		public string HomePhone { get; set; }
      
		/// <summary>
		/// 父亲
		/// </summary>
		[Description("父亲")]
		public string Father { get; set; }
      
		/// <summary>
		/// 母亲
		/// </summary>
		[Description("母亲")]
		public string Mother { get; set; }
      
		/// <summary>
		/// 入学分数
		/// </summary>
		[Description("入学分数")]
		public int AdmissionScore { get; set; }
      
		/// <summary>
		/// 住宿地点
		/// </summary>
		[Description("住宿地点")]
		public string Hostel { get; set; }
      
		/// <summary>
		/// 干部信息
		/// </summary>
		[Description("干部信息")]
		public string LeaderInfo { get; set; }
      
		/// <summary>
		/// 身体状况
		/// </summary>
		[Description("身体状况")]
		public string PhysicalStatus { get; set; }
      
		/// <summary>
		/// 生源地
		/// </summary>
		[Description("生源地")]
		public string ComeFrom { get; set; }
      
		/// <summary>
		/// 联系电话
		/// </summary>
		[Description("联系电话")]
		public string Phone { get; set; }
      
		/// <summary>
		/// QQ
		/// </summary>
		[Description("QQ")]
		public string QQ { get; set; }
      
		/// <summary>
		/// Email
		/// </summary>
		[Description("Email")]
		public string Email { get; set; }
      
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