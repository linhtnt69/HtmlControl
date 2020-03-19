<%@ Page Title="" Language="VB" MasterPageFile="~/Pages/MasterPage.master" AutoEventWireup="false" CodeFile="ExtTreeView.aspx.vb" Inherits="Pages_ExtTreeView" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphBodyContent" runat="Server">
    <link href="../Content/css-extend.treeview.css" rel="stylesheet" />
    <script src="../Scripts/js-extend.treeview.js"></script>

    <div style="position: relative; float: left; padding: 10px; width: calc(100% - 20px); height: calc(100% - 20px);">
        <div class="treeview-test ext-treeview vertical">
            <div class="content">
                <ul>
                    <li>
                        <span class="parent">Root</span>
                        <ul>
                            <li><span>A1</span></li>
                            <li>
                                <span class="parent">B1</span>
                                <ul>
                                    <li><span>B11</span></li>
                                    <li>
                                        <span class="parent">B12</span>
                                        <ul>
                                            <li><span>B121</span></li>
                                            <li>
                                                <span class="parent">B122</span>
                                                <ul>
                                                    <li><span>B1221</span></li>
                                                    <li><span>B1222</span></li>
                                                    <li><span>B1223</span></li>
                                                </ul>
                                            </li>
                                            <li>
                                                <span class="parent">B123</span>
                                                <ul>
                                                    <li><span>B1231</span></li>
                                                    <li><span>B1232</span></li>
                                                    <li><span>B1233</span></li>
                                                </ul>
                                            </li>
                                            <li><span>B124</span></li>
                                        </ul>
                                    </li>
                                    <li><span>B13</span></li>
                                    <li><span>B14</span></li>
                                    <li>
                                        <span class="parent">B15</span>
                                        <ul>
                                            <li><span>B151</span></li>
                                            <li>
                                                <span class="parent">B152</span>
                                                <ul>
                                                    <li><span>B1521</span></li>
                                                    <li><span>B1522</span></li>
                                                    <li><span>B1523</span></li>
                                                </ul>
                                            </li>
                                            <li>
                                                <span class="parent">B153</span>
                                                <ul>
                                                    <li>
                                                        <span class="parent">B153</span>
                                                        <ul>
                                                            <li><span>B1531</span></li>
                                                            <li><span>B1532</span></li>
                                                            <li><span>B1533</span></li>
                                                            <li>
                                                                <span class="parent">B153</span>
                                                                <ul>
                                                                    <li><span>B1531</span></li>
                                                                    <li><span>B1532</span></li>
                                                                    <li><span>B1533</span></li>
                                                                    <li>
                                                                        <span class="parent">B153</span>
                                                                        <ul>
                                                                            <li><span>B1531</span></li>
                                                                            <li><span>B1532</span></li>
                                                                            <li><span>B1533</span></li>
                                                                        </ul>
                                                                    </li>
                                                                </ul>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                    <li><span>B1531</span></li>
                                                    <li><span>B1532</span></li>
                                                    <li><span>B1533</span></li>
                                                    <li>
                                                        <span class="parent">B153</span>
                                                        <ul>
                                                            <li><span>B1531</span></li>
                                                            <li><span>B1532</span></li>
                                                            <li><span>B1533</span></li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li><span>B154</span></li>
                                        </ul>
                                    </li>
                                    <li><span>B16</span></li>
                                </ul>
                            </li>
                            <li><span>C1</span></li>
                            <li><span>D1</span></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <script>
        $(document).ready(function () {
            if ($('.ext-treeview').hasClass('vertical')) {
                $('.ext-treeview.vertical .content > ul').css({ width: '100000px' });
                $('.ext-treeview.vertical .content > ul').css({ width: ($('.ext-treeview.vertical .content > ul > li').totalWidth() + 2) + 'px' });
            }

            var scrollbarWidth = $.scrollbarWidth();
            if ($('.ext-treeview .content').width() > $('.ext-treeview .content')[0].clientWidth) {
                $(document.body).append('\
                    <style>\
                        .ext-treeview:before {\
                            content: "";\
                            position: absolute;\
                            top: 0;\
                            right: ' + scrollbarWidth + 'px;\
                            border-right: 1px solid #6c757d;\
                            width: 1px;\
                            height: 100%;\
                            z-index: 2;\
                        }\
                    </style>\
                ');
            }

            if ($('.ext-treeview .content').height() > $('.ext-treeview .content')[0].clientHeight) {
                $(document.body).append('\
                    <style>\
                        .ext-treeview:after {\
                            content: "";\
                            position: absolute;\
                            left: 0;\
                            bottom: ' + scrollbarWidth + 'px;\
                            border-bottom: 1px solid #6c757d;\
                            width: 100%;\
                            height: 1px;\
                            z-index: 2;\
                        }\
                    </style>\
                ');
            }
        });

    </script>

    <%--<script>
        var $treeView = $('.treeview-test').extTreeView({ allowAdd: true, allowDelete: true });

        $treeView.addRoot({
            fromSource: { "ItemID": 2903, "ItemCode": "2052200002", "ItemName": "Adirondack chair, PAR FSC" },
            displayField: 'ItemCode',
            attrs: [
                { name: 'value', field: 'ItemID' },
                { name: 'text', field: 'ItemCode' },
            ]
        });
    </script>--%>
</asp:Content>

