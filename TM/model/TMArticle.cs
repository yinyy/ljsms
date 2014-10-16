﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel;
using DB.Common;
using DB.Common.Data;
namespace TM.Model
{
    [TableName("Demo_article")]
    [Description("DEMO")]
   public class TMArticleModel
    {
        /// <summary>
        /// KeyId
        /// </summary>
        [Description("KeyId")]
        public int KeyId { get; set; }

        /// <summary>
        /// 标题
        /// </summary>
        [Description("标题")]
        public string title { get; set; }

        /// <summary>
        /// 内容
        /// </summary>
        [Description("内容")]
        public string body { get; set; }

        /// <summary>
        /// 添加时间
        /// </summary>
        [Description("添加时间")]
        public DateTime addtime { get; set; }

        /// <summary>
        /// 添加人
        /// </summary>
        [Description("添加人")]
        public string adduser { get; set; }


        public override string ToString()
        {
            return JSONhelper.ToJson(this);
        }
    }
}
