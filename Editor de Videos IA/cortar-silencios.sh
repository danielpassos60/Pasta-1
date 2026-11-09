#!/usr/bin/env bash
# Uso: ./cortar-silencios.sh "Material Bruto/video.mp4"
in="$1"; out="Videos Prontos/$(basename "${in%.*}")_cortado.mp4"
ffmpeg -y -i "$in" -af "silenceremove=start_periods=1:stop_periods=-1:stop_duration=0.4:stop_threshold=-35dB" -vf "select='1',setpts=N/FRAME_RATE/TB" "$out" 2>/dev/null \
 || ffmpeg -y -i "$in" -af "silenceremove=stop_periods=-1:stop_duration=0.4:stop_threshold=-35dB" "$out"
whisper "$out" --language pt --output_format srt --output_dir "Videos Prontos"
echo "Pronto: $out"
