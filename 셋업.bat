<# :
@echo off
chcp 65001 >nul
title MemoryOn - Image Auto-Crop and Sound Pack Builder
echo ============================================================================
echo  [MemoryOn] 5대 디자인 팩 이미지 투명화/크롭 및 35종 WAV 음원 생성기
echo ============================================================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-Expression ([System.IO.File]::ReadAllText('%~f0', [System.Text.Encoding]::UTF8))"
echo.
pause
exit /b
#>

$ErrorActionPreference = 'Stop'
$root = Get-Location
$packs = @('strawberry_milk', 'pastel_macaron', 'gummy_bear_jelly', 'choco_cookie_cafe', 'royal_orchestra')

$csCode = @'
using System;
using System.IO;
using System.Text;
using System.Drawing;
using System.Drawing.Imaging;

public class MemoryOnPackBuilder {
    // 1. 흰색 배경을 투명하게 지우고 알맹이만 딱 맞게 자동 크롭(Auto-Trim)하는 C# 이미지 프로세서
    public static void AutoCropWhiteBg(string srcPath, string dstPath) {
        if (!File.Exists(srcPath)) return;
        byte[] bytes = File.ReadAllBytes(srcPath);
        using (MemoryStream ms = new MemoryStream(bytes))
        using (Bitmap orig = new Bitmap(ms)) {
            int w = orig.Width;
            int h = orig.Height;
            Bitmap bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);
            using (Graphics g = Graphics.FromImage(bmp)) {
                g.DrawImage(orig, 0, 0, w, h);
            }

            bool[,] visited = new bool[w, h];
            int[] qx = new int[w * h];
            int[] qy = new int[w * h];
            int head = 0, tail = 0;

            Action<int, int> pushIfBg = (x, y) => {
                if (x < 0 || x >= w || y < 0 || y >= h) return;
                if (visited[x, y]) return;
                Color c = bmp.GetPixel(x, y);
                if (c.A < 25) {
                    visited[x, y] = true;
                    qx[tail] = x; qy[tail] = y; tail++;
                    return;
                }
                int maxC = Math.Max(c.R, Math.Max(c.G, c.B));
                int minC = Math.Min(c.R, Math.Min(c.G, c.B));
                int chroma = maxC - minC;
                double luma = 0.299 * c.R + 0.587 * c.G + 0.114 * c.B;
                if (luma > 234 && chroma < 26) {
                    visited[x, y] = true;
                    qx[tail] = x; qy[tail] = y; tail++;
                }
            };

            for (int x = 0; x < w; x++) { pushIfBg(x, 0); pushIfBg(x, h - 1); }
            for (int y = 0; y < h; y++) { pushIfBg(0, y); pushIfBg(w - 1, y); }

            while (head < tail) {
                int cx = qx[head];
                int cy = qy[head];
                head++;
                bmp.SetPixel(cx, cy, Color.FromArgb(0, 255, 255, 255));
                pushIfBg(cx + 1, cy);
                pushIfBg(cx - 1, cy);
                pushIfBg(cx, cy + 1);
                pushIfBg(cx, cy - 1);
            }

            int minX = w, minY = h, maxX = 0, maxY = 0;
            for (int y = 0; y < h; y++) {
                for (int x = 0; x < w; x++) {
                    if (bmp.GetPixel(x, y).A > 30) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            if (maxX > minX && maxY > minY) {
                int pad = 4;
                int rx = Math.Max(0, minX - pad);
                int ry = Math.Max(0, minY - pad);
                int rw = Math.Min(w - rx, (maxX - minX + 1) + pad * 2);
                int rh = Math.Min(h - ry, (maxY - minY + 1) + pad * 2);
                using (Bitmap cropped = bmp.Clone(new Rectangle(rx, ry, rw, rh), PixelFormat.Format32bppArgb)) {
                    cropped.Save(dstPath, ImageFormat.Png);
                }
            } else {
                bmp.Save(dstPath, ImageFormat.Png);
            }
            bmp.Dispose();
        }
    }

    // 2. 고음질 스테레오 콘서트홀 WAV 생성기
    public static void WriteWav(string path, double[] freqs, double dur, string timbre) {
        if (freqs == null || freqs.Length == 0) freqs = new double[] { 440.0 };
        int sr = 44100;
        int totalSamples = (int)(sr * dur);
        int dataSize = totalSamples * 4;
        int nCount = freqs.Length;

        double[] bufL = new double[totalSamples];
        double[] bufR = new double[totalSamples];

        for (int i = 0; i < totalSamples; i++) {
            double t = (double)i / sr;
            double vL = 0.0, vR = 0.0;
            for (int k = 0; k < nCount; k++) {
                double delay = k * 0.048;
                if (t >= delay) {
                    double lt = t - delay;
                    double f = freqs[k];
                    double decayRate = (timbre == "orchestra") ? 2.8 : 4.2;
                    double attackRate = (timbre == "orchestra") ? 45.0 : 180.0;
                    double env = Math.Exp(-lt * Math.Max(1.5, decayRate - k * 0.2)) * (1.0 - Math.Exp(-lt * attackRate));

                    double w1 = Math.Sin(2.0 * Math.PI * f * lt);
                    double w2 = 0.45 * Math.Sin(2.0 * Math.PI * (f * 2.0) * lt);
                    double w3 = 0.22 * Math.Sin(2.0 * Math.PI * (f * 3.0) * lt);
                    double w4 = 0.16 * Math.Sin(2.0 * Math.PI * (f * 1.0035) * lt);
                    double w5 = 0.10 * Math.Sin(2.0 * Math.PI * (f * 4.0) * lt);

                    if (timbre == "musicbox") { w2 *= 1.35; w5 *= 1.8; }
                    else if (timbre == "orchestra") { w3 *= 1.6; w4 *= 2.4; }
                    else if (timbre == "harp") { w2 *= 1.25; w3 *= 0.8; }

                    double sig = (w1 + w2 + w3 + w4 + w5) * env / Math.Sqrt(nCount * 1.8);
                    double pan = Math.Max(0.1, Math.Min(0.9, 0.5 + ((k - (nCount - 1) / 2.0) * 0.15)));
                    vL += sig * (1.0 - pan * 0.4);
                    vR += sig * (0.6 + pan * 0.4);
                }
            }
            bufL[i] = vL; bufR[i] = vR;
        }

        int d1 = (int)(sr * 0.065), d2 = (int)(sr * 0.115), d3 = (int)(sr * 0.185);
        for (int i = 0; i < totalSamples; i++) {
            if (i >= d1) { bufL[i] += bufR[i - d1] * 0.22; bufR[i] += bufL[i - d1] * 0.22; }
            if (i >= d2) { bufL[i] += bufL[i - d2] * 0.15; bufR[i] += bufR[i - d2] * 0.15; }
            if (i >= d3) { bufL[i] += bufR[i - d3] * 0.10; bufR[i] += bufL[i - d3] * 0.10; }
        }

        using (FileStream fs = new FileStream(path, FileMode.Create, FileAccess.Write))
        using (BinaryWriter bw = new BinaryWriter(fs)) {
            bw.Write(Encoding.ASCII.GetBytes("RIFF"));
            bw.Write((int)(36 + dataSize));
            bw.Write(Encoding.ASCII.GetBytes("WAVEfmt "));
            bw.Write((int)16); bw.Write((short)1); bw.Write((short)2);
            bw.Write((int)sr); bw.Write((int)(sr * 4)); bw.Write((short)4); bw.Write((short)16);
            bw.Write(Encoding.ASCII.GetBytes("data"));
            bw.Write((int)dataSize);
            for (int i = 0; i < totalSamples; i++) {
                short sL = (short)(Math.Max(-0.98, Math.Min(0.98, bufL[i] * 0.72)) * 32760);
                short sR = (short)(Math.Max(-0.98, Math.Min(0.98, bufR[i] * 0.72)) * 32760);
                bw.Write(sL); bw.Write(sR);
            }
        }
    }
}
'@

Add-Type -TypeDefinition $csCode -ReferencedAssemblies 'System.Drawing'

foreach ($p in $packs) {
    $pDir = Join-Path $root ("packs\" + $p)
    $aDir = Join-Path $pDir "assets"
    $sDir = Join-Path $pDir "sounds"

    if (!(Test-Path $aDir)) { New-Item -ItemType Directory -Force -Path $aDir | Out-Null }
    if (!(Test-Path $sDir)) { New-Item -ItemType Directory -Force -Path $sDir | Out-Null }

    # 만약 탐색기 확장자 숨김 때문에 icon.png.png 등으로 저장된 파일이 있으면 자동 교정
    Get-ChildItem -Path $pDir -File -ErrorAction SilentlyContinue | ForEach-Object {
        if ($_.Name -match '^(icon|bg_pattern|mask_red|mask_cloze)\.(png|jpg|jpeg)\.(png|jpg|jpeg)$') {
            $cleanName = $matches[1] + ".png"
            Move-Item $_.FullName (Join-Path $pDir $cleanName) -Force
        }
    }

    Write-Host ("🖼️ [" + $p + "] 이미지 에셋 흰색 여백 투명화 & 자동 크롭 중...") -ForegroundColor Yellow

    foreach ($baseName in @('icon', 'bg_pattern', 'mask_red', 'mask_cloze')) {
        $targetFile = $baseName + ".png"
        $foundPath = $null

        foreach ($cand in @(
            (Join-Path $pDir ($baseName + ".png")),
            (Join-Path $pDir ($baseName + ".jpg")),
            (Join-Path $aDir ($baseName + ".png")),
            (Join-Path $aDir ($baseName + ".jpg"))
        )) {
            if (Test-Path $cand) { $foundPath = $cand; break }
        }

        if ($foundPath) {
            $dstRoot = Join-Path $pDir $targetFile
            $dstAsset = Join-Path $aDir $targetFile
            if ($baseName -eq 'bg_pattern') {
                if ($foundPath -ne $dstRoot) { Copy-Item $foundPath $dstRoot -Force }
                Copy-Item $dstRoot $dstAsset -Force
            } else {
                [MemoryOnPackBuilder]::AutoCropWhiteBg($foundPath, $dstRoot)
                Copy-Item $dstRoot $dstAsset -Force
            }
            Write-Host ("   ✔ " + $targetFile + " 적용 완료") -ForegroundColor Gray
        } else {
            Write-Host ("   ⚠️ " + $targetFile + " 파일을 찾을 수 없습니다 (" + $pDir + ")") -ForegroundColor Red
        }
    }
}

$configs = @{
    'strawberry_milk'   = @{ t = 'musicbox';  b = 523.25 }
    'pastel_macaron'    = @{ t = 'harp';      b = 587.33 }
    'gummy_bear_jelly'  = @{ t = 'marimba';   b = 659.25 }
    'choco_cookie_cafe' = @{ t = 'rhodes';    b = 440.00 }
    'royal_orchestra'   = @{ t = 'orchestra'; b = 392.00 }
}

foreach ($p in $packs) {
    $sDir = Join-Path $root ("packs\" + $p + "\sounds")
    $cfg = $configs[$p]
    [double]$b = $cfg.b
    [string]$tm = $cfg.t

    Write-Host ("🎵 [" + $p + "] 7종 콘서트홀 스테레오 WAV 생성 중...") -ForegroundColor Cyan

    [MemoryOnPackBuilder]::WriteWav((Join-Path $sDir 'click.wav'),  [double[]]@($b * 1.5), 0.18, $tm)
    [MemoryOnPackBuilder]::WriteWav((Join-Path $sDir 'reveal.wav'), [double[]]@($b, ($b * 1.25), ($b * 1.5)), 0.60, $tm)
    [MemoryOnPackBuilder]::WriteWav((Join-Path $sDir 'flip.wav'),   [double[]]@(($b * 0.75), $b, ($b * 1.25)), 0.42, $tm)
    [MemoryOnPackBuilder]::WriteWav((Join-Path $sDir 'again.wav'),  [double[]]@(($b * 0.5), ($b * 0.6)), 0.70, $tm)
    [MemoryOnPackBuilder]::WriteWav((Join-Path $sDir 'hard.wav'),   [double[]]@(($b * 0.75), ($b * 0.89), $b), 0.65, $tm)
    [MemoryOnPackBuilder]::WriteWav((Join-Path $sDir 'good.wav'),   [double[]]@($b, ($b * 1.25), ($b * 1.5), ($b * 1.875)), 0.90, $tm)
    [MemoryOnPackBuilder]::WriteWav((Join-Path $sDir 'easy.wav'),   [double[]]@($b, ($b * 1.25), ($b * 1.5), ($b * 2.0), ($b * 2.5)), 1.25, $tm)
}

Write-Host ""
Write-Host "🎉 모든 이미지 투명 크롭 및 35개 고음질 WAV 생성이 완벽히 끝났습니다!" -ForegroundColor Green
