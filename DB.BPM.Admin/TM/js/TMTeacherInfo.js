var actionURL = '/TM/ashx/TMTeacherInfoHandler.ashx';
var formurl   = '/TM/html/TMTeacherInfo.html';

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
		    {title:'姓名',field:'Name',width:60},
		    {title:'性别',field:'Gender',width:40},
		    {title:'出生年月',field:'BirthYM',width:70},
		    {title:'民族',field:'NationNanlity',width:60},
		    {title:'政治面貌',field:'PoliticalStatus',width:60},
		    {title:'入党时间',field:'RuDangTime',width:60},
		    {title:'工作时间',field:'WorkTime',width:60},
		    {title:'进入本单位时间',field:'InTime',width:60},
		    {title:'任课类别',field:'RenKeClass',width:80},
		    {title:'身份证号',field:'CardNumber',width:130},
		    {title:'教师资格证号',field:'TeacherNumber',width:130},
		    {title:'资格取得方式',field:'TeacherWay',width:80},
		    {title:'资格发证机关',field:'TeacherDepartment',width:120},
		    {title:'资格获取时间',field:'TeacherGetTime',width:60},
		    {title:'任教课程',field:'TeacherCourse',width:120},
		    {title:'职称学科',field:'ZhiChengXueKe',width:120},
		    {title:'聘前身份',field:'PinQianShenFen',width:120},
		    {title:'行政级别',field:'XingZhengJiBie',width:120},
		    {title:'行政职务',field:'XingZhengZhiWu',width:120},
		    {title:'专业技术职称',field:'ZhiCheng',width:80},
		    {title:'职称取得时间',field:'ZhiChengTime',width:80},
		    {title:'职称首聘时间',field:'ZhiChengShouPinTime',width:80},
		    {title:'籍贯',field:'JiGuan',width:120},
		    {title:'第一学历',field:'XueLi',width:120},
		    {title:'第一学历学校',field:'XueLiSchool',width:120},
		    {title:'第一学历专业',field:'XueLiZhuanye',width:120},
		    {title:'第一学历时间',field:'XueLiTime',width:120},
		    {title:'最高学历',field:'LastXueLi',width:120},
		    {title:'最高学历学校',field:'LastXueLiSchool',width:120},
		    {title:'最高学历专业',field:'LastXueLiZhuanye',width:120},
		    {title:'最高学历时间',field:'LastXueLiTime',width:120},
		               
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
            title: '添加', width: 350, height: 300, href:formurl, iconCls: 'icon-add', submit: function () {
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
                title: '编辑', width: 350, height: 300, href: formurl, iconCls: 'icon-save',
                onLoad:function() {
                   top.$('#txt_KeyId').val(row.KeyId);
			top.$('#txt_Name').val(row.Name);
			top.$('#txt_Gender').val(row.Gender);
			top.$('#txt_BirthYM').val(row.BirthYM);
			top.$('#txt_NationNanlity').val(row.NationNanlity);
			top.$('#txt_PoliticalStatus').val(row.PoliticalStatus);
			top.$('#txt_RuDangTime').val(row.RuDangTime);
			top.$('#txt_WorkTime').val(row.WorkTime);
			top.$('#txt_InTime').val(row.InTime);
			top.$('#txt_RenKeClass').val(row.RenKeClass);
			top.$('#txt_CardNumber').val(row.CardNumber);
			top.$('#txt_TeacherNumber').val(row.TeacherNumber);
			top.$('#txt_TeacherWay').val(row.TeacherWay);
			top.$('#txt_TeacherDepartment').val(row.TeacherDepartment);
			top.$('#txt_TeacherGetTime').val(row.TeacherGetTime);
			top.$('#txt_TeacherCourse').val(row.TeacherCourse);
			top.$('#txt_ZhiChengXueKe').val(row.ZhiChengXueKe);
			top.$('#txt_PinQianShenFen').val(row.PinQianShenFen);
			top.$('#txt_XingZhengJiBie').val(row.XingZhengJiBie);
			top.$('#txt_XingZhengZhiWu').val(row.XingZhengZhiWu);
			top.$('#txt_ZhiCheng').val(row.ZhiCheng);
			top.$('#txt_ZhiChengTime').val(row.ZhiChengTime);
			top.$('#txt_ZhiChengShouPinTime').val(row.ZhiChengShouPinTime);
			top.$('#txt_JiGuan').val(row.JiGuan);
			top.$('#txt_XueLi').val(row.XueLi);
			top.$('#txt_XueLiSchool').val(row.XueLiSchool);
			top.$('#txt_XueLiZhuanye').val(row.XueLiZhuanye);
			top.$('#txt_XueLiTime').val(row.XueLiTime);
			top.$('#txt_LastXueLi').val(row.LastXueLi);
			top.$('#txt_LastXueLiSchool').val(row.LastXueLiSchool);
			top.$('#txt_LastXueLiZhuanye').val(row.LastXueLiZhuanye);
			top.$('#txt_LastXueLiTime').val(row.LastXueLiTime);
			top.$('#txt_UserID').val(row.UserID);
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

