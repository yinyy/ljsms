var actionURL = '/TM/ashx/TMDocumentHandler.ashx';
var actionDIC = '/sys/ashx/DicHandler.ashx';
var formurl = '/TM/html/TMDocument.html';
var tagUrl = '/TM/html/TMDocumentTag.html';

$(function () {

    autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height: 0 });

    $('#a_add').click(CRUD.add);
    $('#a_delete').click(CRUD.del);
    $('#a_tag').click(CRUD.tag);

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
                    }},
			 {
			     title: '大小', field: 'Size', width: 100, align: 'right', formatter: function (value, row, index) {
			         if (value > 1024 * 1024) {
			             return (value / 1024 / 1024).toFixed(2) + 'MB';
			         } else {
			             return (value / 1024).toFixed(2) + 'KB';
			         }
			     }},
		    { title: '上传时间', field: 'Created', width: 150, align: 'center' },
            { title: '标签', field: 'Tag', width: 400 },
		    {
		        title: '操作', field: 'FileUrl', width: 80, align: 'center', formatter: function (value, row, index) {
		            return '<a href="' + value + '" target="_blank">下载</a>';
		        }
		    }
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


var CRUD = {
    add: function () {
        var hDialog = top.jQuery.hDialog({
            title: '添加', width: 500, height: 360, href: formurl, iconCls: 'icon-add',
            buttons: [{
                text: '关闭', iconCls: 'icon-delete2', handler: function () {
                    hDialog.dialog('close');
                }
            }],
            onLoad: function () {
                var uploader = new plupload.Uploader({
                    runtimes: 'html5,flash,silverlight,html4',
                    browse_button: top.$('#txt_Choose').get(0), // you can pass in id...
                    container: 'container2', // ... or DOM Element itself
                    url: actionURL + '?' + createParam('upload', 0),
                    flash_swf_url: '/scripts/plupload-2.1.2/js/Moxie.swf',
                    silverlight_xap_url: '/scripts/plupload-2.1.2/js/Moxie.xap',

                    filters: {
                        max_file_size: '10mb',
                        mime_types: [
                            { title: "图像文件", extensions: "jpg,gif,png" },
                            { title: "压缩文件", extensions: "zip,rar" },
                            { title: "办公文件", extensions: "doc,docx,xls,xlsx,ppt,pptx" }
                        ]
                    },

                    init: {
                        PostInit: function () {
                            top.$('#filelist').html('');
                            top.$('#txt_Upload').click(function () {
                                uploader.start();
                                return false;
                            });
                        },

                        FilesAdded: function (up, files) {
                            plupload.each(files, function (file) {
                                top.$('#filelist').html(top.$('#filelist').html() + '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>');
                            });
                        },

                        UploadProgress: function (up, file) {
                            top.$('#' + file.id).children('b').html('<span>' + file.percent + "%</span>");
                            if (file.percent >= 100) {
                                grid.reload();
                            }
                        },

                        Error: function (up, err) {
                            top.$('#console').html(top.$('#console').html() + "\nError #" + err.code + ": " + err.message);
                        }
                    }
                });

                uploader.init();
            }
        });
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
    },
    tag: function () {
        var row = grid.getSelectedRow();
        if (row) {
            var hDialog = top.jQuery.hDialog({
                title: '添加', width: 600, height: 455, href: tagUrl, iconCls: 'icon-add', onLoad: function () {
                    //公共标签库id：25
                    //获取公共标签库
                    $.getJSON(actionDIC + '?categoryId=25', function (json) {
                        var ul = top.$('<ul style="padding: 0px; margin: 0px; list-style: none; height: 192px; overflow: hidden;"></ul>')
                        top.$('#PublicTagsContainer').append(ul);

                        $(json).each(function (index, o) {
                            var chk = top.$('<li style="float: left;"><input type="checkbox" value="' + o.Title + '" id="chk' + o.KeyId + '" style="margin-left: 10px;"/><label for="chk' + o.KeyId + '">' + o.Title + '</label></li>');
                            ul.append(chk);
                        });

                        //开始分解tag
                        $(row.Tag.split(' ')).each(function (index, t) {
                            var pt = ul.children().children(":checkbox[value='" + t.replace('\'', '\\\'').replace('\"', '\\\"') + "']");
                            
                            if(pt.size()>0){
                                pt.attr('checked', 'checked');
                            }else{
                                top.$('#PrivateTags').text((top.$('#PrivateTags').text() + ' ' + t).trim());
                            }
                        });
                    });
                }, submit: function () {
                    //把所有的标签都找出来
                    var tags = [];
                    top.$('#PublicTagsContainer').children().children().children(':checked').each(function (index, chk) {
                        tags[tags.length] = chk.value;
                    });

                    //使用正则表达式把自定义标签中的多个空白换成一个空白
                    var pts = top.$('#PrivateTags').text().trim().replace(/\s+/g, ' ');
                    if (pts != '') {
                        $(pts.split(' ')).each(function (index, t) {
                            tags[tags.length] = t;
                        });
                    }

                    tags = tags.join(' ').trim();

                    top.$.post(actionURL, { json: JSON.stringify({ action: 'tag', keyid: row.KeyId }), tags: tags }, function (d) {
                        if (parseInt(d) > 0) {
                            msg.ok('标签保存成功！');
                            hDialog.dialog('close');
                            grid.reload();
                        } else {
                            MessageOrRedirect(d);
                        }
                    }, 'text');
                }
            });
        } else {
            msg.warning('请选择要设定标签的行。')
        }
    }
};

