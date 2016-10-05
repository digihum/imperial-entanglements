# Imperial Entanglements

[![build status](https://actechlab.warwick.ac.uk/digital-humanities/imperial-entanglements/badges/master/build.svg)](https://actechlab.warwick.ac.uk/digital-humanities/imperial-entanglements/commits/master)

A database and VRE to support the Imperial Entanglements Project by Kirsty Hooper.

Building generates two directories:

- build : All of the TypeScript is transpiled to JavaScript and put here. Directory structure is identical to the root directory. 
- dist: The binaries for the electron app are placed here.

Electron App is currently broken. It cannot use sqlite3. The fix is documented here: https://github.com/electron/electron-rebuild. 
