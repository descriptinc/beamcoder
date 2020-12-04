/*
  Aerostat Beam Coder - Node.js native bindings to FFmpeg
  Copyright (C) 2019 Streampunk Media Ltd.

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.

  https://www.streampunk.media/ mailto:furnace@streampunk.media
  14 Ormiscaig, Aultbea, Achnasheen, IV22 2JJ  U.K.
*/

const os = require('os');
const path = require('path');
const beamcoder = require('bindings')('beamcoder');
const beamstreams = require('./beamstreams.js');

// Provide useful debug on segfault-related crash
const SegfaultHandler = require('segfault-handler');
SegfaultHandler.registerHandler('crash.log');

const splash = `Aerostat Beam Coder  Copyright (C) 2019  Streampunk Media Ltd
GPL v3.0 or later license. This program comes with ABSOLUTELY NO WARRANTY.
This is free software, and you are welcome to redistribute it
under certain conditions. Conditions and warranty at:
https://github.com/Streampunk/beamcoder/blob/master/LICENSE`;

console.log(splash);
console.log('Using FFmpeg version', beamcoder.avVersionInfo());

beamcoder.demuxerStream = beamstreams.demuxerStream;
beamcoder.muxerStream = beamstreams.muxerStream;

beamcoder.makeSources = beamstreams.makeSources;
beamcoder.makeStreams = beamstreams.makeStreams;

function getPath(name) {
  // TODO: handle different platforms and architectures

  // const binaries = Object.assign(Object.create(null), {
  //   darwin: ['x64'],
  //   linux: ['x64', 'ia32', 'arm64', 'arm'],
  //   win32: ['x64', 'ia32']
  // });

  const platform = process.env.npm_config_platform || os.platform();

  // const arch = process.env.npm_config_arch || os.arch();
  //
  // if (!binaries[platform] || binaries[platform].indexOf(arch) === -1) {
  //   return null;
  // }

  return path.join(
    __dirname,
    'build',
    'Release',
    platform === 'win32' ? name + '.exe' : name
  );
}

beamcoder.ffmpegPath = getPath('ffmpeg');
beamcoder.ffprobePath = getPath('ffprobe');

module.exports = beamcoder;
