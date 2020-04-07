import * as assert from 'assert';
import bencodec from 'bencodec';
import * as fs from 'fs';
import * as path from 'path';
import { create } from '../src';
import { BencodeDictionary } from 'bencodec/lib/types';

const deleteFolderRecursively = (filePath: string) => {
	if (fs.existsSync(filePath)) {
		fs.readdirSync(filePath).forEach(file => {
			const curPath = path.join(filePath, file);
			if (fs.lstatSync(curPath).isDirectory()) {
				deleteFolderRecursively(curPath);
			}
			else {
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(filePath);
	}
};

describe('Create torrent file tests', () => {
	const DUMP_FOLDER = './test/dump';
	const OUT_PATH = './test/dump/test.torrent';

	beforeAll(() => {
		if (!fs.existsSync(DUMP_FOLDER)) {
			fs.mkdirSync(DUMP_FOLDER);
		}
	});

	test('dump folder should be created', () => {
		assert.equal(fs.existsSync(DUMP_FOLDER), true);
	});

	describe('Validation tests', () => {

		test('should throw error if outPath is invalid', async () => {
			// tslint:disable-next-line: no-empty
			let f = () => { };
			try {
				await create({
					announceList: [],
					source: './test/testSources/directorySource',
				},           '/someRandom/directory/on/the/system');
			} catch (err) {
				f = () => { throw err; };
			} finally {
				assert.throws(f);
			}
		});

	});

	describe('Announce tests', () => {

		test('should create "announce" field from first item of an announceList', async () => {
			const announceList = [
				'https://testtracker-1.net/testtopic.php?t=1111111',
				'https://testtracker-2.net/testtopic.php?t=2222222',
				'https://testtracker-3.net/testtopic.php?t=3333333',
			];

			await create({
				announceList,
				source: './test/testSources/directorySource',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;

			assert.deepStrictEqual(
				result.announce,
				Buffer.from(announceList[0])
			);
		});

		test('should not create "announce" if "announce-list" is empty', async () => {
			const announceList: Array<string> = [];

			await create({
				announceList,
				source: './test/testSources/directorySource',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;

			assert.deepStrictEqual(
				result.announce,
				undefined,
			);
		});

	});

	describe('AnnounceList tests', () => {

		test('should create "announce-list" field', async () => {
			await create({
				announceList: [
					'https://testtracker-1.net/testtopic.php?t=1111111',
					'https://testtracker-2.net/testtopic.php?t=2222222',
					'https://testtracker-3.net/testtopic.php?t=3333333',
				],
				source: './test/testSources/directorySource',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;

			assert.deepStrictEqual(
				result['announce-list'],
				[
					[ Buffer.from('https://testtracker-1.net/testtopic.php?t=1111111') ],
					[ Buffer.from('https://testtracker-2.net/testtopic.php?t=2222222') ],
					[ Buffer.from('https://testtracker-3.net/testtopic.php?t=3333333') ],
				]
			);
		});

		test('should create empty "announce-list"', async () => {
			await create({
				announceList: [],
				source: './test/testSources/directorySource',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;

			assert.deepStrictEqual(
				result['announce-list'],
				[]
			);
		});

		test('should create empty "announce-list" for string value', async () => {
			await create({
				// @ts-ignore - for testing purposes
				announceList: 'string',
				source: './test/testSources/directorySource',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;

			assert.deepStrictEqual(
				result['announce-list'],
				[]
			);
		});

	});

	describe('Comment tests', () => {

		test('should create "comment" field', async () => {
			const comment = 'Test comment';

			await create({
				announceList: [],
				comment,
				source: './test/testSources/directorySource',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;

			assert.deepStrictEqual(
				result.comment,
				Buffer.from(comment)
			);
		});

		test('should not create "comment" field if not provided', async () => {
			await create({
				announceList: [],
				source: './test/testSources/directorySource',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;

			assert.deepStrictEqual(
				result.comment,
				undefined
			);
		});

	});

	describe('CreatedBy tests', () => {

		test('should create "created by" field', async () => {
			await create({
				announceList: [],
				source: './test/testSources/directorySource',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;

			assert.deepStrictEqual(
				result['created by'],
				Buffer.from('https://www.npmjs.com/package/dot-torrent')
			);
		});

	});

	describe('CreationDate tests', () => {

		test('should create "creation date" field', async () => {
			await create({
				announceList: [],
				source: './test/testSources/directorySource',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;

			assert.deepStrictEqual(
				typeof result['creation date'],
				'number'
			);
		});

	});

	describe('Encoding tests', () => {

		test('should create "encoding" field', async () => {
			await create({
				announceList: [],
				source: './test/testSources/directorySource',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;

			assert.deepStrictEqual(
				result.encoding,
				Buffer.from('UTF-8')
			);
		});

	});

	describe('Files tests', () => {

		test('should parse source directory and create "files" field', async () => {
			await create({
				announceList: [],
				source: './test/testSources/directorySource',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;
			const resultInfo = result.info as BencodeDictionary;

			assert.deepStrictEqual(
				resultInfo.files,
				[
					{ length: 61372, path: [ Buffer.from('file_1.txt') ] },
					{ length: 61372, path: [ Buffer.from('subDirectory/file_2.txt') ] },
				]
			);
		});

		test('should not push files into "files" field for single file torrent', async () => {
			await create({
				announceList: [],
				source: './test/testSources/directorySource/file_1.txt',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;
			const resultInfo = result.info as BencodeDictionary;

			assert.deepStrictEqual(
				resultInfo.files,
				[]
			);
		});

	});

	describe('Length tests', () => {

		test('should create "length" field for single file torrent', async () => {
			await create({
				announceList: [],
				source: './test/testSources/directorySource/file_1.txt',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;
			const resultInfo = result.info as BencodeDictionary;

			assert.deepStrictEqual(
				resultInfo.length,
				61372
			);
		});

		test('should not create "length" field for multiple file torrent', async () => {
			await create({
				announceList: [],
				source: './test/testSources/directorySource',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;
			const resultInfo = result.info as BencodeDictionary;

			assert.deepStrictEqual(
				resultInfo.length,
				undefined
			);
		});

	});

	describe('Name tests', () => {

		test('should create "name" field from provided name', async () => {
			const name = 'TestName';

			await create({
				announceList: [],
				name,
				source: './test/testSources/directorySource/file_1.txt',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;
			const resultInfo = result.info as BencodeDictionary;

			assert.deepStrictEqual(
				resultInfo.name,
				Buffer.from(name)
			);
		});

		test('should create "name" field from source basename if name is not privaded', async () => {
			await create({
				announceList: [],
				source: './test/testSources/directorySource',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;
			const resultInfo = result.info as BencodeDictionary;

			assert.deepStrictEqual(
				resultInfo.name,
				Buffer.from('directorySource')
			);
		});

	});

	describe('PieceLength tests', () => {

		test('should create "piece length" field', async () => {
			await create({
				announceList: [],
				source: './test/testSources/directorySource',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;
			const resultInfo = result.info as BencodeDictionary;

			assert.deepStrictEqual(
				resultInfo['piece length'],
				32768
			);
		});

	});

	describe('Pieces tests', () => {

		test('should create "pieces" field', async () => {
			await create({
				announceList: [],
				source: './test/testSources/directorySource',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;
			const resultInfo = result.info as BencodeDictionary;

			assert.deepStrictEqual(
				resultInfo.pieces,
				Buffer.from(
					'3eff5f50e9dd7bacb19f9bc626ddf738cababc55b8e271be82851dfe5642cb3dcc67f1f57f633a54c289c2d95860b46f5140874fdee92061d55ec3a0130b19c2a5f5c7236b1e63296e84c13ddd5ff140',
					'hex'
				)
			);
		});

	});


	describe('Private tests', () => {

		test('should create "private" field with default value false (0)', async () => {
			await create({
				announceList: [],
				source: './test/testSources/directorySource',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;
			const resultInfo = result.info as BencodeDictionary;

			assert.deepStrictEqual(
				resultInfo.private,
				0
			);
		});

		test('should create "private" field with true (1) value', async () => {
			await create({
				announceList: [],
				source: './test/testSources/directorySource',
				private: true
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;
			const resultInfo = result.info as BencodeDictionary;

			assert.deepStrictEqual(
				resultInfo.private,
				1
			);
		});

		test('should create "private" field with false (0) value', async () => {
			await create({
				announceList: [],
				source: './test/testSources/directorySource',
				private: false
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;
			const resultInfo = result.info as BencodeDictionary;

			assert.deepStrictEqual(
				resultInfo.private,
				0
			);
		});

	});

	describe('Publisher tests', () => {

		test('should create "publisher" field', async () => {
			const publisher = 'isolomak';

			await create({
				announceList: [],
				publisher,
				source: './test/testSources/directorySource',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;

			assert.deepStrictEqual(
				result.publisher,
				Buffer.from(publisher)
			);
		});

		test('should not create "publisher" field if not provided', async () => {
			await create({
				announceList: [],
				source: './test/testSources/directorySource',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;

			assert.deepStrictEqual(
				result.publisher,
				undefined
			);
		});

	});

	describe('PublisherUrl tests', () => {

		test('should create "publisher-url" field', async () => {
			const publisherUrl = 'http://test-url.com';

			await create({
				announceList: [],
				publisherUrl,
				source: './test/testSources/directorySource',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;

			assert.deepStrictEqual(
				result['publisher-url'],
				Buffer.from(publisherUrl)
			);
		});

		test('should not create "publisher-url" field if not provided', async () => {
			await create({
				announceList: [],
				source: './test/testSources/directorySource',
			},           OUT_PATH);

			const result = bencodec.decode(fs.readFileSync(OUT_PATH)) as BencodeDictionary;

			assert.deepStrictEqual(
				result['publisher-url'],
				undefined
			);
		});

	});

	afterAll(() => {
		deleteFolderRecursively(DUMP_FOLDER);
	});

});
