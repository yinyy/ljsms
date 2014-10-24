using DB.BPM.Core;
using DB.BPM.Core.Bll;
using DB.Common;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using TM.Bll;
using TM.Dal;
using TM.Model;

namespace DB.BPM.Admin.TM.ashx
{
    /// <summary>
    /// TMDocumentHandler 的摘要说明
    /// </summary>
    public class TMDocumentHandler : IHttpHandler,IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            UserBll.Instance.CheckUserOnlingState();

            var json = HttpContext.Current.Request["json"];
            var rpm = new RequestParamModel<TMDocumentModel>(context) { CurrentContext = context };
            if (!string.IsNullOrEmpty(json))
            {
                rpm = JSONhelper.ConvertToObject<RequestParamModel<TMDocumentModel>>(json);
                rpm.CurrentContext = context;
            }

            switch (rpm.Action)
            {
                case "upload":
                    //判断目录是否存在
                    for (int i = 0; i < context.Request.Files.Count; i++)
                    {
                        DateTime now = DateTime.Now;
                        
                        string relative = string.Format("/upfile/{0}/{1}/{2}/{3}", SysVisitor.Instance.CurrentUser.KeyId, now.Year, now.Month, now.Day);
                        string root = context.Server.MapPath(relative);
                        if (!Directory.Exists(root))
                        {
                            Directory.CreateDirectory(root);
                        }

                        var f = context.Request.Files[i];
                        string fn = f.FileName;
                        int size = f.ContentLength;
                        string ext = fn.Substring(fn.LastIndexOf('.') + 1);
                        string name = fn.Substring(fn.LastIndexOf(Path.DirectorySeparatorChar) + 1, fn.LastIndexOf('.') - fn.LastIndexOf(Path.DirectorySeparatorChar) - 1);

                        relative = string.Format("{0}/{1}_{2}.{3}", relative, name, now.Ticks, ext);
                        string path = context.Server.MapPath(relative);
                        f.SaveAs(path);

                        //将信息存储到数据库
                        TMDocumentModel model = new TMDocumentModel
                        {
                            TeacherId = SysVisitor.Instance.CurrentUser.KeyId,
                            Created = now,
                            ExtName = ext,
                            Filename = name,
                            FileUrl = relative,
                            Size = size,
                            Tag=""
                        };
                        TMDocumentBll.Instance.Add(model);
                    }
                    break;
                case "delete":
                    TMDocumentModel document = TMDocumentBll.Instance.Get(rpm.KeyId);
                    int ans = TMDocumentBll.Instance.Delete(rpm.KeyId);
                    if (ans > 0)
                    {
                        File.Delete(context.Server.MapPath(document.FileUrl));
                    }
                    context.Response.Write(ans);
                    break;
                case "tag":
                    document = TMDocumentBll.Instance.Get(rpm.KeyId);
                    document.Tag = context.Request.Params["tags"];
                    context.Response.Write(TMDocumentBll.Instance.Update(document));
                    break;
                default:
                    context.Response.Write(TMDocumentBll.Instance.GetJson(rpm.Pageindex, rpm.Pagesize, rpm.Filter, rpm.Sort, rpm.Order));
                    break;
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}