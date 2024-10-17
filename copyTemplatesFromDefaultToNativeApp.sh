#!/bin/bash
DEFAULTPATH=src/main/resources/org/researchspace/apps/default
NATIVEPATH=src/main/resources/org/researchspace/apps/native
FILELIST="templatesToCopy.txt"

# Loop through files listed in the file_list.txt and copy each one
while IFS= read -r FILE; do
  rsync -u "$DEFAULTPATH/$FILE" "$NATIVEPATH/$FILE"
done < "$FILELIST"
