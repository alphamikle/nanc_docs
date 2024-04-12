#!/bin/bash

version=$1

if [[ "$version" == "" ]]; then
  echo "New version should be provided: \"vX.Y.Z\"" && exit 1
fi

source="$(pwd)/build/"

rm -rf ./build
npm run build

if [[ "$NANC_DOCS" == "" || "$NANC_DOCS" == "." ]]; then
  echo "Incorrect output path \"$NANC_DOCS\"" && exit 1
fi

echo "Copying build to $NANC_DOCS"

cd "$NANC_DOCS" || exit
git reset --hard HEAD
cp -R "$source" "$NANC_DOCS"
git add .
git commit -m "$version"
git push

echo "Version $version was published!"