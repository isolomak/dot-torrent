
# Dot-Torrent

![ci](https://github.com/IvanSolomakhin/dot-torrent/workflows/ci/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/IvanSolomakhin/dot-torrent/badge.svg)](https://coveralls.io/github/IvanSolomakhin/dot-torrent)
[![NPM Downloads](https://img.shields.io/npm/dt/dot-torrent)](https://npmjs.org/package/dot-torrent)
[![NPM License](https://img.shields.io/npm/l/dot-torrent)](LICENSE)

Library for parsing and creating [torrent](https://en.wikipedia.org/wiki/Torrent_file) files  

Fast and easy to use  
Written in TypeScript  
Fully tested with 100% code coverage  

----
  
## Installation

``` bash
npm install --save dot-torrent
```

----

## Getting Started

### Parse torrent file

``` typescript
import dotTorrent from 'dot-torrent';

// parse from the buffer or the string
const torrent = dotTorrent.parse( fs.readFileSync('path/to/the/file.torrent') );
// parse from file sync
const torrent = dotTorrent.parseFromFileSync('path/to/the/file.torrent');
// parse from file async
const torrent = await dotTorrent.parseFromFileAsync('path/to/the/file.torrent');

// torrent
{
  announce: 'https://test-tracker-1.net/testtopic.php?t=1111111',
  announceList: [
    'https://test-tracker-1.net/testtopic.php?t=1111111',
    'https://test-tracker-2.net/testtopic.php?t=2222222',
    'https://test-tracker-3.net/testtopic.php?t=3333333'
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
  private: false,
  publisher: 'isolomak',
  publisherUrl: 'https://www.npmjs.com/package/dot-torrent',
  totalLength: 100500,
  pieceLength: 32768,
  pieces: <Buffer 4d 92 fb 38 ... fe 74 59 b4 67 56 05>
}
```

### Create torrent file

``` typescript
import dotTorrent from 'dot-torrent';

const parameters = {
  announceList: [
    'https://testtracker-1.net/testtopic.php?t=1111111'
  ],
  source: './path/to/the/folder/or/a/file',
  comment: 'Amazing torrent', // optional
  name: 'awesome_torrent.txt', // optional
  private: false, // optional (false by default)
  publisher: 'isolomak', // optional
  publisherUrl: 'https://www.npmjs.com/package/dot-torrent' // optional
};

const outputPath = './torrents/awesome.torrent';

await dotTorrent.create(parameters, outputPath);
```

----

## Tests

``` bash
  npm test
```

----

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
