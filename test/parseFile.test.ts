import * as assert from 'assert';
import { parseFile } from '../lib/dotTorrent';

describe('Parse file tests', () => {

	test('should parse file', () => {
		const result = parseFile('./test/test.torrent');
		assert.deepStrictEqual(result, {
			announce: 'https://testtracker-1.net/testtopic.php?t=1111111',
			announceList: [
				'https://testtracker-1.net/testtopic.php?t=1111111',
				'https://testtracker-2.net/testtopic.php?t=2222222',
				'https://testtracker-3.net/testtopic.php?t=3333333'
			],
			comment: 'Test comment',
			createdBy: 'Transmission/2.92 (14714)',
			createdAt: 1585998070,
			encoding: 'UTF-8',
			files: [
				{length: 16, path: 'file_1.txt'},
				{length: 16, path: 'file_2.txt'}
			],
			infoHash: '46bf9dd414eae4cd74fa4d129d2f23553a21bca7',
			name: 'test_torrent',
			pieceLength: 32768,
			pieces: [ Buffer.from('4d92fb3893cc6ed5fbd0392dda657459b4675605', 'hex') ],
			private: true,
			publisher: null,
			publisherUrl: null
		});
	});

});