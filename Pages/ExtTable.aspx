<%@ Page Title="" Language="C#" MasterPageFile="~/Pages/MasterPage.master" AutoEventWireup="true" CodeFile="ExtTable.aspx.cs" Inherits="Pages_ExtTable" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphBodyContent" runat="Server">
    <link href="/Content/css-extend.table.css" rel="stylesheet" />
    <script src="/Scripts/js-extend.table.js"></script>

    <div class="table-test"></div>

    <script>

        var $tableTest = $('.table-test').extTable({
            autoLoadOnReady: true,
            autoRender: true,
            ajaxCreate: {
                url: '/Pages/ExtTable.aspx/Create',
                createParam: function (data) {
                    return { newData: data };
                }
            },
            ajaxDelete: {
                url: '/Pages/ExtTable.aspx/Delete',
                createParam: function (data) {
                    return { key: data['Key'] };
                }
            },
            ajaxUpdate: {
                url: '/Pages/ExtTable.aspx/Update',
                createParam: function (data) {
                    return { key: data['Key'], newData: data };
                }
            },
            ajaxRead: { url: '/Pages/ExtTable.aspx/Read' },
            columns: [
                { dataField: 'A', headText: 'Head A', className: 'w-150' },
                { dataField: 'B', headText: 'Head B', className: 'w-200' },
                { dataField: 'C', headText: 'Head C', className: 'w-150' },
                { dataField: 'D', headText: 'Head D', className: 'w-200', dataHtml: function (data) { return 'Render ' + data['D'] + ' sdfsdf sdfsdfsdf sdfdsfs sdfdsfds sadff'; } },
                { dataField: 'E', headText: 'Head E', className: 'w-500' },
                { dataField: 'F', headText: 'Head F', className: 'w-500' },
                { dataField: 'G', headText: 'Head G', className: 'w-150' },
                { dataField: 'H', headText: 'Head H', className: 'w-200' },
                { dataField: 'I', headText: 'Head I', className: 'w-150' },
                {
                    headText: '#', className: 'w-50 txt-center',
                    dataHtml: function (data) {
                        return '<a href="javascript:void(0);" class="btn btn-red" data-key="' + data['Key'] + '" onclick="$tableTest.deleteRowOf(this);"><i class="fa fa-trash"></i></a>';
                    }
                }
            ],
            fixeds: { columns: { lefts: [0, 1], rights: [9] }, head: true, height: 600 },
            paging: { sizes: { start: 12 } },
            sorting: {
                columns: [0, 1, 4],
                fields: { 4: 'F' },
                defaults: { 1: 'asc' }
            },
            rows: {
                edit: {
                    inline: true, modal: false,
                    templates: {
                        0: { design: function () { return '<input type="text" />'; }, useForUpdate: true },
                        1: { design: function () { return '<input type="text" />'; }, useForUpdate: true },
                        2: { design: function () { return '<input type="text" />'; }, useForUpdate: true },
                        3: { design: function () { return '<textarea></textarea>'; }, useForUpdate: true }
                    }
                }
            }
        });

    </script>
</asp:Content>
