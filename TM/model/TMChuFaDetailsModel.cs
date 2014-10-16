using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_ChuFaDetails")]
	[Description("处罚单明细表")]
	public class TMChuFaDetailsModel
	{
		/// <summary>
		/// 序号
		/// </summary>
		[Description("序号")]
		public int KeyId { get; set; }
      
		/// <summary>
		/// 违纪种类ID
		/// </summary>
		[Description("违纪种类ID")]
		public int RuleId { get; set; }
      
		/// <summary>
		/// 违纪情况
		/// </summary>
		[Description("违纪情况")]
		public string WeiJiQingkuang { get; set; }
      
		/// <summary>
		/// 违纪班级
		/// </summary>
		[Description("违纪班级")]
		public int WeiJiClass { get; set; }
      
		/// <summary>
		/// 违纪学生
		/// </summary>
		[Description("违纪学生")]
		public int WeiJiStudent { get; set; }
      
		/// <summary>
		/// 违纪宿舍
		/// </summary>
		[Description("违纪宿舍")]
		public int WeiJiRoom { get; set; }
      
		/// <summary>
		/// 处罚说明
		/// </summary>
		[Description("处罚说明")]
		public string ChuFaShuoMing { get; set; }
      
		/// <summary>
		/// 处罚扣分
		/// </summary>
		[Description("处罚扣分")]
		public string ChuFaScore { get; set; }
      
		/// <summary>
		/// 处罚人
		/// </summary>
		[Description("处罚人")]
		public int ChuFaRen { get; set; }
      
		/// <summary>
		/// 处罚主体
		/// </summary>
		[Description("处罚主体")]
		public string ChuFaZhuTi { get; set; }
      
		/// <summary>
		/// 违纪日期
		/// </summary>
		[Description("违纪日期")]
		public string WeiJiDate { get; set; }
      
		/// <summary>
		/// 违纪地点
		/// </summary>
		[Description("违纪地点")]
		public string WeiJiAddress { get; set; }
      
		/// <summary>
		/// 审批意见
		/// </summary>
		[Description("审批意见")]
		public string ShenHeYiJian { get; set; }
      
		/// <summary>
		/// 审批日期
		/// </summary>
		[Description("审批日期")]
		public string ShenHeDate { get; set; }
      
		/// <summary>
		/// 审批人
		/// </summary>
		[Description("审批人")]
		public int ShenHeRen { get; set; }
      
		/// <summary>
		/// 学期ID
		/// </summary>
		[Description("学期ID")]
		public int TermId { get; set; }
      
		/// <summary>
		/// 备注信息
		/// </summary>
		[Description("备注信息")]
		public string Remark { get; set; }
        /// <summary>
        /// 教学周次
        /// </summary>
        [Description("教学周")]
        public int Weeks { get; set; }
				
		public override string ToString()
		{
			return JSONhelper.ToJson(this);
		}
	}
}