const { execSync } = require('child_process');
  const lines = execSync('otool -L build/Release/beamcoder.node').toString('utf8').split('\n');
  for (const line of lines) {
    const match = /\s*(\S*\/ffmpeg\/\S*\/([^/]+\.dylib))/.exec(line);
    if (match) {
      const [, path, filename] = match;
      console.log(`Rewriting ${path} to @rpath/${filename}`);
      execSync(`cp ${path} build/Release/${filename}`);
      execSync(`install_name_tool -change ${path} @rpath/${filename} build/Release/beamcoder.node`);
    }
  }
