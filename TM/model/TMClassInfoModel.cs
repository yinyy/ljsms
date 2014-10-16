using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;
using DB.BPM.Core;

namespace TM.Model
{
	[TableName("TM_ClassInfo")]
	[Description("班级信息表")]
	public class TMClassInfoModel
	{
		/// <summary>
		/// 班级ID
		/// </summary>
		[Description("班级ID")]
        public int KeyId { get; set; }
      
		/// <summary>
		/// 二级学院
		/// </summary>
		[Description("二级学院")]
		public int College { get; set; }
      
		/// <summary>
		/// 所属专业
		/// </summary>
		[Description("所属专业")]
		public int Proffession { get; set; }
      
		/// <summary>
		/// 年级
		/// </summary>
		[Description("年级")]
		public string Grade { get; set; }
      
		/// <summary>
		/// 班级名称
		/// </summary>
		[Description("班级名称")]
		public string ClassName { get; set; }
      
		/// <summary>
		/// 班主任ID
		/// </summary>
		[Description("班主任ID")]
		public int ClassLeaderID { get; set; }
      
		/// <summary>
		/// 班长
		/// </summary>
		[Description("班长")]
		public string ClassMonitor { get; set; }
      
		/// <summary>
		/// 班长电话
		/// </summary>
		[Description("班长电话")]
		public string ClassMonitorPhone { get; set; }
      
		/// <summary>
		/// 备注信息
		/// </summary>
		[Description("备注信息")]
		public string Remark { get; set; }

        [DbField(false)]
        public string LeaderName
        {
            get { return DB.BPM.Core.Dal.UserDal.Instance.Get(ClassLeaderID).TrueName; }
        }		
		public override string ToString()
		{
			return JSONhelper.ToJson(this);
		}
	}
}