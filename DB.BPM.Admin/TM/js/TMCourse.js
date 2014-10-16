var actionURL = '/TM/ashx/TMCourseHandler.ashx';
var actionDIC = '/sys/ashx/DicHandler.ashx';
var formurl   = '/TM/html/TMCourse.html';

$(function () {

    autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height: 0 });
    $.getJSON(actionDIC + '?categoryId=7', function (d) {
        if (d.length > 0) {

            d = JSON.stringify(d).replace(/KeyId/g, "id").replace(/Title/g, "text");

            d = '[{id:0,text:"== 请选择 =="},' + d.substr(1);
        }
        else
            d = '[{id:0,text:"== 请选择 =="}]';

        //valueField: 'text',
        //textField: 'text',
       $('#txt_Proffession').combotree({
            editable: false,
            data: eval(d),
            value: 0,
            onChange: function (newValue, oldValue)
            {
                
                var ruleArr = [];
                if (newValue != '') {
                    $('#list').datagrid('clearSelections').datagrid('reload', '');
                    ruleArr.push({ "field": "CourseProffessionID", "op": "eq", "data": newValue });
                    var filterObj = { groupOp: 'AND', rules: ruleArr };
                   $('#list').datagrid('clearSelections').datagrid('reload', { filter: JSON.stringify(filterObj) });
                }
            }

        });
    });



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
          // title: "数据列表",
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
                 { title: '归属专业', field: 'ProffessionName', width: 160 },
                { title: '课程类型', field: 'CourseClass', width: 120 },
			 { title: '课程代码', field: 'CourseNumber', width: 120 },
		    {title:'课程名称',field:'CourseName',width:180},		   
		    {title:'课程学时',field:'CourseLearningTime',width:80},
		    {title:'教材',field:'CourseBook',width:120}, 		   
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
    add: function () {
        var hDialog = top.jQuery.hDialog({
            onLoad: function () {
                top.$('#txt_CourseClassID').combobox({
                    url: actionDIC + '?categoryId=13',
                    valueField: 'KeyId',
                    textField: 'Title',
                    editable: false,
                    value:0
                });
               
                $.getJSON(actionDIC + '?categoryId=7', function (d) {
                    if (d.length > 0) {

                        d = JSON.stringify(d).replace(/KeyId/g, "id").replace(/Title/g, "text");

                        d = '[{id:0,text:"== 请选择 =="},' + d.substr(1);
                    }
                    else
                        d = '[{id:0,text:"== 请选择 =="}]';

                    //valueField: 'text',
                    //textField: 'text',
                    top.$('#txt_CourseProffessionID').combotree({
                        editable: false,
                        data: eval(d),
                        value: 0

                    });
                });

            },
            title: '添加', width: 380, height:420, href:formurl, iconCls: 'icon-add', submit: function () {
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
                title: '编辑', width: 380, height: 420, href: formurl, iconCls: 'icon-save',
                onLoad: function () {
                    top.$('#txt_CourseClassID').combobox({
                        url: actionDIC + '?categoryId=13',
                        valueField: 'KeyId',
                        textField: 'Title',
                        editable: false,
                        value: row.CourseClassID
                    });

                    $.getJSON(actionDIC + '?categoryId=7', function (d) {
                        if (d.length > 0) {

                            d = JSON.stringify(d).replace(/KeyId/g, "id").replace(/Title/g, "text");

                            d = '[{id:0,text:"== 请选择 =="},' + d.substr(1);
                        }
                        else
                            d = '[{id:0,text:"== 请选择 =="}]';

                        //valueField: 'text',
                        //textField: 'text',
                        top.$('#txt_CourseProffessionID').combotree({
                            editable: false,
                            data: eval(d),
                            value: row.CourseProffessionID

                        });
                    });



                   top.$('#txt_KeyId').val(row.KeyId);
			top.$('#txt_CourseName').val(row.CourseName);
			top.$('#txt_CourseNumber').val(row.CourseNumber);
			top.$('#txt_CourseLearningTime').val(row.CourseLearningTime);
			top.$('#txt_CourseBook').val(row.CourseBook);
			//top.$('#txt_CourseClassID').val(row.CourseClassID);
			//top.$('#txt_CourseProffessionID').val(row.CourseProffessionID);
			top.$('#txt_Remark').val(row.Remark);
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

