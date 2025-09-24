
const getPixels = require("get-pixels");
const fs = require('fs');

let objectData = [];
let osuFormat = [];

let startingTick = 0;
let fps = 1;
fps = process.argv[2];

let currentTick = startingTick;
let currentFrame = 1;
let frameString = [`frames/${fps}FPS/frame`, ".png"];

let totalFrames = (219 * fps).toFixed(0);
let processedFrames = 0;

let imageData = {}

function formatFilename() {
    return String(currentFrame).padStart(4, "0");
}

for (let f = 0; f < totalFrames; f++) {
    let tick = currentTick;
    let frame = currentFrame;
    let filename = frameString[0].concat(formatFilename(frame)).concat(frameString[1]);

    currentFrame += 1;
    currentTick += 1000 / fps;

    getPixels(filename, function(err, pixels) {
        if (err) {
            console.log(err);
        } else {
            imageData.width = pixels.shape[0];
            imageData.height = pixels.shape[1];
            if (imageData.width * 3/4 != imageData.height) {
                console.log("Wrong ratio", imageData);
            } else {
                imageData.resolutionFactor = 384 / imageData.height;

                for (let x = 0; x < imageData.width; x++) {
                    for (let y = 0; y < imageData.height; y++) {
                        if (pixels.get(x, y, 0) > 128) {
                            objectData.push([
                                (x * imageData.resolutionFactor).toFixed(0),
                                (y * imageData.resolutionFactor).toFixed(0),
                                tick.toFixed(0)
                            ]);
                        }
                    }
                }
            }
        }

        processedFrames++;
        if (processedFrames == totalFrames) convertToOsuFormat();
    });
}

function convertToOsuFormat() {
    for (let i = 0; i < objectData.length; i++) {
        let string = `${objectData[i][0]},${objectData[i][1]},${objectData[i][2]},1,0,0:0:0:0:`;
        console.log(string);
        osuFormat.push(string);
    }

    writeBeatmap();
}

function writeBeatmap() {
    let content = `osu file format v14

[General]
AudioFilename: audio.mp3
AudioLeadIn: 0
PreviewTime: -1
Countdown: 0
SampleSet: Soft
StackLeniency: 0
Mode: 0
LetterboxInBreaks: 0
WidescreenStoryboard: 0

[Editor]
DistanceSpacing: 0.8
BeatDivisor: 4
GridSize: 16
TimelineZoom: 1

[Metadata]
Title:Bad Apple in osu
TitleUnicode:Bad Apple in osu
Artist:Masayoshi Minoshima ft. nomico
ArtistUnicode:Masayoshi Minoshima ft. nomico
Creator:Thermonuclear
Version:${`[${fps}FPS]`}
Source:
Tags:
BeatmapID:0
BeatmapSetID:-1

[Difficulty]
HPDrainRate:5
CircleSize:9
OverallDifficulty:10
ApproachRate:10
SliderMultiplier:1.4
SliderTickRate:1

[Events]
//Background and Video events
0,0,"bg.jpg",0,0
//Break Periods
2,585,6102
//Storyboard Layer 0 (Background)
//Storyboard Layer 1 (Fail)
//Storyboard Layer 2 (Pass)
//Storyboard Layer 3 (Foreground)
//Storyboard Layer 4 (Overlay)
//Storyboard Sound Samples

[TimingPoints]
1334,434.845629801421,4,2,0,80,1,0
43012,-100,4,1,0,80,0,0
85241,-100,4,2,0,80,0,0
112414,-100,4,1,0,80,0,0
181996,-100,4,2,0,80,0,0

[HitObjects]`;

    for (let i = 0; i < osuFormat.length; i++) {
        content = content.concat(`\n${osuFormat[i]}`);
    }

    fs.writeFile(`Masayoshi Minoshima ft. nomico - Bad Apple in osu (Thermonuclear) [${fps}FPS].osu`, content, err => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("written");
        }
    });
}