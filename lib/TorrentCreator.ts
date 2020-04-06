import bencodec from 'bencodec';
import crypto from 'crypto';
import * as fs from 'fs';
import { IDotTorrentParams } from './types';
import { BencodeDictionary } from 'bencodec/build/types';
import { SourceParser } from './SourceParser';

export class TorrentCreator {

	private _buffer: Buffer;
	private _data: IDotTorrentParams;
	private _torrent: BencodeDictionary;
	private _torrentInfo: BencodeDictionary;
	private _sourceParser: SourceParser;

	constructor(data: IDotTorrentParams) {
		this._buffer = Buffer.alloc(0, 'utf-8');
		this._data = data;
		this._sourceParser = new SourceParser(this._data.source);
		this._torrent = {};
		this._torrentInfo = {};
	}

	public create(outPath: string): Promise<boolean> {
		return new Promise(async (resolve, reject) => {

			// TODO: validate path
			// TODO: validate mandatory fields

			this._announce();
			this._announceList();
			this._comment();
			this._createdBy();
			this._creationDate();
			this._encoding();
			this._files();
			this._length();
			this._name();
			this._pieceLength();
			this._private();
			this._publisher();
			this._publisherUrl();

			await this._pieces();

			this._torrent.info = this._torrentInfo;

			fs.writeFile(outPath, bencodec.encode(this._torrent), (err => {
				err ? reject(err) : resolve(true);
			}));
		});
	}

	/**
	 * Set 'announce' fields
	 */
	private _announce() {
		if (Array.isArray(this._data.announceList) && this._data.announceList[0]) {
			this._torrent.announce = this._data.announceList[0];
		}
	}

	/**
	 * Set 'announce-list' field
	 */
	private _announceList() {
		const announceList: string[][] = [];

		if (Array.isArray(this._data.announceList)) {
			for (const announce of this._data.announceList) {
				announceList.push([ announce ]);
			}
		}

		this._torrent['announce-list'] = announceList;
	}

	/**
	 * Set 'comment' field
	 */
	private _comment() {
		if (this._data.comment) {
			this._torrent.comment = this._data.comment;
		}
	}

	/**
	 * Set 'created by' field
	 */
	private _createdBy() {
		this._torrent['created by'] = 'https://www.npmjs.com/package/dot-torrent';
	}

	/**
	 * Set 'creation date' field
	 */
	private _creationDate() {
		this._torrent['creation date'] = Math.ceil(Date.now() / 1000);
	}

	/**
	 * Set 'encoding' field
	 */
	private _encoding() {
		this._torrent.encoding = 'UTF-8';
	}


	/**
	 * Set 'info.files' field
	 */
	private _files() {
		const files = this._sourceParser.getFiles();

		this._torrentInfo.files = files.map(file => {
			return { length: file.length, path: [ file.relativePath ] };
		});
	}

	private _length() {
		const files = this._sourceParser.getFiles();

		if (!files.length) {
			const sourceInfo = this._sourceParser.getFileInfo(this._data.source);
			this._torrentInfo.length = sourceInfo.length;
		}
	}

	private _name() {
		// TODO
	}

	private _pieceLength() {
		return this._torrentInfo['piece length'] = 32768; // 262144;
	}

	private async _pieces() {
		this._torrentInfo.pieces = Buffer.alloc(0, 'utf-8');
		const files = this._sourceParser.getFiles();

		if (!files.length) {
			files.push( this._sourceParser.getFileInfo(this._data.source) );
		}

		for (const file of files) {
			await this._processFile(file.fullPath);
		}

		while (this._buffer.length) {
			this._processBuffer();
		}
	}

	private _private() {
		this._torrentInfo['private'] = !!this._data.private ? 1 : 0;
	}

	private _publisher() {
		return this._data.publisher;
	}

	private _publisherUrl() {
		return this._data.publisherUrl;
	}

	private _processFile(filePath: string) {
		return new Promise((resolve, reject) => {
			const stream = fs.createReadStream(filePath);

			stream.on('data', this._processFileData.bind(this));
			stream.on('error', reject);
			stream.on('end', resolve);
		});
	}

	private _processFileData(data: Buffer) {
		this._buffer = Buffer.concat([ this._buffer, data ]);

		if (this._buffer.length < this._pieceLength()) {
			return ;
		}

		while (this._buffer.length > this._pieceLength()) {
			this._processBuffer();
		}
	}

	private _processBuffer() {
		const pieceSize = this._pieceLength();
		const piece = this._buffer.slice(0, pieceSize);
		const pieceHash = crypto.createHash('sha1').update(piece).digest();

		this._buffer = this._buffer.slice(pieceSize);
		this._torrentInfo.pieces = Buffer.concat([ this._torrentInfo.pieces as Buffer, pieceHash ]);
	}

}
