#!/usr/bin/env bash
# ==============================================================================
# Cloudflare R2 Video Encoding Pipeline for christopherfrendo.com
# ==============================================================================
# Converts high-bitrate ProRes / H.264 master files into:
#   1. 1080p web-optimized MP4 (~5-8 Mbps, -movflags +faststart for instant play)
#   2. 4-second muted 720p hover preview loop (~500KB)
#   3. High-res WebP poster frame
#
# Usage:
#   ./scripts/transcode-videos.sh ./raw_masters ./r2_upload_ready
# ==============================================================================

set -euo pipefail

INPUT_DIR="${1:-./raw_masters}"
OUTPUT_DIR="${2:-./r2_upload_ready}"

mkdir -p "$OUTPUT_DIR/masters" "$OUTPUT_DIR/loops" "$OUTPUT_DIR/thumbs"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Error: ffmpeg is not installed. Install via 'brew install ffmpeg'."
  exit 1
fi

shopt -s nullglob
FILES=("$INPUT_DIR"/*.{mov,mp4,m4v,MOV,MP4})

if [ ${#FILES[@]} -eq 0 ]; then
  echo "No source videos found in $INPUT_DIR"
  echo "Place your .mov or .mp4 masters in $INPUT_DIR and re-run."
  exit 0
fi

for INPUT_FILE in "${FILES[@]}"; do
  BASENAME="$(basename "$INPUT_FILE")"
  SLUG="${BASENAME%.*}"

  echo "----------------------------------------------------------------"
  echo "Processing: $BASENAME -> $SLUG"
  echo "----------------------------------------------------------------"

  # 1. Master 1080p Web Spot (~5-8 Mbps, faststart enabled)
  ffmpeg -y -i "$INPUT_FILE" \
    -vf "scale=-2:1080" \
    -c:v libx264 -crf 20 -preset slow \
    -c:a aac -b:a 192k \
    -movflags +faststart \
    "$OUTPUT_DIR/masters/${SLUG}-1080p.mp4"

  # 2. 4-Second Muted Hover Preview Loop (720p, tiny file size ~500KB)
  ffmpeg -y -ss 00:00:02 -t 4 -i "$INPUT_FILE" \
    -vf "scale=-2:720,fps=24" \
    -c:v libx264 -crf 26 -an \
    -movflags +faststart \
    "$OUTPUT_DIR/loops/${SLUG}-loop.mp4"

  # 3. High-Res WebP Poster Frame
  ffmpeg -y -ss 00:00:03 -i "$INPUT_FILE" \
    -frames:v 1 -q:v 80 \
    "$OUTPUT_DIR/thumbs/${SLUG}.webp"

  echo "Done: $SLUG"
done

echo "All videos transcoded into $OUTPUT_DIR/{masters,loops,thumbs}"
