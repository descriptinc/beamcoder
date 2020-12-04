const {execSync} = require('child_process');

if (!process.env.SKIP_PREBUILD_INSTALL) {
  execSync('npx prebuild-install --runtime napi');
}
