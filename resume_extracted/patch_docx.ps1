Add-Type -AssemblyName System.IO.Compression.FileSystem
$src = 'C:\Users\AkashSingh\idbi_uat_angular_cordova\jira-auto\AkashSinghResume.docx'
$dst = 'C:\Users\AkashSingh\idbi_uat_angular_cordova\jira-auto\AkashSinghResume_v3.docx'
$updatedXml = 'C:\Users\AkashSingh\idbi_uat_angular_cordova\jira-auto\resume_extracted\word\document.xml'

Copy-Item $src $dst -Force
$zip = [System.IO.Compression.ZipFile]::Open($dst, 'Update')
$entry = $zip.GetEntry('word/document.xml')
$entry.Delete()
$newEntry = $zip.CreateEntry('word/document.xml')
$stream = $newEntry.Open()
$bytes = [System.IO.File]::ReadAllBytes($updatedXml)
$stream.Write($bytes, 0, $bytes.Length)
$stream.Close()
$zip.Dispose()
Write-Output "DONE"
(Get-Item $dst).Length
