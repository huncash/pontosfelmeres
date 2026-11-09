Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap 1200, 630
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([System.Drawing.Color]::FromArgb(247, 250, 248))
$accent = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(12, 74, 62))
$ink = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(20, 33, 28))
$muted = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(62, 82, 73))
$copper = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(138, 70, 48))
$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(12, 74, 62), 3)
$g.FillRectangle($accent, 0, 0, 18, 630)
$kickerFont = New-Object System.Drawing.Font "Segoe UI", 15
$titleFont = New-Object System.Drawing.Font "Palatino Linotype", 42
$subFont = New-Object System.Drawing.Font "Segoe UI", 20
$footFont = New-Object System.Drawing.Font "Segoe UI", 16
$kicker = "MEGL$([char]0x00C9)V$([char]0x0150) $([char]0x00C1)LLAPOTFELM$([char]0x00C9)R$([char]0x00C9)S"
$title1 = "Tervez$([char]0x00E9)shez haszn$([char]0x00E1)lhat$([char]0x00F3)"
$title2 = "megl$([char]0x00E9)v$([char]0x0151) $([char]0x00E1)llapotfelm$([char]0x00E9)r$([char]0x00E9)s"
$sub = "Pontfelh$([char]0x0151), alaprajz $([char]0x00E9)s a tervez$([char]0x0151)vel egyeztetett dokument$([char]0x00E1)ci$([char]0x00F3)."
$foot = "pontosfelmeres.hu    ADP-TOP Kft."
$g.DrawString($kicker, $kickerFont, $copper, 72, 148)
$g.DrawString($title1, $titleFont, $ink, 68, 188)
$g.DrawString($title2, $titleFont, $ink, 68, 248)
$g.DrawString($sub, $subFont, $muted, 72, 340)
$g.DrawString($foot, $footFont, $accent, 72, 540)
$g.DrawRectangle($pen, 820, 160, 280, 190)
$g.DrawLine($pen, 960, 160, 960, 350)
$g.DrawLine($pen, 820, 250, 960, 250)
$g.DrawArc($pen, 900, 220, 80, 80, 180, 90)
$out = Join-Path (Get-Location) "public\images\og.png"
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Output "og-ok"
