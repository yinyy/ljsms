using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using DB.Common.Data;
using DB.Common.Provider;

using TM.Model;
using System.Data;
using DB.Common.Data.Filter;
using DB.Common;

namespace TM.Dal
{
    public class TMInvestigateDal : BaseRepository<TMInvestigateModel>
    {
        public static TMInvestigateDal Instance
        {
            get { return SingletonProvider<TMInvestigateDal>.Instance; }
        }

        public string GetJson(int pageindex, int pagesize, string filterJson, string sort = "keyid",
                              string order = "asc")
        {
            //return base.JsonDataForEasyUIdataGrid(TableConvention.Resolve(typeof(TMInvestigateModel)), pageindex, pagesize, filterJson,
            //                                      sort, order);

            return base.JsonDataForEasyUIdataGrid("V_TM_Investigate", pageindex, pagesize, filterJson,
                                                  sort, order);
        }

        public int Copy(TMInvestigateModel model)
        {
            #region 创建Investigate
            TMInvestigateModel old = TMInvestigateDal.Instance.Get(model.KeyId);
            TMInvestigateModel newo = new TMInvestigateModel()
            {
                Created = model.Created,
                CreatorId = model.CreatorId,
                Ended = model.Ended,
                Started = model.Started,
                Status = model.Status,
                TermId = model.TermId,
                Title = model.Title,
                Kind=model.Kind
            };
            #endregion

            int ans = this.Insert(newo);
            if (ans > 0)
            {
                newo.KeyId = ans;

                #region 把Item找出来
                foreach (TMInvestigateItemModel item in TMInvestigateItemDal.Instance.GetWhere(new { InvestigateId = old.KeyId }))
                {
                    TMInvestigateItemModel itemmodel = new TMInvestigateItemModel()
                    {
                        Columns = item.Columns,
                        InvestigateId = newo.KeyId,
                        Kind = item.Kind,
                        SortNumber = item.Kind,
                        Title = item.Title
                    };

                    int itemid = TMInvestigateItemDal.Instance.Insert(itemmodel);
                    itemmodel.KeyId = itemid;

                    #region 把答案找出来
                    foreach (TMInvestigateItemChoiceModel choice in TMInvestigateItemChoiceDal.Instance.GetWhere(new { InvestigateItemId=item.KeyId}))
                    {
                        TMInvestigateItemChoiceModel choicemodel = new TMInvestigateItemChoiceModel()
                        {
                            HasOther = choice.HasOther,
                            InvestigateItemId = itemmodel.KeyId,
                            Score = choice.Score,
                            SortNumber = choice.SortNumber,
                            Title = choice.Title
                        };

                        int choiceid = TMInvestigateItemChoiceDal.Instance.Insert(choicemodel);
                    }
                    #endregion
                }
                #endregion
            }

            return ans;
        }

        public new int Delete(int keyid)
        {
            foreach (TMInvestigateItemModel item in TMInvestigateItemDal.Instance.GetWhere(new { InvestigateId = keyid }))
            {
                DbUtils.DeleteWhere<TMInvestigateItemChoiceModel>(new { InvestigateItemId = item.KeyId });
            }

            DbUtils.DeleteWhere<TMInvestigateItemModel>(new { InvestigateId = keyid });

            return base.Delete(keyid);
        }
    }
}