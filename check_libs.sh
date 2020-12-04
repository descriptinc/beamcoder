#for file in prebuilds/build/Release/*
for file in /Users/srubin/code/descript-web-v2/node_modules/beamcoder/build/Release/*
do
  echo $file
  otool -l $file | grep -A 3  LC_VERSION_MIN_MACOSX
  otool -l $file | grep -A 7  LC_BUILD_VERSION
done
