# Kalimba Tabs

Rewrite of KalimbaLibre using Electron.

A WYSIWYG editor for creating, saving, and exporting kalimba tabs.

![](https://i.imgur.com/oxqmlNx.png)

## TO-DO

- [ ] Create dynamic export function that takes into account dimensions that aren't fullscreen
- [ ] Custom title bar instead of default OS one
- [ ] Usage tutorial
- [ ] Main page to see recent tabs
  - [ ] Set up react router
- [ ] Set up backend for sharing kalimba tabs
- [ ] Class up the joint
- [ ] Add icon
  - [x] Windows
  - [x] Linux
  - [ ] OSX
- [x] Get OS license

## Setup

After cloning the repo, in the root folder run:

`npm install`

If you want to test an already created song, there are examples in the `tab_examples` folder. Press the folder icon on the TabCreator page on order to open a .kal file.

## Dev

To run the program in development mode, run `npm run electron-pack` in the root folder.

### Things to Note:

- Development mode is unoptimised, so song playback will be much slower than it is in production mode

## Build

To make a build of the app, run `npm run electron-pack` in the root folder. It should show up in the `dist` folder when it's done.
If you are on linux and want to build for Windows, run [this](https://gist.githubusercontent.com/jamzi/aff85aa192b8addab2b560db5d849a2a/raw/70c5b6f5816cc8b743853dae7b335418faa18b1f/gistfile1.txt) docker command in the root folder, then run `npm run dist:windows`
