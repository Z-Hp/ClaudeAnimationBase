// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the rhythm that bounces, dances and pulse() follow. Clawd always moves to some beat; if the video has music,
//             set this to the song's tempo, and set offset to the time in seconds of its first downbeat.
//   audio:    the song, muxed in by render.mjs --encode / --clip, and played by studio.html along with the scrubber.
//   writtenDuration: the length the shots were first written for, before resync() fitted them to the song (story_sync.js).
const PROJECT = { duration: 166.3, bpm: 115, offset: 0.51, audio: 'assets/music.m4a', writtenDuration: 168 };
