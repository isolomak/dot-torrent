
[![NPM](https://nodei.co/npm/dot-torrent.png)](https://npmjs.org/package/dot-torrent)

[![build](https://circleci.com/gh/IvanSolomakhin/dot-torrent.svg?style=shield)](https://app.circleci.com/pipelines/github/IvanSolomakhin/dot-torrent)
[![codecov](https://codecov.io/gh/IvanSolomakhin/dot-torrent/branch/master/graph/badge.svg)](https://codecov.io/gh/IvanSolomakhin/dot-torrent)

## Dot-Torrent
  Library for decoding and encoding [torrent](https://en.wikipedia.org/wiki/Torrent_file) files.  
  
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
