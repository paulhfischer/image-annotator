#!/bin/bash

# Get the list of all commit hashes
commit_hashes=($(git log --reverse --pretty=format:'%h'))

# Array of tag names
tags=(
    "v1.0.0"
    "v1.1.0"
    "v1.2.0"
    "v1.2.1"
    "v1.2.2"
    "v1.3.0"
    "v1.4.0"
    "v1.5.0"
    "v1.5.1"
    "v1.6.0"
    "v1.6.1"
    "v1.6.2"
    "v1.7.0"
    "v1.7.1"
    "v1.7.2"
    "v1.7.3"
    "v1.8.0"
    "v1.8.1"
    "v1.8.2"
    "v1.8.3"
    "v1.8.4"
    "v1.8.5"
    "v1.9.0"
    "v1.9.1"
    "v1.9.2"
    "v1.9.3"
    "v1.10.0"
)

# Loop through the tags and commit hashes
for ((i=0; i<${#tags[@]}; i++)); do
    tag="${tags[$i]}"
    commit_hash="${commit_hashes[$i]}"

    # Move the tag to the respective commit
    git tag -f "$tag" "$commit_hash"
    echo "Tagged $tag to commit $commit_hash"
done
