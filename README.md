
[![NPM](https://nodei.co/npm/dot-torrent.png)](https://npmjs.org/package/dot-torrent)

![ci](https://github.com/IvanSolomakhin/dot-torrent/workflows/ci/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/IvanSolomakhin/dot-torrent/badge.svg)](https://coveralls.io/github/IvanSolomakhin/dot-torrent)
[![NPM Downloads](https://img.shields.io/npm/dt/dot-torrent)](https://npmjs.org/package/dot-torrent)
[![NPM License](https://img.shields.io/npm/l/dot-torrent)](LICENSE)

## Dot-Torrent

  Parse and create [torrent](https://en.wikipedia.org/wiki/Torrent_file) files.  
  
  Fast and easy to use.  
  Written in TypeScript.  
  Fully tested with 100% code coverage.  
  
## Installation

| npm | yarn |
|---|---|
| `npm install --save dot-torrent` | `yarn add dot-torrent` |

## Getting Started

### Import library

| typescript | javascript |
|---|---|
| `import dotTorrent from 'dot-torrent'` | `const dotTorrent = require('dot-torrent')`|

### Parse torrent file

``` typescript
  // parse from the Buffer or the string
  const torrent = dotTorrent.parse( fs.readFileSync('path/to/the/file.torrent') );
  // parse file
  const torrent = dotTorrent.parseFile('path/to/the/file.torrent');
  
  // torrent
  {
    announce: 'https://testtracker-1.net/testtopic.php?t=1111111',
    announceList: [
      'https://testtracker-1.net/testtopic.php?t=1111111',
      'https://testtracker-2.net/testtopic.php?t=2222222',
      'https://testtracker-3.net/testtopic.php?t=3333333'
    ],
    comment: 'Amazing torrent',
    createdBy: 'https://www.npmjs.com/package/dot-torrent',
    createdAt: 1586292962,
    encoding: 'UTF-8',
    files: [ {
      length: 100500,
      path: 'awesome_torrent.txt'
    } ],
    infoHash: '600ccd1b71569232d01d110bc63e906beab04d8c',
    name: 'awesome_torrent.txt',
    pieceLength: 32768,
    pieces: <Buffer 4d 92 fb 38 ... fe 74 59 b4 67 56 05>,
    private: false,
    publisher: 'isolomak',
    publisherUrl: 'https://www.npmjs.com/package/dot-torrent',
    totalLength: 100500
  }
```

### Create torrent file

``` typescript
  const parameters = {
    announceList: [
      'https://testtracker-1.net/testtopic.php?t=1111111'
    ],
    source: './path/to/the/folder/or/a/file',
    comment: 'Amazing torrent', // optional
    name: 'awesome_torrent', // optional
    private: false, // optional (false by default)
    publisher: 'isolomak', // optional
    publisherUrl: 'https://www.npmjs.com/package/dot-torrent' // optional
  };

  const outputPath = './awesome.torrent';

  await dotTorrent.create(parameters, outputPath);
```

## Tests

``` bash
  npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
