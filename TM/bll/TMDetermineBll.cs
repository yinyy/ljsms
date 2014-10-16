using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TM.Dal;
using TM.Model;
using DB.Common.Provider;
using DB.BPM.Core;
using System.Data;

namespace TM.Bll
{
    public class TMDetermineBll
    {
        public static TMDetermineBll Instance
        {
            get { return SingletonProvider<TMDetermineBll>.Instance; }
        }

        public int Add(TMDetermineModel model)
        {
            model.Created = DateTime.Now;
            model.CreatorId = SysVisitor.Instance.CurrentUser.KeyId;
            model.TermId = SysVisitor.Instance.GetCurrentTerm().KeyId;

            return TMDetermineDal.Instance.Insert(model);
        }

        public int Update(TMDetermineModel model)
        {
            TMDetermineModel old = TMDetermineDal.Instance.Get(model.KeyId);
            old.Status = model.Status;
            old.Title = model.Title;
            old.BasicCols = model.BasicCols;
            old.DetermineCols = model.DetermineCols;

            return TMDetermineDal.Instance.Update(old);
        }

        public int Delete(int keyid)
        {
            return TMDetermineDal.Instance.Delete(keyid);
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "Keyid", string order = "asc")
        {
            return TMDetermineDal.Instance.GetJson(pageindex, pagesize, filterJson, sort, order);
        }

        public DataTable Export(int determineId)
        {
            return TMDetermineDal.Instance.Export(determineId);
        }
    }
}
