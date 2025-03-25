#!/bin/bash
DEFAULTPATH=src/main/resources/org/researchspace/apps/default
NATIVEPATH=src/main/resources/org/researchspace/apps/native
FILELIST="resourcesToCopy.txt"

# Confirm before emptying the content of the NATIVEPATH directory
echo "WARNING: This will delete all contents of the directory: $NATIVEPATH"
read -p "Are you sure you want to proceed? (y/n): " CONFIRM
if [[ "$CONFIRM" != "y" ]]; then
  echo "Operation canceled."
  exit 1
fi

# Empty the content of the NATIVEPATH directory
rm -rf "${NATIVEPATH:?}"/*
mkdir -p "$NATIVEPATH"

# Count the total number of entries in the FILELIST
TOTAL_FILES=$(wc -l < "$FILELIST")
CURRENT_FILE=0

# Loop through each entry in FILELIST
while IFS= read -r PATTERN; do
  CURRENT_FILE=$((CURRENT_FILE + 1))
  echo "Processing entry $CURRENT_FILE of $TOTAL_FILES: $PATTERN"

  # Handle directories explicitly if they don't include wildcards
  if [[ -d "$DEFAULTPATH/$PATTERN" ]]; then
    echo "Copying directory: $PATTERN"
    mkdir -p "$NATIVEPATH/$PATTERN" # Ensure parent directory exists
    rsync -a "$DEFAULTPATH/$PATTERN/" "$NATIVEPATH/$PATTERN/"
    continue
  fi

  # Handle wildcard patterns and files
  MATCHES=$(find "$DEFAULTPATH" -path "$DEFAULTPATH/$PATTERN" 2>/dev/null)

  if [[ -z "$MATCHES" ]]; then
    echo "No matches found for pattern: $PATTERN"
    continue
  fi

  # Process each matched file or directory
  for MATCH in $MATCHES; do
    RELATIVE_PATH=${MATCH#"$DEFAULTPATH/"}
    DEST_PATH="$NATIVEPATH/$RELATIVE_PATH"

    if [[ -d "$MATCH" ]]; then
      # Create directory in NATIVEPATH
      mkdir -p "$DEST_PATH"
    else
      # Create necessary subdirectories and copy file
      mkdir -p "$(dirname "$DEST_PATH")"
      rsync -au "$MATCH" "$DEST_PATH"
    fi
  done
done < "$FILELIST"