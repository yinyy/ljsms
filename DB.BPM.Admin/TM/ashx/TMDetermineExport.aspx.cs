using DB.BPM.Core;
using DB.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TM.Bll;

namespace DB.BPM.Admin.TM
{
    public partial class TMDetermineExport : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!SysVisitor.Instance.IsGuest)
            {
                int determineId = PublicMethod.GetInt(Request["determineId"]);


                GridViewExportUtil.Export(DateTime.Now.ToString("yyyyMMddHHmmssffff") + ".xls", TMDetermineBll.Instance.Export(determineId));
            }
            else
            {
                Response.Write("<h1>没有登录啊，你懂的！</h1>");
            }
        }
    }
}