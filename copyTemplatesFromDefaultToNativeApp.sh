#!/bin/bash
DEFAULTPATH=src/main/resources/org/researchspace/apps/default
NATIVEPATH=src/main/resources/org/researchspace/apps/native
FILELIST="templatesToCopy.txt"

# Count the total number of files
TOTAL_FILES=$(wc -l < "$FILELIST")
CURRENT_FILE=0

# Loop through files listed in the file_list.txt and copy each one
while IFS= read -r FILE; do
  CURRENT_FILE=$((CURRENT_FILE + 1))
  echo "Processing file $CURRENT_FILE of $TOTAL_FILES: $FILE"
  rsync -u "$DEFAULTPATH/$FILE" "$NATIVEPATH/$FILE"
done < "$FILELIST"
