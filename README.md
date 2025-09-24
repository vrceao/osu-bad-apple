
## How to run

1. Clone this repository - `git clone github.com/vrceao/osu-bad-apple.git`

2. Change directory to the project - `cd osu-bad-apple`

3. Install required dependencies - `npm install`

4. Create the beatmap with your desired bpm (frames needs to have a subfolder with that framerate) - `node video.js 3`

----------------------

## How to create a render with your own fps

Example with 30 FPS:

1. Create a new directory for your frames `mkdir frames/30FPS`

2. Use this command on your desired video (change fps value) `ffmpeg -i input.mp4 -vf "scale=24:-2,fps=1" frames/30FPS/frame%04d.png`

3. Run `node video.js 30`