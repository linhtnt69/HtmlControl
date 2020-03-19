<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Print preview</title>
    <meta charset="utf-8" />

    <link href="contents/style.css" rel="stylesheet" />
    <link href="contents/checkbox.css" rel="stylesheet" />
    <link href="contents/dropdown.css" rel="stylesheet" />
    <link href="contents/print-preview.css" rel="stylesheet" />

    <script src="scripts/jquery.js"></script>
    <script src="scripts/_local.js"></script>
    <script src="scripts/checkbox.js"></script>
    <script src="scripts/dropdown.js"></script>
    <script src="scripts/print-preview.js"></script>
</head>
<body style="margin: 0;">
    <form id="form1" runat="server">
        <div class="print">
            <div class="setting">
                <div class="head">
                    Print preview
                </div>
                <div class="body">
                    <div class="line">
                        <label class="title">Type</label>
                        <div class="dropdown type">
                            <span class="item active" data-value="print">System print</span>
                            <div class="items">
                                <span class="item" data-value="excel">Save as Excel</span>
                                <span class="item" data-value="pdf">Save as Pdf</span>
                                <span class="item active" data-value="print">System print</span>
                            </div>
                        </div>
                    </div>
                    <div class="line">
                        <label class="title">Layout</label>
                        <div class="dropdown layout">
                            <span class="item active" data-value="portrait">Portrait</span>
                            <div class="items">
                                <span class="item active" data-value="portrait">Portrait</span>
                                <span class="item" data-value="landscape">Landscape</span>
                            </div>
                        </div>
                    </div>
                    <div class="line">
                        <label class="title">Page size</label>
                        <div class="dropdown page-size">
                            <span class="item active" data-value="A4">A4</span>
                            <div class="items">
                                <span class="item" data-value="A3">A3</span>
                                <span class="item active" data-value="A4">A4</span>
                                <span class="item" data-value="A5">A5</span>
                            </div>
                        </div>
                    </div>
                    <div class="line">
                        <label class="title">Pages</label>
                        <div class="checkbox circle pages">
                            <div class="item active" data-group="pages">All</div>
                            <div class="item" data-group="pages">
                                <input class="pp-input indexs" placeholder="e.g. 1-5, 8, 11-13" />
                            </div>
                        </div>
                    </div>
                    <div class="line">
                        <label class="title">Options</label>
                        <div class="checkbox options">
                            <div class="item show-header">Show header</div>
                            <div class="item show-footer">Show footer</div>
                        </div>
                    </div>
                </div>
                <div class="foot">
                    <div class="pp-f-right">
                        <asp:Button ID="btnPrint" runat="server" Text="Print" CssClass="pp-btn pp-btn-blue pp-btn-print" OnClick="btnPrint_Click" />
                        <a href="javascript:void(0);" class="pp-btn pp-btn-cancel">Cancel</a>
                    </div>
                </div>
            </div>
            <div class="preview">
                <div class="border">
                    <div class="content" data-size="A4">
                        <div class="head">
                            <div class="left"><%= DateTime.Now.ToString("dd-MM-yyyy") %></div>
                            <div class="right"></div>
                        </div>
                        <div runat="server" id="divPrint" class="body"></div>
                        <div class="foot">
                            <div class="left">Foot left</div>
                            <div class="right"></div>
                        </div>
                    </div>
                </div>
                <div class="border-top"></div>
                <div class="border-left"></div>
                <div class="border-right"></div>
                <div class="border-bottom"></div>
            </div>
        </div>
    </form>
</body>
</html>
