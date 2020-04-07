import * as assert from 'assert';
import { parse } from '../src';
import bencodec from 'bencodec';
import crypto from 'crypto';

describe('Parse tests', () => {

	describe('validation tests', () => {

		test('should throw error on string', () => {
			assert.throws(() => parse('https://testtracker-1.net/testtopic.php?t=1111111'));
			assert.throws(() => parse(bencodec.encode('https://testtracker-1.net/testtopic.php?t=1111111')));
		});

		test('should throw error on string', () => {
			assert.throws(() => parse(bencodec.encode([ 'https://testtracker-1.net/testtopic.php?t=1111111' ])));
		});

	});

	describe('announce field tests', () => {

		test('should parse announce field', () => {
			const result = parse(bencodec.encode({ announce: 'https://testtracker-1.net/testtopic.php?t=1111111' }));
			assert.deepStrictEqual(result.announce, 'https://testtracker-1.net/testtopic.php?t=1111111');
		});

	});

	describe('announceList field tests', () => {

		test('should parse announce list', () => {
			const announceList = [
				[ 'https://testtracker-1.net/testtopic.php?t=1111111' ],
				[ 'https://testtracker-2.net/testtopic.php?t=2222222' ],
				[ 'https://testtracker-3.net/testtopic.php?t=3333333' ],
			];
			const result = parse(bencodec.encode({ 'announce-list': announceList }));
			assert.deepStrictEqual(result.announceList, [
				'https://testtracker-1.net/testtopic.php?t=1111111',
				'https://testtracker-2.net/testtopic.php?t=2222222',
				'https://testtracker-3.net/testtopic.php?t=3333333',
			]);
		});

		test('should remove announce duplicates', () => {
			const announceList = [
				[ 'https://testtracker-1.net/testtopic.php?t=1111111' ],
				[ 'https://testtracker-1.net/testtopic.php?t=1111111' ],
				[ 'https://testtracker-2.net/testtopic.php?t=2222222' ],
				[ 'https://testtracker-2.net/testtopic.php?t=2222222' ],
				[ 'https://testtracker-3.net/testtopic.php?t=3333333' ],
				[ 'https://testtracker-3.net/testtopic.php?t=3333333' ],
			];
			const result = parse(bencodec.encode({ 'announce-list': announceList }));
			assert.deepStrictEqual(result.announceList, [
				'https://testtracker-1.net/testtopic.php?t=1111111',
				'https://testtracker-2.net/testtopic.php?t=2222222',
				'https://testtracker-3.net/testtopic.php?t=3333333',
			]);
		});

		test('should add announce to announceList', () => {
			const announceList = [
				[ 'https://testtracker-2.net/testtopic.php?t=2222222' ],
				[ 'https://testtracker-3.net/testtopic.php?t=3333333' ],
			];
			const result = parse(bencodec.encode({
				announce: 'https://testtracker-1.net/testtopic.php?t=1111111',
				'announce-list': announceList
			}));
			assert.deepStrictEqual(result.announceList, [
				'https://testtracker-1.net/testtopic.php?t=1111111',
				'https://testtracker-2.net/testtopic.php?t=2222222',
				'https://testtracker-3.net/testtopic.php?t=3333333',
			]);
		});

	});

	describe('comment field tests', () => {

		test('should parse comment field', () => {
			const result = parse(bencodec.encode({ comment: 'Test comment' }));
			assert.deepStrictEqual(result.comment, 'Test comment');
		});

	});

	describe('createdBy field tests', () => {

		test('should parse createdBy field', () => {
			const result = parse(bencodec.encode({ 'created by': 'isolomak' }));
			assert.deepStrictEqual(result.createdBy, 'isolomak');
		});

	});

	describe('createdAt field tests', () => {

		test('should parse createdAt field', () => {
			const result = parse(bencodec.encode({ 'creation date': 1585998070 }));
			assert.deepStrictEqual(result.createdAt, 1585998070);
		});

	});

	describe('encoding field tests', () => {

		test('should parse encoding field', () => {
			const result = parse(bencodec.encode({ encoding: 'UTF-8' }));
			assert.deepStrictEqual(result.encoding, 'UTF-8');
		});

	});

	describe('files field tests', () => {

		test('should parse files', () => {
			const result = parse(bencodec.encode({
				info: {
					files: [
						{
							length: 100500,
							path: [ 'test_file_1.txt' ]
						},
						{
							length: 500100,
							path: [ 'test_file_2.txt' ]
						},
					]
				}
			}));

			assert.deepStrictEqual(result.files.length, 2);

			assert.deepStrictEqual(result.files[0].length, 100500);
			assert.deepStrictEqual(result.files[1].length, 500100);

			assert.deepStrictEqual(result.files[0].path, 'test_file_1.txt');
			assert.deepStrictEqual(result.files[1].path, 'test_file_2.txt');
		});

		test('should skip invalid files', () => {
			const result = parse(bencodec.encode({
				info: {
					files: [
						{
							length: 100500,
							path: [ 'test_file_1.txt' ]
						},
						{
							length: 100500,
						},
						{
							path: [ 'test_file_2.txt' ]
						},
					]
				}
			}));

			assert.deepStrictEqual(result.files.length, 1);
			assert.deepStrictEqual(result.files[0].length, 100500);
			assert.deepStrictEqual(result.files[0].path, 'test_file_1.txt');
		});

	});

	describe('infoHash field tests', () => {

		test('should create infoHash from info', () => {
			const info = { };
			const result = parse(bencodec.encode({ info }));
			assert.deepStrictEqual(result.infoHash, crypto.createHash('sha1')
				.update(bencodec.encode(info))
				.digest('hex'));
		});

	});

	describe('name field tests', () => {

		test('should parse name field', () => {
			const result = parse(bencodec.encode({ info: { name: 'test_file.name.zip' } }));
			assert.deepStrictEqual(result.name, 'test_file.name.zip');
		});

	});

	describe('pieceLength field tests', () => {

		test('should parse piece length', () => {
			const result = parse(bencodec.encode({ info: { 'piece length': 32768 } }));
			assert.deepStrictEqual(result.pieceLength, 32768);
		});

	});

	describe('pieces field tests', () => {

		test('should parse pieces', () => {
			const result = parse(bencodec.encode({
				info: {
					'piece length': 32768,
					pieces: Buffer.from('4d92fb3893cc6ed5fbd0392dda657459b4675605', 'hex')
				}
			}));
			assert.deepStrictEqual(result.pieces, [ Buffer.from('4d92fb3893cc6ed5fbd0392dda657459b4675605', 'hex') ]);
		});

		test('should return empty array if no piece length', () => {
			const result = parse(bencodec.encode({
				info: {
					pieces: Buffer.from('4d92fb3893cc6ed5fbd0392dda657459b4675605', 'hex')
				}
			}));
			assert.deepStrictEqual(result.pieces, []);
		});

	});

	describe('private field tests', () => {

		test('should return true if private', () => {
			const result = parse(bencodec.encode({ info: { private: 1 } }));
			assert.deepStrictEqual(result.private, true);
		});

		test('should return false if not private', () => {
			const result = parse(bencodec.encode({ info: { private: 0 } }));
			assert.deepStrictEqual(result.private, false);
		});

		test('should return false no private field', () => {
			const result = parse(bencodec.encode({ info: { } }));
			assert.deepStrictEqual(result.private, false);
		});

	});

	describe('publisher field tests', () => {

		test('should parse publisher field', () => {
			const result = parse(bencodec.encode({ publisher: 'Faketracker' }));
			assert.deepStrictEqual(result.publisher, 'Faketracker');
		});

	});

	describe('publisherUrl field tests', () => {

		test('should parse publisherUrl field', () => {
			const result = parse(bencodec.encode({ 'publisher-url': 'https://faketracker.com/announce' }));
			assert.deepStrictEqual(result.publisherUrl, 'https://faketracker.com/announce');
		});

	});

});
