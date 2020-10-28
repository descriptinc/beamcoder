const { resolve, basename } = require('path');
const { execSync } = require('child_process');
const { existsSync } = require('fs');

function logAndExec(cmd) {
  console.log(`EXEC ${cmd}`);
  execSync(cmd);
}

const baseDir = resolve(__dirname, 'build/Release');

function copyDylibs(binaryName) {
  const binaryPath = resolve(baseDir, binaryName);
  console.log(`Inspecting ${binaryPath}`);
  const lines = execSync(`otool -L ${binaryPath}`).toString('utf8').split('\n');
  const libs = [];
  for (const line of lines) {
    // Only operate on dylibs in /usr/local
    const match = /\/usr\/local\/\S+\.dylib/.exec(line);
    if (match) {
      const [path] = match;
      const filename = basename(path);
      const newFilename = resolve(baseDir, filename);
      if (!existsSync(newFilename)) {
        logAndExec(`cp ${path} ${newFilename}`);
        logAndExec(`chmod u+w ${newFilename}`);
        copyDylibs(filename);
      } else {
        console.log(`[DEBUG] skipping file because it already exists: ${newFilename}`);
      }
      libs.push({ path, filename });
    } else {
      console.log(`[DEBUG] skipping otool output: ${line}`);
    }
  }
  if (libs.length > 0) {
    logAndExec(`install_name_tool ${libs.map(({path, filename}) => `-change ${path} @rpath/${filename}`).join(' ')} ${binaryPath}`);
  }
}

copyDylibs('beamcoder.node');
