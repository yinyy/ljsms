using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;

namespace TM.Model
{
	[TableName("TM_WarningIndex")]
	[Description("违纪预警指标表")]
	public class TMWarningIndexModel
	{
		/// <summary>
		/// 预警指标Id
		/// </summary>
		[Description("预警指标Id")]
		public int KeyId { get; set; }
      
		/// <summary>
		/// 预警项目ID
		/// </summary>
		[Description("预警项目ID")]
		public int WarningItemID { get; set; }
      
		/// <summary>
		/// 预警下限
		/// </summary>
		[Description("预警下限")]
		public int WarningIndexLow { get; set; }
      
		/// <summary>
		/// 预警上限
		/// </summary>
		[Description("预警上限")]
		public int WarningIndexHigh { get; set; }
      
		/// <summary>
		/// 处理规定
		/// </summary>
		[Description("处理规定")]
		public string WarningProcess { get; set; }
      
		/// <summary>
		/// 分值
		/// </summary>
		[Description("分值")]
		public int WarningScore { get; set; }
      
		/// <summary>
		/// 指标启用与否
		/// </summary>
		[Description("指标启用与否")]
		public string WarningEnabled { get; set; }
      
		/// <summary>
		/// 备注信息
		/// </summary>
		[Description("备注信息")]
		public string Remark { get; set; }
      
		/// <summary>
		/// 指标统计期间
		/// </summary>
		[Description("指标统计期间")]
		public string WarningPeriod { get; set; }

        /// <summary>
        /// 警告颜色级别
        /// </summary>
        [Description("警告颜色级别")]
        public string WarningColorStyle { get; set; }

		public override string ToString()
		{
			return JSONhelper.ToJson(this);
		}
	}
}