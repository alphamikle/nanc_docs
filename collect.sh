#!/bin/bash

output="all_content.txt"

> "$output"

find ./docs -type f -name '*.md' -print0 | while IFS= read -r -d '' file; do
    cat "$file" >> "$output"
    echo "" >> "$output"
done

echo "All doc-files were added to the $output."
