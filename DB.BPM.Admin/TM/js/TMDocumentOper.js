var actionURL = '/TM/ashx/TMDocumentOperHandler.ashx';

$(function () {
    autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height: 0 });

    $('#a_filter_by_teacher').click(filter.teacher);
    $('#a_filter_by_extend').click(filter.extend);
    $('#a_filter_by_time').click(filter.time);
    $('#a_filter_by_tag').click(filter.tag);
});

var grid = {
    bind: function (winSize) {
        $('#list').datagrid({
            url: actionURL,
            toolbar: '#toolbar',
            //title: "文档列表",
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
                { title: '提交人', field: 'Owner_Title', width: 100, align: "center" },
                 { title: '名称', field: 'Filename', width: 350 },
                {
                    title: '类型', field: 'ExtName', width: 150, align: 'center', formatter: function (value, row, index) {
                        if (value == 'doc' || value == 'docx') {
                            return "Word文档";
                        } else if (value == 'xls' || value == 'xlsx') {
                            return "Excel电子表格";
                        } else if (value == 'ppt' || value == 'pptx') {
                            return "PowerPoint演示文稿";
                        } else if (value == 'rar' || value == 'zip') {
                            return "压缩文件";
                        } else if (value == 'gif' || value == 'png' || value == 'jpg' || value == 'psd' || value == 'tiff') {
                            return "图像文件";
                        } else {
                            return value;
                        }
                    }
                },
			 {
			     title: '大小', field: 'Size', width: 100, align: 'right', formatter: function (value, row, index) {
			         if (value > 1024 * 1024) {
			             return (value / 1024 / 1024).toFixed(2) + 'MB';
			         } else {
			             return (value / 1024).toFixed(2) + 'KB';
			         }
			     }
			 },
		    { title: '上传时间', field: 'Created', width: 150, align: 'center' },
            { title: '标签', field: 'Tag', width: 400 }
            ]],
            pagination: true,
            pageSize: PAGESIZE,
            pageList: [20, 40, 50],
            sortName: 'Created',
            sortOrder: 'desc'
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

var mylayout = {
    init: function (size) {
        top.$('#layout').width(size.width - 4).height(size.height - 4).layout();
        var center = top.$('#layout').layout('panel', 'center');
        center.panel({
            onResize: function (w, h) {
                //$('#userGrid').datagrid('resize', { width: w - 6, height: h - 36 });
            }
        });
    },
    resize: function (size) {
        mylayout.init(size);
        top.$('#layout').layout('resize');
    }
};


var filter = {
    teacher: function () {
        var content = '<div id="cc" class="easyui-layout" style="width:950px;height:420px;">' +
                        '<div data-options="region:\'east\',iconCls:\'icon-reload\',title:\'已选教师\',split:true" style="width:250px; border: 0px;"><table id="selectedlist" toolbar="#toolbar2"></table></div>' +
                        '<div data-options="region:\'west\',title:\'部门列表\',split:true" style="width:250px;"><ul id="deptree"></ul></div>' +
                        '<div data-options="region:\'center\'" style=" border: 0px;"><table id="teacherlist" toolbar="#toolbar1"></table><div style="float:left"><input type="button" value="全选"/></div></div>' +
                      '</div>';

        var hDialog = top.jQuery.hDialog({
            title: '筛选教师', width: 970, height: 500,
            content: content,
            iconCls: 'icon-set1'
        });

        top.$('#deptree').tree({
            lines: true,
            url: actionURL + '?' + createParam('dept', 0),
            id: 'id',
            text: 'text',
            animate: true,
            onClick: function (node) {
                var depId = node.id;
                var children = top.$('#deptree').tree('getChildren', node.target);
                // alert(children.length);
                var arr = [];
                arr.push(depId);
                for (var i = 0; i < children.length; i++) {
                    arr.push(children[i].id);
                }

                var strDepIds = arr.join(',');
                var filterObj = { "groupOp": "AND", "rules": [{ "field": "DepartmentId", "op": "in", "data": strDepIds }] };
                top.$('#teacherlist').datagrid('load', { filter: JSON.stringify(filterObj) });
            }
        });

        top.$('#teacherlist, #selectedlist').datagrid({
            height: 392,
            idField: 'KeyId',
            singleSelect: true,
            striped: true,
            columns: [[
                { title: '姓名', field: 'TrueName', width: 225, sortable: true }
            ]],
            pagination: false,
            sortName: 'TrueName'
        });

        top.$('#teacherlist').datagrid({
            width: 250,
            height: 420,
            title: '可选教师',
            url: actionURL + '?' + createParam('users', 0),
            onDblClickRow: function (rowIndex, rowData) {
                var _row = top.$('#teacherlist').datagrid('getSelected');
                if (_row) {
                    var hasName = false;
                    var names = top.$('#selectedlist').datagrid('getRows');
                    $.each(names, function (i, n) {
                        if (n.TrueName == _row.TrueName) {
                            hasName = true;
                        }
                    });
                    if (!hasName) {
                        top.$('#selectedlist').datagrid('appendRow', _row);
                    }
                }
            }
        });
    }
}