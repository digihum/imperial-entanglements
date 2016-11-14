# Imperial Entanglements

[![build status](https://actechlab.warwick.ac.uk/digital-humanities/imperial-entanglements/badges/master/build.svg)](https://actechlab.warwick.ac.uk/digital-humanities/imperial-entanglements/commits/master)

A database and VRE to support the Imperial Entanglements Project by Kirsty Hooper.

Building generates two directories:

- build : All of the TypeScript is transpiled to JavaScript and put here. Directory structure is identical to the root directory. 
- dist: The binaries for the electron app are placed here.

## How to deploy
- Clone git repo
- Run `npm install`
- Run `npm run tsc` to compile TypeScript
- Run `npm run webpack` to build the frontend bundle
- Run `gulp`
- Copy `index.html` from `./common` to `./build/common`
- Run `node ./build/server/index`

## How to build sqlite3 for electron

    cd .\node_modules\sqlite3
    npm install nan --save
    npm run prepublish
    node-gyp configure --module_name=node_sqlite3 --module_path=../lib/binding/electron-v1.4-win32-x64
    node-gyp rebuild --target=1.4.2 --arch=x64 --target_platform=win32 --dist-url=http://electron.atom.io/ --module_name=node_sqlite3 --module_path=../lib/binding/electron-v1.4-win32-x64

For the electron app to work:
- The 'index.html' file in the top level 'app' directory must be copied to the build/app directory
- A migrated & seeded mydb.sqlite file must be placed in the build/app directory
- For styling the app.css file in /build/static must be coped to build/app

Automating and streamlining this process will happen later in the project.