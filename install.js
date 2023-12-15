const {execSync} = require('child_process');

if (!process.env.PREBUILD) {
  execSync('npx prebuild-install --target 4 --runtime napi');
}
