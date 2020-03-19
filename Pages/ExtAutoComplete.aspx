<%@ Page Title="" Language="C#" MasterPageFile="~/Pages/MasterPage.master" AutoEventWireup="true" CodeFile="ExtAutoComplete.aspx.cs" Inherits="Pages_ExtAutoComplete" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphBodyContent" runat="Server">
    <link href="../Content/css-extend.table.css" rel="stylesheet" />
    <script src="../Scripts/js-extend.table.js"></script>
    <link href="../Content/css-extend.autocomplete.css" rel="stylesheet" />
    <script src="../Scripts/js-extend.autocomplete.js"></script>

    <div class="ac-test"></div>

    <script>

        $('.ac-test').extAutoComplete({
            ajaxRead: { url: '/Pages/ExtTable.aspx/Read' },
            columns: [
                { dataField: 'A', headText: 'Head A', className: 'w-150' },
                { dataField: 'B', headText: 'Head B', className: 'w-200' },
                { dataField: 'C', headText: 'Head C', className: 'w-200', dataHtml: function (data) { return 'Render ' + data['C']; } }
            ],
            fixeds: {
                head: true,
                height: 250
            },
            info: { show: true, format: 'Showing {0} to {1} of {2} entries' },
            paging: { index: 0, sizes: { label: 'Show', start: 12, times: 4 } },
            sorting: {
                columns: [0, 1, 2],
                defaults: { 1: 'desc' }
            }
        });

    </script>
</asp:Content>

