# 设置控制台编码以避免乱码
chcp 65001 > $null
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[System.Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 获取当前脚本所在目录
$BasePath = Split-Path -Parent $MyInvocation.MyCommand.Definition

# 递归获取文件夹和文件
Function Get-Tree {
    param (
        [string]$Path,
        [int]$Indent = 0
    )
    
    # 获取当前目录下的子文件夹和文件
    $Folders = Get-ChildItem -Path $Path -Directory
    $Files = Get-ChildItem -Path $Path -File
    
    # 显示当前目录
    Write-Host (' ' * $Indent + "[DIR] " + (Split-Path $Path -Leaf)) -ForegroundColor Yellow
    
    # 递归显示子文件夹
    foreach ($Folder in $Folders) {
        Get-Tree -Path $Folder.FullName -Indent ($Indent + 2)
    }
    
    # 显示当前目录下的文件
    foreach ($File in $Files) {
        Write-Host (' ' * ($Indent + 2) + "[FILE] " + $File.Name) -ForegroundColor Green
    }
}

# 运行函数
Get-Tree -Path $BasePath

# 防止窗口自动关闭
if ($Host.Name -eq 'ConsoleHost') {
    Write-Host "\n按 Enter 键退出..." -ForegroundColor Cyan
    [void][System.Console]::ReadLine()
}