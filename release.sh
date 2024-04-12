#!/bin/bash

version=$1

if [[ "$version" == "" ]]; then
  echo "New version should be provided: \"vX.Y.Z\"" && exit 1
fi

npm run build
cp -R ./build/ "$NANC_DOCS"
cd "$NANC_DOCS" || exit
git add .
git commit -m "$version"
git push

echo "Version $version was published!"