var DetermineOp = {
    actionURL: '/TM/ashx/TMDetermineHandler.ashx',
    get: function (irng, determindId, columns, fn) {
        var range = top.$('#' + irng);
        var table = range.children(':first');
        var tr = $('<tr></tr>');
        table.append(tr);

        var td = $('<td></td>');
        tr.append(td);
        td.html('教师姓名');

        td = $('<td></td>');
        tr.append(td);
        td.html('授课地点');

        td = $('<td></td>');
        tr.append(td);
        td.html('课题');

        var cols = columns.split(',');
        for (var i = 0; i < cols.length; i++) {
            td = $('<td></td>');
            tr.append(td);

            td.html(cols[i]);
        }

        $.post(DetermineOp.actionURL, { json: JSON.stringify({ keyId: determindId, action: 'preview' }) }, function (json) {
            function createTagId(tid, col) {
                return 't' + tid + '_' + col;
            };

            $(json).each(function (index, item) {
                tr = $('<tr></tr>');
                table.append(tr);
                tr.attr('tid', item.TeacherId);

                td = $('<td></td>');
                tr.append(td);
                td.text(item.Teacher_Name);

                td = $('<td></td>');
                tr.append(td);
                td.text(item.Address);

                td = $('<td></td>');
                tr.append(td);
                td.text(item.Course);

                for (var i = 0; i < cols.length; i++) {
                    td = $('<td></td>')
                    tr.append(td);
                    var tt = $('<input type="text" id="' + createTagId(item.TeacherId, i) + '" style="width:80px" value="0"/>');
                    td.append(tt);
                    tt.attr('col', i);

                    //top.$('#' + createTagId(item.TeacherId, i)).numberbox({
                    //    required: true,
                    //    min: 0,
                    //    precision: 0
                    //});
                }
            });

            if (fn != null) {
                fn();
            }
        }, 'json');
    },
    save: function (irng, did, kind, fn) {
        var rows = [];

        top.$('table.question tr').each(function (index1, item) {
            $(item).children().children('input:text').each(function (index2, inp) {
                var row = { DetermineId: did, TeacherId: $(item).attr('tid') };
                row['Col'] = $(inp).attr('col');
                row['Score'] = $(inp).val();
                row['Kind'] = kind;

                rows[rows.length] = row;
            });
        });

        $.post(DetermineOp.actionURL, { json: JSON.stringify({ keyId: did, action: 'save_score' }), data: JSON.stringify(rows), kind: kind }, function (data) {
            if (fn != null) {
                fn(data);
            }
        }, 'text');
    },
    show: function (irng, did, kind) {
        $.post(DetermineOp.actionURL, { json: JSON.stringify({ keyId: did, action: 'show_score' }), kind: kind }, function (data) {
            $(data).each(function (index, d) {
                var id = 't' + d.TeacherId + '_';

                top.$('#' + id + d.Col).val(d.Score);
            });
        }, 'json');
    }
}