param (
    [string]$audioFilePath
)

Add-Type -AssemblyName presentationCore
$mediaPlayer = New-Object system.windows.media.mediaplayer
$mediaPlayer.Open($audioFilePath)

# Wait a moment for the file to load and read its duration
Start-Sleep -Milliseconds 100
while ($mediaPlayer.NaturalDuration.HasTimeSpan -eq $false) {
    Start-Sleep -Milliseconds 100
}

$mediaPlayer.Play()

# Sleep for the exact duration of the sound file
Start-Sleep -Seconds $mediaPlayer.NaturalDuration.TimeSpan.TotalSeconds
