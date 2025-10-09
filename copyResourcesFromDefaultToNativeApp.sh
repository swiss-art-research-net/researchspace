# Fix: let the glob in resourcesToCopy.txt expand; pre-create dest dirs.

#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob dotglob

DEFAULTPATH=src/main/resources/org/researchspace/apps/default
NATIVEPATH=src/main/resources/org/researchspace/apps/native
FILELIST="resourcesToCopy.txt"

TOTAL_FILES=$(wc -l < "$FILELIST")
CURRENT_FILE=0

while IFS= read -r FILE; do
  ((CURRENT_FILE++))
  echo "Processing file $CURRENT_FILE of $TOTAL_FILES: $FILE"

  # Expand potential globs from the list (e.g., ...%2F*)
  srcs=( "$DEFAULTPATH"/$FILE )
  if (( ${#srcs[@]} == 0 )); then
    echo "  No match for: $FILE"
    continue
  fi

  mkdir -p "$NATIVEPATH/$(dirname "$FILE")"
  rsync -au "${srcs[@]}" "$NATIVEPATH/$(dirname "$FILE")/"
done < "$FILELIST"