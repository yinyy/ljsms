var actionURL = '/TM/ashx/TMClassInfoHandler.ashx';
var formurl   = '/TM/html/TMClassInfo.html';
  
$(function () {

    autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height: 0 });

    $('#a_add').click(CRUD.add);
    $('#a_edit').click(CRUD.edit);
    $('#a_delete').click(CRUD.del);
//高级查询
   $('#a_search').click(function () {
        search.go('list');
    });
});

var grid = {
    bind: function (winSize) {
        $('#list').datagrid({
            url: actionURL,
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
			
		    
		    {title:'所属专业',field:'ProffessionName',width:100},
		    {title:'年级',field:'Grade',width:60},
		    {title:'班级名称',field:'ClassName',width:160},
		    {title:'班主任',field:'LeaderName',width:60},
		    { title: '班长', field: 'ClassMonitor', width: 60 },
		    {title:'班长电话',field:'ClassMonitorPhone',width:140},
		    {title:'备注信息',field:'Remark',width:160}               
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

function createParam(action, keyid) {
    var o = {};
    var query = top.$('#uiform').serializeArray();
    query = convertArray(query);
    o.jsonEntity = JSON.stringify(query);
    o.action = action;
    o.keyid = keyid;
    return "json=" + JSON.stringify(o);
}


var CRUD = {
    initData: function () {
       
        //top.$('#txt_College').combobox({ multiple: false, valueField: 'KeyId', textField: 'Title', editable: false });

        //$.getJSON(actionURL + '?' + createParam('colleges'), function (d) {
        //    top.$('#txt_College').combobox({ data: d     });
        //});
       
        $.getJSON(actionURL + '?' + createParam('proffession'), function (d) {
            if (d.length > 0) {
               
                d = JSON.stringify(d).replace(/KeyId/g, "id").replace(/Title/g, "text");
              
                 d = '[{id:0,text:"== 请选择 =="},' + d.substr(1);
            }
            else
                d = '[{id:0,text:"== 请选择 =="}]';
            
            //valueField: 'text',
            //textField: 'text',
            top.$('#txt_Proffession').combotree({               
                editable: false,
                data: eval(d),
                value:0

            });
        });

        $.getJSON(actionURL + '?' + createParam('deps'), function (d) {
            if (d.length > 0) {               
                d = JSON.stringify(d).replace(/KeyId/g, "id").replace(/DepartmentName/g, "text");              
                d = '[{id:0,text:"== 请选择 =="},' + d.substr(1);
            }
            else
                d = '[{id:0,text:"== 请选择 =="}]';            
            
            top.$('#txt_deps').combotree({               
                editable: true,
                data: eval(d),
                value:0,
                onChange: function (newValue, oldValue) {                 

                    $.getJSON(actionURL + '?' + createParam('teachers', newValue), function (dd) {
                       
                        dd = JSON.stringify(dd);
                      
                        top.$('#txt_ClassLeaderID').combobox({
                            valueField: 'KeyId',
                            textField:'TrueName',
                            data: eval(dd)
                        });
                    })
                }});

            });
    },


    add: function () {
       
        var hDialog = top.jQuery.hDialog({
            title: '添加', width: 450, height: 400, href: formurl, iconCls: 'icon-add',
            onLoad: function () {               
                CRUD.initData();


            },           
               // onLoadSuccess: function () {
               //     top.$('#txt_Proffession').combotree('setValue',0);
              //  },
            submit: function () {
                
                if (top.$('#uiform').form('validate')) {
                   
                    var query = createParam('add', '0');
                    
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
            var hDialog = top.jQuery.hDialog({
                title: '编辑', width: 450, height: 400, href: formurl, iconCls: 'icon-save',
                onLoad: function () {
                   top.$('#txt_ClassID').val(row.ClassID);
                  //top.$('#txt_College').val(row.College);
			top.$('#txt_Proffession').val(row.Proffession);
			top.$('#txt_Grade').val(row.Grade);
			top.$('#txt_ClassName').val(row.ClassName);
			top.$('#txt_ClassLeaderID').val(row.ClassLeaderID);
			top.$('#txt_ClassMonitor').val(row.ClassMonitor);
			top.$('#txt_ClassMonitorPhone').val(row.ClassMonitorPhone);
			top.$('#txt_Remark').val(row.Remark);
			//top.$('#txt_College').combobox('select', row.College);
			//top.$('#txt_College').combobox({ multiple: false, valueField: 'KeyId', textField: 'Title', editable: false });
			//$.getJSON(actionURL + '?' + createParam('colleges'), function (d) {
			//    top.$('#txt_College').combobox({ data: d,
			//     onLoadSuccess: function () {  
			//   top.$('#txt_College').combobox('setValue', row.College);
			//     }
			//    });
			//});
         //所属专业树
			$.getJSON(actionURL + '?' + createParam('proffession'), function (d) {
			    if (d.length > 0) {
			         d = JSON.stringify(d).replace(/KeyId/g, "id").replace(/Title/g, "text");
			      
			        d = '[{id:0,text:"== 请选择 =="},' + d.substr(1);
			    }
			    else
			        d = '[{id:0,text:"== 请选择 =="}]';
			    top.$('#txt_Proffession').combotree({
			        valueField: 'id',
			        textField: 'text',
			        editable: false,
			        data: eval(d),
			        onLoadSuccess: function () {
			            top.$('#txt_Proffession').combotree('setValue', row.Proffession);
			        }

			    });
			});
            //所在部门和班主任名单选择联动
			$.getJSON(actionURL + '?' + createParam('deps'), function (d) {
			    if (d.length > 0) {
			        d = JSON.stringify(d).replace(/KeyId/g, "id").replace(/DepartmentName/g, "text");
			        d = '[{id:0,text:"== 请选择 =="},' + d.substr(1);
			    }
			    else
			        d = '[{id:0,text:"== 请选择 =="}]';

			    top.$('#txt_deps').combotree({
			        editable: true,
			        data: eval(d),
			        value: 0,
			        onChange: function (newValue, oldValue) {

			            $.getJSON(actionURL + '?' + createParam('teachers', newValue), function (dd) {
			              
			                dd = JSON.stringify(dd);
			                if (dd.length > 0) {
			                    top.$('#txt_ClassLeaderID').combobox({
			                        valueField: 'KeyId',
			                        textField: 'TrueName',
			                        data: eval(dd)
			                    });
			                }
			                else
			                    top.$('#txt_ClassLeaderID').combobox('setValue','');

			            })

			        },
			        onLoadSuccess: function ()
			        {
			            //根据班主任ID获取其部门ID

			            $.getJSON(actionURL + '?' + createParam('userdep', row.ClassLeaderID), function (dep) {
                            //初始化班主任名单
			                $.getJSON(actionURL + '?' + createParam('teachers', dep.DepartmentId), function (dd) {

			                    dd = JSON.stringify(dd);

			                    top.$('#txt_ClassLeaderID').combobox({
			                        valueField: 'KeyId',
			                        textField: 'TrueName',
			                        data: eval(dd),
			                        value: row.ClassLeaderID
			                    });
			                });

			                top.$('#txt_deps').combotree('setValue', dep.DepartmentId);
			               // top.$('#txt_ClassLeaderID').combobox('setValue', row.ClassLeaderID);

			            });

			        }
			    });




			});
                    





                },
                
                submit: function () {
                    if (top.$('#uiform').form('validate')) {
                        var query = createParam('edit', row.KeyId);;
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

