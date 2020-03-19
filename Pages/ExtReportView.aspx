<%@ Page Title="" Language="C#" MasterPageFile="~/Pages/MasterPage.master" AutoEventWireup="true" CodeFile="ExtReportView.aspx.cs" Inherits="Pages_ExtReportView" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphBodyContent" runat="Server">
    <link href="/Content/css-extend.table.css" rel="stylesheet" />
    <script src="/Scripts/js-extend.table.js"></script>

    <div class="table-test"></div>

    <script>

        var $tableTest = $('.table-test').extTable({
            autoLoadOnReady: true,
            autoRender: true,
            ajaxRead: { url: '/Pages/ExtTable.aspx/Read' },
            columns: [
                { dataField: 'A', headText: 'Head A', className: 'w-150' },
                { dataField: 'B', headText: 'Head B', className: 'w-200' },
                { dataField: 'C', headText: 'Head C', className: 'w-150' },
                {
                    dataField: 'D', headText: 'Head D', className: 'w-200',
                    dataHtml: function (data) {
                        return 'Render ' + data['D'] + ' sdfsdf sdfsdfsdf';
                    }
                },
                { dataField: 'E', headText: 'Head E', className: 'w-500' },
                { dataField: 'F', headText: 'Head F', className: 'w-500' },
                { dataField: 'G', headText: 'Head G', className: 'w-150' },
                { dataField: 'H', headText: 'Head H', className: 'w-200' },
                { dataField: 'I', headText: 'Head I', className: 'w-150' }
            ],
            groups: [
                { from: 2, to: 3, text: 'Group C-D' },
                { from: 4, to: 5, text: 'Group E-F' },
                { from: 6, to: 8, text: 'Group G-H-I' }
            ],
            fixeds: { columns: { lefts: [0, 1, 2], rights: [8] }, head: true, height: 600 },
            paging: { sizes: { start: 12 } }
        });

    </script>
</asp:Content>
