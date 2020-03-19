<%@ Page Title="" Language="VB" MasterPageFile="~/Pages/MasterPage.master" AutoEventWireup="false" CodeFile="ExtFile.aspx.vb" Inherits="Pages_ExtFile" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphBodyContent" runat="Server">
    <link href="../Content/css-extend.file.css" rel="stylesheet" />
    <script src="../Scripts/js-extend.file.js"></script>

    <div style="position: relative; float: left; padding: 10px; width: calc(100% - 20px); height: calc(100% - 20px);">
        <div class="file-test"></div>
    </div>

    <script>
        $('.file-test').extFile({
            multiple: true,
            display: $.ext.file.displays.horizontal,
            displayIcons: { remove: true, setHeader: true, upload: true },
            displayInfo: true,
            viewInModal: true
        });
    </script>
</asp:Content>

