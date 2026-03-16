$dirs = @(
  "d:\CollageProject\AWT\Student_Project\SPMSMSMSMSMMSMSMSMSM\spms_project_hub\components",
  "d:\CollageProject\AWT\Student_Project\SPMSMSMSMSMMSMSMSMSM\spms_project_hub\app"
)

$files = Get-ChildItem -Path $dirs -Recurse -Include "*.tsx"

foreach ($file in $files) {
  try {
    $lines = Get-Content -Path $file.FullName
    $content = $lines -join "`r`n"
    $old = $content
    $content = $content.Replace('bg-blue-500/100', 'bg-blue-500')
    $content = $content.Replace('bg-cyan-500/100', 'bg-cyan-500')
    $content = $content.Replace('bg-red-500/100', 'bg-red-500')
    $content = $content.Replace('bg-amber-500/100', 'bg-amber-500')
    $content = $content.Replace('bg-orange-500/100', 'bg-orange-500')
    $content = $content.Replace('bg-purple-500/100', 'bg-purple-500')
    if ($content -ne $old) {
      $content | Set-Content -Path $file.FullName -NoNewline
      Write-Host "Fixed: $($file.Name)"
    }
  } catch {}
}

Write-Host "Done"
