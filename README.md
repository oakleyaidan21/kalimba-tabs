
# Kalimba Tabs  <img src="https://github.com/oakleyaidan21/kalimba-tabs/blob/master/public/assets/newkalimbaicon.png?raw=true" width="50px" height="50px" align="right"/>

A WYSIWYG editor for creating, saving, and exporting kalimba tabs.

![](https://imgur.com/5UPPuUK.png)

## Setup

After cloning the repo, in the root folder run:

`npm install`

If you want to test an already created song, there are examples in the `tab_examples` folder. Press the folder icon on the TabCreator page on order to open a .kal file.

## Dev

To run the program in development mode, run `npm run electron-dev` in the root folder.

## Build

To make a build of the app, run `npm run electron-pack` in the root folder. It should show up in the `dist` folder when it's done.

If you are on linux and want to build for Windows, run [this](https://gist.githubusercontent.com/jamzi/aff85aa192b8addab2b560db5d849a2a/raw/70c5b6f5816cc8b743853dae7b335418faa18b1f/gistfile1.txt) docker command in the root folder, then run `npm run dist:windows`

## TO-DO

- [ ] Create dynamic export function that takes into account dimensions that aren't fullscreen
- [x] Custom title bar instead of default OS one
- [ ] Usage tutorial
  - [x] github wiki
  - [ ] video
- [x] Main page to see recent tabs
  - [x] Set up react router
- [ ] Set up backend for sharing kalimba tabs
- [ ] Class up the joint
  - [x] get better note icons
  - [ ] replace note images with svgs
  - [ ] make home screen not boring
  - [ ] learn and implement better UI/UX patterns
- [x] Add icon
  - [x] Windows
  - [x] Linux
  - [x] OSX
- [x] Get OS license
- [ ] file documentation
- [ ] code cleanup
- [ ] add triplet function
  - [x] add triplet timing
  - [ ] handle triplet display
- [x] add and remove units of time from the kalimba
- [x] play from last clicked note function
- [x] saving existing files does not bring up save dialog
- [ ] add ability to place tempo change on kalimba
- [x] add ability to highlight a selection of notes for copying, cutting, etc
