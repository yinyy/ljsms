var actionURL = '/TM/ashx/TMChuFaHandler.ashx';
var formurl = '/TM/html/TMChuFaDetails.html';
var sumurl = '/TM/html/TMChuFaSumShow.html';
var classURL = '/TM/ashx/TMClassInfoHandler.ashx';
var studentURL = '/TM/ashx/TMStudentsHandler.ashx';
var ruleURL = '/TM/ashx/TMBreakRulesHandler.ashx';
var actionCommon = '/TM/ashx/TMCommon.ashx';
var currentterm = null;
var ctstart = "";
var uid = 0;
var termid = 0;
$(function () {
    $.getJSON(actionCommon + "?nm=GetUid", function (d) {
        uid = eval(d).uid;
    });
    //获取本学期起始日期,用于计算教学周
    $.getJSON(actionCommon + "?nm=GetTerm", function (d) {
        if (d != null) {
            currentterm = eval(d);
            ctstart = new Date(currentterm.TermStart.substr(0, 10));
            termid = d.KeyId;
        }
    });
    autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height: 0 });

    $('#a_add').click(CRUD.add);
    $('#a_edit').click(CRUD.edit);
    $('#a_delete').click(CRUD.del);
    $('#a_datesum').click(sum.datesum);
    $('#a_classsum').click(sum.classsum);

//高级查询
   $('#a_search').click(function () {
        search.go('list');
    });
});
var sum = {
    datesum: function () {
        bindsum("datesumgetByTeacherID","日期");
    },
    classsum: function () {
        bindsum("classsumgetByTeacherID","班级");
    }
};
var grid = {
    bind: function (winSize) {
        $('#list').datagrid({
            url: actionURL+'?action=getByTeacherID',
            toolbar: '#toolbar',
            title: "数据列表",
            iconCls: 'icon icon-list',
            width: winSize.width,
            height: winSize.height,
            nowrap: false, //折行
            rownumbers: true, //行号
            striped: true, //隔行变色
            idField: 'KeyId',//主键
            singleSelect: true, //单选
            frozenColumns: [[]],
            columns: [[
                { title: '教学周', field: 'Weeks', width: 50, align: 'center' },
            {
                title: '违纪日期', field: 'WeiJiDate', width: 60,align:'center',
                formatter: function (val) {
                    if (val == "" || val == null)
                    { return "" }
                    else
                    { return val.substr(5, 5); }
                }
            },
            { title: '违纪班级', field: 'ClassName', width: 120, align: 'center' },
            { title: '处罚主体', field: 'ChuFaZhuTi', width: 60, align: 'center' },
		    { title: '违纪种类', field: 'RuleTypeName', width: 60, align: 'center' },
		    { title: '违纪情况', field: 'WeiJiQingkuang', width: 120 },
            { title: '处罚依据', field: 'RuleName', width: 120 },
            { title: '扣分', field: 'ChuFaScore', width: 40, align: 'center' },
		    { title: '违纪学生', field: 'StudentName', width: 60, align: 'center' },
		    { title: '违纪宿舍', field: 'WeiJiRoomName', width: 80, align: 'center' },
		    {title:'处罚说明',field:'ChuFaShuoMing',width:120},		   
		    {title:'处罚人',field:'ChuFaRenName',width:60},
		    {title:'违纪地点',field:'WeiJiAddress',width:120},
		    { title: '审批意见', field: 'ShenHeYiJian', width: 80, align: 'center' },
		    {
		        title: '审批日期', field: 'ShenHeDate', width: 80,
		        formatter: function (val) {
		            if (val == "" || val == null)
		            { return "" }
		            else
		            { return val.substr(5, 5); }
		        }
		    },
		    {title:'审批人',field:'ShenHeRenName',width:60},
		   
		    {title:'备注信息',field:'Remark',width:120}               
            ]],
            pagination: true,
            pageSize: PAGESIZE,
            pageList: [20, 40, 50]
        });
    },
    getSelectedRow: function () {
        return $('#list').datagrid('getSelected');
    },
    reload: function () {
        $('#list').datagrid('clearSelections').datagrid('reload', { filter: '' });
    }
};

function bindsum(durl,mbt) {
    
        var hDialog = top.jQuery.hDialog({
            onLoad: function () {               
                pgrid = top.$('#sumlist').datagrid({
                    url: actionURL + '?action='+durl,
                    width: 550, 
                    pagination: true,                    
                    pageSize: PAGESIZE,
                    pageList: [200],
                    //idField: 'KeyId',//主键
                    height: 550,                 
                    columns: [[
                         {
                             field: 'WeiJi', title: mbt, width: 120, align: 'center'

                         },
                        {
                            field: 'Score', title: '扣分合计', width: 150, align: 'center'
                        }
                    ]]
                    
                });
                //弹出布局结束
            },
            title: '本人出具罚分单汇总数据',
            width: 600,
            height: 600,
            href: sumurl,
            iconCls: 'icon-add'
        });

    };
function createParam(action, keyid) {
    var o = {};
    var query = top.$('#uiform').serializeArray();
    query = convertArray(query);
    o.jsonEntity = JSON.stringify(query);
    o.action = action;
    o.keyid = keyid;
    return "json=" + JSON.stringify(o);
}
function createSubParam(action, keyid) {
    var o = {};
    var query = top.$('#uiform').serializeArray();
    query = convertArray(query);    
    query.ShenHeYiJian = "未审批";
    query.ShenHeRen = 161;
    query.TermID = termid;
    query.ChuFaRen = uid;
    o.jsonEntity = JSON.stringify(query);
    o.action = action;
    o.keyid = keyid;
    return "json=" + JSON.stringify(o);
}

var CRUD = {
    add: function () {
        var hDialog = top.jQuery.hDialog({
            onLoad: function () {
                //设置违纪日期为当前客户端日期
                var curr_time = new Date();
                var strDate = curr_time.getFullYear() + "-";
                strDate += curr_time.getMonth() + 1 + "-";
                strDate += curr_time.getDate();
                top.$("#txt_WeiJiDate").datebox({
                    formatter: function (date) { return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(); },
                    parser: function (date) { return new Date(Date.parse(date.replace(/-/g, "/"))); },
                    onSelect: function (date) {                        
                        var currentweeks = parseInt(Math.abs(date - ctstart) / 1000 / 60 / 60 / 24 / 7) + 1;
                        top.$("#txt_Weeks").val(currentweeks);
                    }

                });
                top.$("#txt_WeiJiDate").datebox("setValue", strDate);
                top.$("#txt_Weeks").val(parseInt(Math.abs(curr_time - ctstart) / 1000 / 60 / 60 / 24 / 7) + 1);
                //获取违纪地点字典并绑定
                top.$("#txt_WeiJiAddress").combobox({
                    url: '/sys/ashx/DicHandler.ashx?categoryId=17',
                    width: 120,
                    valueField: 'Title',
                    textField: 'Title'                    
                });

                //获取违纪类别GRID并绑定
                top.$("#txt_RuleId").combogrid(
          {
              url: ruleURL + '?' + createParam('getAll'),
              panelWidth: 500,
              idField: 'KeyId',
              textField: 'RuleName',
              columns: [[
              { field: 'RuleTypeName', title: '违纪类别', width: 80 },
              { field: 'RuleName', title: '违纪条款', width: 200 },
              { field: 'RuleScore', title: '建议扣分', width: 60, align: 'center' },
              { field: 'RuleGrade', title: '违纪等级', width: 60, align: 'center' }

              ]],             
              fitColumns: true,
              onChange: function (nV, oV) {
                  var grid = top.$("#txt_RuleId").combogrid("grid");//获取表格对象
                  var row = grid.datagrid('getSelected');//获取行数据 
                  top.$("#txt_ChuFaScore").val(row.RuleScore);
                  top.$("#txt_WeiJiQingkuang").val(row.RuleName);
                  top.$("#txt_ChuFaShuoMing").val("违反"+row.RuleTypeName+"规定："+row.RuleName+"，扣除分数："+row.RuleScore+"分。");
              }
          });
                //绑定班级和学生    
                
                $.getJSON(classURL  + '?' + createParam('getAllClasses'), function (dd) {
                    if (dd.length <= 0) {
                        alert("暂时没有任何班级");

                    }                    
                    dd = JSON.stringify(dd);
                    top.$('#txt_WeiJiClass').combobox({
                        valueField: 'KeyId',
                        textField:'ClassName',
                        data: eval(dd),
                        editable: false,
                        requried: true,
                        onChange: function (newValue1, oldValue1) {
                            $.getJSON(studentURL + '?' + createParam('getbycid', newValue1), function (ddd) {
                                if (ddd.length <= 0) {
                                    alert("本班级暂无学生");

                                }
                                ddd = JSON.stringify(ddd);
                                top.$('#txt_WeiJiStudent').combobox({
                                    valueField: 'KeyId',
                                    textField: 'Name',
                                    data: eval(ddd),
                                    editable: false,
                                    requried: true

                                });
                            })
                        }


                    });
                });
                //绑定宿舍
                top.$("#txt_WeiJiRoom").combotree({
                    url: '/sys/ashx/DicHandler.ashx?action=getdictree&categoryId=16',
                    width: 120,
                    valueField: 'id',
                    textField: 'text',
                    panelWidth: 180,
                    lines: true,
                    onLoadSuccess: function () {
                        top.$("#txt_WeiJiRoom").combotree("setValue", 162);//默认设置违纪宿舍为未指定
                    }
                });
            },
            title: '学生违规违纪检查记录单录入',
            width: 650,
            height: 400,
            href: formurl,
            iconCls: 'icon-add',
            submit: function () {
                if (top.$('#uiform').validate().form()) {
                    var query = createSubParam('add', '0');
                    jQuery.ajaxjson(actionURL, query, function (d) {
                        if (parseInt(d) > 0) {
                            msg.ok('添加成功！');
                            hDialog.dialog('close');
                            grid.reload();
                        } else {
                            MessageOrRedirect(d);
                        }
                    });
                }
                return false;
            }
        });
       
        top.$('#uiform').validate();
    },
    edit: function () {
        var row = grid.getSelectedRow();
        if (row) {
            if (row.ShenHeYiJian != "未审批")
            {
                alert("本处罚单已经于[" + row.ShenHeDate + "]被[" + row.ShenHeRenName + "]审批通过，不得再做修改！");
                return false;
            }
            var hDialog = top.jQuery.hDialog({
                title: '编辑', width: 650, height: 400, href: formurl, iconCls: 'icon-save',
                onLoad: function () {
                    //获取违纪地点字典并绑定
                    top.$("#txt_WeiJiAddress").combobox({
                        url: '/sys/ashx/DicHandler.ashx?categoryId=17',
                        width: 120,
                        valueField: 'Title',
                        textField: 'Title',
                        onLoadSuccess: function () {
                            top.$('#txt_WeiJiAddress').combobox('setValue', row.WeiJiAddress);
                        }
                    });

                    //获取违纪类别GRID并绑定
                    top.$("#txt_RuleId").combogrid(
              {
                  url: ruleURL,
                  panelWidth: 500,
                  idField: 'KeyId',
                  textField: 'RuleName',
                  columns: [[
                  { field: 'RuleTypeName', title: '违纪类别', width: 80 },
                  { field: 'RuleName', title: '违纪条款', width: 200 },
                  { field: 'RuleScore', title: '建议扣分', width: 60, align: 'center' },
                  { field: 'RuleGrade', title: '违纪等级', width: 60, align: 'center' }

                  ]],
                  fitColumns: true,
                  onChange: function (nV, oV) {
                      var grid = top.$("#txt_RuleId").combogrid("grid");//获取表格对象
                      var row = grid.datagrid('getSelected');//获取行数据 
                      top.$("#txt_ChuFaScore").val(row.RuleScore);
                      top.$("#txt_WeiJiQingkuang").val(row.RuleName);
                      top.$("#txt_ChuFaShuoMing").val("违反" + row.RuleTypeName + "规定：" + row.RuleName + "，扣除分数：" + row.RuleScore + "分。");
                  },
                  onLoadSuccess: function () {
                      top.$('#txt_RuleId').combogrid('setValue', row.RuleId);
                  }
              });
                    //绑定班级和学生    

                    $.getJSON(classURL + '?' + createParam('getAllClasses'), function (dd) {
                        if (dd.length <= 0) {
                            alert("暂时没有任何班级");

                        }
                        dd = JSON.stringify(dd);
                        top.$('#txt_WeiJiClass').combobox({
                            valueField: 'KeyId',
                            textField: 'ClassName',
                            data: eval(dd),
                            editable: false,
                            requried: true,
                            onChange: function (newValue1, oldValue1) {
                                $.getJSON(studentURL + '?' + createParam('getbycid', newValue1), function (ddd) {
                                    if (ddd.length <= 0) {
                                        alert("本班级暂无学生");

                                    }
                                    ddd = JSON.stringify(ddd);
                                    top.$('#txt_WeiJiStudent').combobox({
                                        valueField: 'KeyId',
                                        textField: 'Name',
                                        data: eval(ddd),
                                        editable: false,
                                        requried: true

                                    });
                                })
                            },
                            onLoadSuccess: function () {
                                top.$('#txt_WeiJiClass').combobox('setValue', row.WeiJiClass);
                                $.getJSON(studentURL + '?' + createParam('getbycid', row.WeiJiClass), function (ddd) {
                                    if (ddd.length <= 0) {
                                        alert("本班级暂无学生");

                                    }
                                    ddd = JSON.stringify(ddd);
                                    top.$('#txt_WeiJiStudent').combobox({
                                        valueField: 'KeyId',
                                        textField: 'Name',
                                        data: eval(ddd),
                                        editable: false,
                                        requried: true,
                                        onLoadSuccess: function () {
                                            top.$('#txt_WeiJiStudent').combobox('setValue',row.WeiJiStudent);
                                        }

                                    });
                                })
                            }


                        });
                    });
                    //绑定宿舍
                    top.$("#txt_WeiJiRoom").combotree({
                        url: '/sys/ashx/DicHandler.ashx?action=getdictree&categoryId=16',
                        width: 120,
                        valueField: 'id',
                        textField: 'text',
                        panelWidth: 180,
                        lines: true,
                        onLoadSuccess: function () {
                            top.$("#txt_WeiJiRoom").combotree("setValue", row.WeiJiRoom);
                        }
                    });
			
			top.$('#txt_WeiJiQingkuang').val(row.WeiJiQingkuang);			
			top.$('#txt_ChuFaShuoMing').val(row.ChuFaShuoMing);
			top.$('#txt_ChuFaScore').val(row.ChuFaScore);			
			top.$('#txt_WeiJiDate').datebox('setValue',row.WeiJiDate);					
			top.$('#txt_Remark').val(row.Remark);
                }, 
                submit: function () {
                    if (top.$('#uiform').validate().form()) {
                        var query = createSubParam('edit', row.KeyId);;
                        jQuery.ajaxjson(actionURL, query, function (d) {
                            if (parseInt(d) > 0) {
                                msg.ok('修改成功！');
                                hDialog.dialog('close');
                                grid.reload();
                            } else {
                                MessageOrRedirect(d);
                            }
                        });
                    }
                    return false;
                }
            });
           
        } else {
            msg.warning('请选择要修改的行。');
        }
    },
    del: function () {
        var row = grid.getSelectedRow();
        if (row) {
            if (row.ShenHeYiJian != "未审批") {
                alert("本处罚单已经于[" + row.ShenHeDate + "]被[" + row.ShenHeRenName + "]审批通过，不得再做删除操作！");
                return false;
            }
            if (confirm('确认要执行删除操作吗？')) {
                var rid = row.KeyId;
                jQuery.ajaxjson(actionURL, createParam('delete', rid), function (d) {
                    if (parseInt(d) > 0) {
                        msg.ok('删除成功！');
                        grid.reload();
                    } else {
                        MessageOrRedirect(d);
                    }
                });
            }
        } else {
            msg.warning('请选择要删除的行。');
        }
    }
};

