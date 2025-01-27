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

# Count the total number of files
TOTAL_FILES=$(wc -l < "$FILELIST")
CURRENT_FILE=0

# Loop through files listed in the file_list.txt and copy each one
while IFS= read -r FILE; do
  CURRENT_FILE=$((CURRENT_FILE + 1))
  echo "Processing file $CURRENT_FILE of $TOTAL_FILES: $FILE"

  # Create necessary subdirectories in NATIVEPATH
  mkdir -p "$NATIVEPATH/$(dirname "$FILE")"

  # Copy the file
  rsync -au "$DEFAULTPATH/$FILE" "$NATIVEPATH/$FILE"
done < "$FILELIST"