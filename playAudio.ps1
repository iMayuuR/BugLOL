# BugLOL Audio Player — Persistent Background Process
# This script stays alive and reads sound file paths from stdin.
# The .NET MediaPlayer is loaded ONCE, eliminating startup delay.

Add-Type -AssemblyName presentationCore
$player = New-Object System.Windows.Media.MediaPlayer

# Signal that we are ready
Write-Output "READY"

# Continuously read file paths from stdin and play them
while ($true) {
    $line = [Console]::In.ReadLine()
    if ($null -eq $line) { break }

    $audioPath = $line.Trim()
    if ($audioPath -eq "" -or $audioPath -eq "EXIT") { break }

    try {
        $player.Stop()
        $player.Close()
        $player.Open([Uri]::new($audioPath))

        # Small wait for media to open (much less than before)
        Start-Sleep -Milliseconds 30

        $player.Play()

        # Wait for playback to finish
        $retries = 0
        while (-not $player.NaturalDuration.HasTimeSpan -and $retries -lt 20) {
            Start-Sleep -Milliseconds 25
            $retries++
        }

        if ($player.NaturalDuration.HasTimeSpan) {
            Start-Sleep -Seconds $player.NaturalDuration.TimeSpan.TotalSeconds
        }
    }
    catch {
        # Silently continue on error
    }

    Write-Output "DONE"
}
