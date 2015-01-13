var actionCommon = '/TM/ashx/TMCommon.ashx';
var actionURL = '/TM/ashx/TMStudentsHandler.ashx';
var actionURLClass = '/TM/ashx/TMClassInfoHandler.ashx';
var actionURLS = '/TM/ashx/TMStudentsHandler.ashx';
var formurl = '/TM/html/TMStudents.html';
var wherestr = "";
$(function () {
    
    autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height: 0 });

    $('#a_add').click(CRUD.add);
    $('#a_edit').click(CRUD.edit);
    $('#a_delete').click(CRUD.del);
    $('#a_export').click(function () {
       $('body').data('where',wherestr);
        var ee = new ExportExcel('list', "V_TM_StudentInfoDetail");
        ee.go();
    });
    $.getJSON(actionURLClass + "?" + createParam("proffession"), function (d) {
        d = JSON.stringify(d).replace(/KeyId/g, "id").replace(/Title/g, "text");
        d = '[{id:0,text:"== 请选择专业 =="},' + d.substr(1);
        $('#txt_Profession').combotree({
            width: '230',
            editable: false,
            data: eval(d),
            value: 0,
            onChange: function (newValue, oldValue) {

                $.getJSON(actionURLS + '?' + createParam('classes', newValue), function (dd) {
                    if (dd.length <= 0) {
                        alert("本专业暂无班级!");

                    }
                    dd = JSON.stringify(dd);

                    $('#txt_ClassID').combobox({
                        valueField: 'KeyId',
                        textField: 'ClassName',
                        data: eval(dd),
                        editable: false,
                        requried: true,
                        onChange: function (nV, oV) {
                            var ruleArr = [];
                            ruleArr.push({ "field": "ClassID", "op": "eq", "data": nV });
                            if (ruleArr.length > 0) {
                                var filterObj = { groupOp: 'AND', rules: ruleArr };
                                wherestr = JSON.stringify(filterObj);
                                $('#list').datagrid('load', { filter: JSON.stringify(filterObj) });
                            }
                        }


                    });
                })
            }
        });

    });
    $("#btn_NumberSearch").click(function () {
        var num = $("#txt_StudentNumber").val();
        if (num == "") {
            alert("请输入学号！");
            return;
        }
        else {

            var ruleArr = [];
            ruleArr.push({ "field": "StudentNumber", "op": "cn", "data": num });
           
            if (ruleArr.length > 0) {
                var filterObj = { groupOp: 'AND', rules: ruleArr };
                wherestr = JSON.stringify(filterObj);
                $('#list').datagrid('load', { filter: JSON.stringify(filterObj) });
            }
        }

    });
    $("#btn_NameSearch").click(function () {
        var num = $("#txt_Name").val();
        if (num == "") {
            alert("请输入姓名！");
            return;
        }
        else {

            var ruleArr = [];
            ruleArr.push({ "field": "Name", "op": "cn", "data": num });
           
            if (ruleArr.length > 0) {
                var filterObj = { groupOp: 'AND', rules: ruleArr };
                wherestr = JSON.stringify(filterObj);
                $('#list').datagrid('load', { filter: JSON.stringify(filterObj) });
            }
        }

    });


    //高级查询
    $('#a_search').click(function () {
        alert(search.go('list'));       
      
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
				           
		    { title: '所学专业', field: 'Title', width: 140 },
		    { title: '班级名称', field: 'ClassName', width: 140 },
            { title: '班主任', field: 'TrueName', width: 60 },
		    { title: '学号', field: 'StudentNumber', width: 120 },
		    { title: '姓名', field: 'Name', width: 60 },
		    { title: '性别', field: 'Gender', width: 40 },
		    { title: '民族', field: 'NationName', width: 60 },
		    { title: '政治面貌', field: 'PolityName', width: 60 },
		    { title: '身份证号', field: 'Card', width: 160 },
		    { title: '通讯地址', field: 'Address', width: 160 },
		    { title: '家庭电话', field: 'HomePhone', width: 120 },
		    { title: '父亲', field: 'Father', width: 60 },
		    { title: '母亲', field: 'Mother', width: 60 },
		    { title: '入学分数', field: 'AdmissionScore', width: 60 },
		    { title: '住宿地点', field: 'Hostel', width: 120 },
		    { title: '干部信息', field: 'LeaderInfo', width: 60 },
		    { title: '身体状况', field: 'PhysicalStatus', width: 80 },
		    { title: '生源地', field: 'ComeFrom', width: 120 },
		    { title: '联系电话', field: 'Phone', width: 120 },
		    { title: 'QQ', field: 'QQ', width: 100 },
		    { title: 'Email', field: 'Email', width: 100 },
		    { title: '备注信息', field: 'Remark', width: 120 }
            
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
    var query = top.$('#suiform').serializeArray();
    query = convertArray(query);
    o.jsonEntity = JSON.stringify(query);
    o.action = action;
    o.keyid = keyid;
    return "json=" + JSON.stringify(o);
}


var CRUD = {
    initValidate: function () {
        top.$('#suiform').validate();
    },
    add: function () {
        var hDialog = top.jQuery.hDialog({

            onLoad: function () {
               
                //top.$('#txt_College').combobox({ multiple: false, valueField: 'KeyId', textField: 'Title', editable: false });

                //$.getJSON(actionURL + '?' + createParam('colleges'), function (d) {
                //    top.$('#txt_College').combobox({ data: d });
                //});

                $.getJSON(actionURL + '?' + createParam('proffession'), function (d) {
                    if (d.length > 0) {

                        d = JSON.stringify(d).replace(/KeyId/g, "id").replace(/Title/g, "text");

                        d = '[{id:0,text:"== 请选择 =="},' + d.substr(1);
                    }
                    else
                        d = '[{id:0,text:"== 请选择 =="}]';

                    top.$('#txt_Profession').combotree({
                        width:'230',
                        valueField: 'id',
                        dataField:'text',
                        editable: false,
                        data: eval(d),
                        value: 0,
                        onChange: function (newValue, oldValue) {

                            $.getJSON(actionURL + '?' + createParam('classes', newValue), function (dd) {
                                if (dd.length <=0) {
                                    alert("本专业暂无班级，请到班级管理中添加班级。");

                                }
                                dd = JSON.stringify(dd);
                               
                                top.$('#txt_ClassID').combobox({
                                    valueField: 'KeyId',
                                    textField: 'ClassName',
                                    data: eval(dd),
                                    editable: false,
                                    requried:true


                                });
                            })
                        } 
                    });

                });
                //初始化结束
                //设置民族和政治面貌
                top.$('#txt_Nationality').combobox({
                    url: actionURL + '?' + createParam('dics', 2),
                    valueField: 'KeyId',
                    textField: 'Title',
                    editable: false,
                    onLoadSuccess: function (data) { //加载完成后,设置选中第一项
                        if (data) {
                            top.$('#txt_Nationality').combobox("setValue", data[0].KeyId);
                        }
                    }
                });

                top.$('#txt_PoliticalStatus').combobox({
                    url: actionURL + '?' + createParam('dics', 9),
                    valueField: 'KeyId',
                    textField: 'Title',
                    editable:false,
                    //value: data[0].KeyId
                    onLoadSuccess: function (data) { //加载完成后,设置选中第一项
                        top.$('#txt_PoliticalStatus').combobox("setValue", data[0].KeyId);
                    }
                });
               
            },

            title: '添加',
            width: 350,
            height: 450,
            href: formurl,
            iconCls: 'icon-add',
            submit: function () {
                            
               // if (top.$('#suiform').form('validate')) {
                if (top.$('#suiform').form('validate')) {
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
                else
                {
                    alert("请检查表单填写信息是否完整并符合格式。");
                }
                return false;
            }

        });

       // top.$('#uiform').validate();
    },
    edit: function () {
        var row = grid.getSelectedRow();
        if (row) {
            var hDialog = top.jQuery.hDialog({
                title: '编辑', width: 350, height: 450, href: formurl, iconCls: 'icon-save',
                onLoad: function () {
                    top.$('#txt_KeyId').val(row.KeyId);
                    top.$('#txt_StudentNumber').val(row.StudentNumber);
                    top.$('#txt_Name').val(row.Name);
                    top.$('#txt_Gender').val(row.Gender);
                    top.$('#txt_Nationality').combobox({
                        url: actionURL + '?' + createParam('dics', 2),
                        valueField: 'KeyId',
                        textField: 'Title',
                        value: row.Nationality

                    });
                    top.$('#txt_PoliticalStatus').combobox({
                        url: actionURL + '?' + createParam('dics',9),
                        valueField: 'KeyId',
                        textField: 'Title',
                        value: row.PoliticalStatus

                    });


                    top.$('#txt_Card').val(row.Card);
                   // top.$('#txt_College').val(row.College);
                    //top.$('#txt_Profession').val(row.Profession);
                   // top.$('#txt_ClassID').val(row.ClassID);
                    top.$('#txt_Address').val(row.Address);
                    top.$('#txt_HomePhone').val(row.HomePhone);
                    top.$('#txt_Father').val(row.Father);
                    top.$('#txt_Mother').val(row.Mother);
                    top.$('#txt_AdmissionScore').val(row.AdmissionScore);
                    top.$('#txt_Hostel').val(row.Hostel);
                    top.$('#txt_LeaderInfo').val(row.LeaderInfo);
                    top.$('#txt_PhysicalStatus').val(row.PhysicalStatus);
                    top.$('#txt_ComeFrom').val(row.ComeFrom);
                    top.$('#txt_Phone').val(row.Phone);
                    top.$('#txt_QQ').val(row.QQ);
                    top.$('#txt_Email').val(row.Email);
                    top.$('#txt_Remark').val(row.Remark);
                   
                    //top.$('#txt_College').combobox({ multiple: false, valueField: 'KeyId', textField: 'Title', editable: false });

                    //$.getJSON(actionURL + '?' + createParam('colleges'), function (d) {
                    //    top.$('#txt_College').combobox({ data: d, value: row.College });
                    //});

                    $.getJSON(actionURL + '?' + createParam('proffession'), function (d) {
                        if (d.length > 0) {

                            d = JSON.stringify(d).replace(/KeyId/g, "id").replace(/Title/g, "text");

                            d = '[{id:0,text:"== 请选择 =="},' + d.substr(1);
                        }
                        else
                            d = '[{id:0,text:"== 请选择 =="}]';
                     

                        top.$('#txt_Profession').combotree({
                            width: '230',
                            valueField: 'id',
                            dataField: 'text',
                            editable: false,
                            data: eval(d),
                            value: row.Proffession,
                            onChange: function (newValue, oldValue) {

                                $.getJSON(actionURL + '?' + createParam('classes', newValue), function (dd) {
                                    if (dd.length <= 0) {
                                        alert("本专业暂无班级，请到班级管理中添加班级。");

                                    }
                                    dd = JSON.stringify(dd);

                                    top.$('#txt_ClassID').combobox({
                                        valueField: 'KeyId',
                                        textField: 'ClassName',
                                        data: eval(dd),
                                        editable: false,
                                        requried: true,
                                       });
                                })
                            }

                            //conchange结束
                           

                        });

                    });
                    //设置所在班级
                    top.$('#txt_ClassID').combobox({
                        url: actionURL + '?' + createParam('classes', row.Proffession),
                        valueField: 'KeyId',
                        textField: 'ClassName',
                        value: row.ClassID
                    });

                },
                submit: function () {
                    if (top.$('#suiform').form('validate')) {
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
                    else
                    {
                        alert("表单中有漏填数据或部分数据不符合格式，请检查！");
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

