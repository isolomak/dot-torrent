
[![NPM](https://nodei.co/npm/dot-torrent.png)](https://npmjs.org/package/dot-torrent)

![ci](https://github.com/IvanSolomakhin/dot-torrent/workflows/ci/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/IvanSolomakhin/dot-torrent/badge.svg)](https://coveralls.io/github/IvanSolomakhin/dot-torrent)
[![NPM Downloads](https://img.shields.io/npm/dt/dot-torrent)](https://npmjs.org/package/dot-torrent)
[![NPM License](https://img.shields.io/npm/l/dot-torrent)](LICENSE)

## Dot-Torrent
  Library for parsing and creating [torrent](https://en.wikipedia.org/wiki/Torrent_file) files.  
  
  Fast and easy to use.  
  Written in TypeScript.  
  Fully tested with 100% code coverage.  

  
## Installation
| npm | yarn |
|---|---|
| `npm install --save dot-torrent` | `yarn add dot-torrent` |

## Getting Started

##### Import library
| typescript | javascript |
|---|---|
| ` import dotTorrent from 'dot-torrent' ` | ` const dotTorrent = require('dot-torrent') `|

##### Parse torrent file
```
  dotTorrent.parse('<file path>');
```

##### Create torrent file
```
  dotTorrent.create(<data>);
```

## Tests
  ```
  npm test
  ```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
