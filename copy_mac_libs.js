const { resolve, basename } = require('path');
const { execSync } = require('child_process');

function logAndExec(cmd) {
  console.log(`EXEC ${cmd}`);
  execSync(cmd);
}

const baseDir = resolve(__dirname, 'build/Release');
const skippedLibs = new Set();
const copiedLibs = new Set();

function copyDylibs(binaryName) {
  const binaryPath = resolve(baseDir, binaryName);
  console.log(`Inspecting ${binaryPath}`);
  const lines = execSync(`otool -L ${binaryPath}`).toString('utf8').split('\n');
  const libsToRewrite = [];
  for (const line of lines) {
    const match = /\S+\.dylib/.exec(line);
    if (!match) {
      console.log(`[DEBUG] skipping otool output: ${line}`);
      continue;
    }
    const [path] = match;
    if (path.startsWith('/usr/local')) {
      const filename = basename(path);
      const newFilename = resolve(baseDir, filename);
      if (!copiedLibs.has(path)) {
        copiedLibs.add(path);
        logAndExec(`cp ${path} ${newFilename}`);
        logAndExec(`chmod u+w ${newFilename}`);
        copyDylibs(filename);
      }
      libsToRewrite.push({path, filename});
    } else {
      skippedLibs.add(path);
    }
  }
  if (libsToRewrite.length > 0) {
    logAndExec(`install_name_tool ${libsToRewrite.map(({path, filename}) => `-change ${path} @rpath/${filename}`).join(' ')} ${binaryPath}`);
  }
}

copyDylibs('beamcoder.node');

for (const lib of Array.from(skippedLibs).sort()) {
  console.log(`[NOTE] skipped ${lib}`);
}
for (const lib of Array.from(copiedLibs).sort()) {
  console.log(`Copied ${lib}`);
}
