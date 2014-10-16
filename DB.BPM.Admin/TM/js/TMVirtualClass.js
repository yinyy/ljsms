var actionURL = '/TM/ashx/TMVirtualClassHandler.ashx';
var actionURLClass = '/TM/ashx/TMClassInfoHandler.ashx';
var formurl   = '/TM/html/TMVirtualClass.html';
var actionURLS = '/TM/ashx/TMVClassStudentsHandler.ashx';
var formurlS = '/TM/html/TMVClassStudents.html';
var size = { width: $(window).width(), height: $(window).height() };
var vcid = 0;//初始化保存当前虚班id
$(function () {
    //var size = { width: $(window).width(), height: $(window).height() };
    mylayout.init(size);
    $(window).resize(function () {
        size = { width: $(window).width(), height: $(window).height() };
        mylayout.resize(size);
    });
    
  
    autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height:0,width:350 });
    //autoResize({ dataGrid: '#studentlist', gridType: 'datagrid', callback: gridStudent.bind, height: 0 });

    $('#a_addV').click(CRUDV.add);
    $('#a_editV').click(CRUDV.edit);
    $('#a_deleteV').click(CRUDV.del);


    $('#a_addclass').click(CRUD.add);
   // $('#a_addstudent').click(CRUD.edit);
   // $('#a_delete').click(CRUD.del);
    
//高级查询
   $('#a_search').click(function () {
        search.go('list');
    });
});

var mylayout = {
    init: function (size) {
        $('#layout').width(size.width - 4).height(size.height - 4).layout();
        var center = $('#layout').layout('panel', 'center');
        center.panel({
            onResize: function (w, h) {
                $('#studentlist').datagrid('resize', { width: w, height: h });
            }
        });
    },
    resize: function (size) {
        mylayout.init(size);
        $('#layout').layout('resize');
    }
};






var grid = {
    bind: function (winSize) {
        
        $('#list').datagrid({
            url: actionURL,
            //toolbar: '#toolbarleft',
            //title: "虚拟授课班级",
            iconCls: 'icon icon-list',
            width: 460,
            height: winSize.height,
            nowrap: false, //折行
            rownumbers: true, //行号
            striped: true, //隔行变色
            idField: 'KeyId',//主键
            singleSelect: true, //单选
            frozenColumns: [[]],
            columns: [[
				
		    { title: '虚拟授课班', field: 'VClassDescription', width: 100 },
            { title: '备注信息', field: 'Remark', width: 200 },
		    {title:'开课学期',field:'TermName',width:100},
		    
            ]],
            pagination: true,
            pageSize: PAGESIZE,
            pageList: [100, 40, 50],
            onClickRow: function (index, data) {
                var row = $('#list').datagrid('getSelected');
                
              
                if (row)
                {
                    //根据虚班ID获取虚班学生
                    vcid = row.KeyId;
                    gridStudent.bind(size,row.KeyId,row.VClassDescription,row.TermName);
                }
                
            }
        });
                
    },
    bindtree: function (winSize) {

        $('#vcs').tree({
            url: actionURL + createParam('list'),
            width: winSize.width,
            height: winSize.height,
            onLoadSuccess: function (node, data) {
                alert(data);
                if (data.length == 0) {

                    $('#noVclassInfo').fadeIn();
                }

               // $('body').data('categoryData', JSON.stringify(data));
            },
            onClick: function (node) {
                //var cc = node.id;
                //$('#dicGrid').treegrid({
                //    url: actionUrl,
                //     queryParams: { categoryId: cc }
                // });
            }
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


var CRUDV = {
    add: function () {
        
        var hDialog = top.jQuery.hDialog({
            title: '新增虚拟授课班级',
            width: 350,
            height: 300,
            href: formurl,
            iconCls: 'icon-add',
            onLoad: function () {
                top.$('#txt_TermID').combobox({ multiple: false, valueField: 'KeyId', textField: 'TermDescription', editable: false });

                $.getJSON('/TM/ashx/TMTermHandler.ashx',createParam('list'), function (d) {
                    
                    d = JSON.stringify(d);
                   
                    top.$('#txt_TermID').combobox({
                        data:eval(d),                      

                        onLoadSuccess: function (data) { //加载完成后,设置选中第一项
                        if (data) {
                            top.$('#txt_TermID').combobox("setValue", data[0].KeyId);
                        }
                    }                   
                    
                    });
                
                
                })
                },

/*

                top.$('#txt_TermID').combobox({
                    url: '/TM/ashx/TMTermHandler.ashx',
                    valueField: 'KeyId',
                    textField: 'TermDescription',
                    editable: false,
                    onLoadSuccess: function (data) { //加载完成后,设置选中第一项
                        if (data) {
                            top.$('#txt_TermID').combobox("setValue", data[0].KeyId);
                        }
                    }

                });*/

          
            submit: function () {
                if (top.$('#uiform').validate().form()) {
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
                title: '编辑虚拟授课班级', width: 350, height: 300, href: formurl, iconCls: 'icon-save',
                onLoad:function() {
                   top.$('#txt_KeyId').val(row.KeyId);
			top.$('#txt_VClassDescription').val(row.VClassDescription);
			//top.$('#txt_TermID').val(row.TermID);
			top.$('#txt_Status').val(row.Status);
			top.$('#txt_Remark').val(row.Remark);
			top.$('#txt_TermID').combobox({ multiple: false, valueField: 'KeyId', textField: 'TermDescription', editable: false });
			$.getJSON('/TM/ashx/TMTermHandler.ashx', createParam('list'), function (d) {
			    
			    d = JSON.stringify(d);
			    
			    top.$('#txt_TermID').combobox({
			        data: eval(d),
                    value:row.TermID
			       

			    });


			})
			




			},
                submit: function () {
                    if (top.$('#uiform').validate().form()) {
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
            if (confirm('确认要执行删除虚拟授课班级操作吗？本操作将删除【'+row.VClassDescription+'】虚拟班和其中学生信息。')) {
                var rid = row.KeyId;
                jQuery.ajaxjson(actionURL, createParam('delete', rid), function (d) {
                    if (parseInt(d) > 0) {
                        msg.ok('删除成功！');
                        grid.reload();
                        gridStudent.reload();
                    } else {
                        MessageOrRedirect(d);
                    }
                });
            }
        } else {
            msg.warning('请选择要删除的虚拟授课班级行。');
        }
    }
};

var gridStudent = {
    bind: function (winSize,vid,vname,tname) {
        
        $('#studentlist').datagrid({
            url: actionURLS+'?action="vlist"&KeyId='+vid,
            toolbar: '#toolbarright',
            title: "虚拟授课班级学生列表["+tname+']['+vname+"]",
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
				
               
                  { title: '专业名称', field: 'Title', width:140 },
                 { title: '班级名称', field: 'ClassName', width: 100 },
                  { title: '学号', field: 'StudentNumber', width: 80 },
                  { title: '学生姓名', field: 'Name', width: 60 },
		    { title: '性别', field: 'Gender', width:40 },
		    { title: '入学分数', field: 'AdmissionScore', width: 60 },
		    { title: '班主任', field: 'TrueName', width: 60 }
		   
            ]],
            pagination: true,
            pageSize: PAGESIZE,
            pageList: [20, 40, 50]

            //
        });
    },
    getSelectedRow: function () {
        return $('#studentlist').datagrid('getSelected');
    },
    reload: function () {
        $('#studentlist').datagrid('clearSelections').datagrid('reload', { filter: '' });
    }
};

var CRUD = {
    add: function () {
        if (vcid == 0)
        {
            alert("还没有选定虚拟授课班，请在左边点击选定！");
            return;
        }

        var hDialog = top.jQuery.hDialog({
            title: '向虚拟班级中添加学生',
            width: 660,
            height: 500,
            href: formurlS,
            iconCls: 'icon-add',
            onLoad: function () {
                //top.$('#txt_College').combobox({ multiple: false, valueField: 'KeyId', textField: 'Title', editable: false });

                $.getJSON(actionURLClass + '?' + createParam('colleges'), function (d) {
                    top.$('#txt_College').combobox({ data: d });
                });

                $.getJSON(actionURLClass + '?' + createParam('proffession'), function (d) {
                    if (d.length > 0) {

                        d = JSON.stringify(d).replace(/KeyId/g, "id").replace(/Title/g, "text");

                        d = '[{id:0,text:"== 请选择 =="},' + d.substr(1);
                    }
                    else
                        d = '[{id:0,text:"== 请选择 =="}]';

                    //valueField: 'text',
                    //textField: 'text',
                    top.$('#txt_Proffession').combotree({
                        width:260,
                        editable: false,
                        data: eval(d),
                        value: 0,
                        onChange: function (newValue, oldValue) {
                           
                            var ruleArr = [];
                            if (newValue != '') {
                                top.$('#classlist').datagrid('clearSelections').datagrid('reload', '');
                                ruleArr.push({ "field": "Proffession", "op": "eq", "data": newValue });
                                var filterObj = { groupOp: 'AND', rules: ruleArr };
                                top.$('#classlist').datagrid('clearSelections').datagrid('reload', { filter: JSON.stringify(filterObj) });
                            }
                            //根据专业重载入班级表
                        }

                    });
                });

                top.$('#classlist').datagrid({
                    url: actionURLClass,
                    iconCls: 'icon icon-list',
                    width: 630,
                    height:340,
                    nowrap: false, //折行
                    rownumbers: true, //行号
                    striped: true, //隔行变色
                    idField: 'KeyId',//主键
                    singleSelect: false, //多选
                    
                    frozenColumns: [[
                        { field: 'ck', checkbox: true }
                    ]],
                   
                   
                    columns: [[
                        
                          { title: '专业名称', field: 'ProffessionName', width: 160 },
                         { title: '班级名称', field: 'ClassName', width: 120 },
                         { title: '班主任', field: 'LeaderName', width: 60 }

                    ]],
                    pagination: true,
                    pageSize: PAGESIZE,
                    pageList: [10, 20,30]



                    //#classlist
                })

                //onload
            },
            submit: function () {
               
              
                var ids = [];

                var rows = top.$('#classlist').datagrid('getSelections');

                for (var i = 0; i < rows.length; i++) {

                    ids.push(rows[i].KeyId);

                }
                 
                            
              
                   // var query = createParam('add', JSON.stringify(ids));
                $.getJSON(actionURLS + "?action=add&jsonclasses=" + JSON.stringify(ids) + "&vcid=" + vcid, function (rdd) {
                         
                            msg.ok('添加成功！');
                            hDialog.dialog('close');
                            gridStudent.reload();
                       
                    });
              
               
            }
        });

        top.$('#uiform').validate();
    },
    edit: function () {
        if (vcid == 0) {
            alert("还没有选定虚拟授课班，请在左边点击选定！");
            return;
        }
        var row = gridStudent.getSelectedRow();
        if (row) {
            var hDialog = top.jQuery.hDialog({
                title: '编辑', width: 350, height: 300, href: formurlS, iconCls: 'icon-save',
                onLoad: function () {
                    top.$('#txt_KeyId').val(row.KeyId);
                    top.$('#txt_VClassID').val(row.VClassID);
                    top.$('#txt_StudentID').val(row.StudentID);
                    top.$('#txt_Status').val(row.Status);
                    top.$('#txt_Remark').val(row.Remark);
                },
                submit: function () {
                    if (top.$('#uiform').validate().form()) {
                        var query = createParam('edit', row.KeyId);;
                        jQuery.ajaxjson(actionURLS, query, function (d) {
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
        if (vcid == 0) {
            alert("还没有选定虚拟授课班，请在左边点击选定！");
            return;
        }
        var row = grid.getSelectedRow();
        if (row) {
            if (confirm('确认要执行删除操作吗？')) {
                var rid = row.KeyId;
                jQuery.ajaxjson(actionURLS, createParam('delete', rid), function (d) {
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