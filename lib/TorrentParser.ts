import bencodec from 'bencodec';
import crypto from 'crypto';
import { IDotTorrent, IDotTorrentFile, ITorrent } from './types';

export class TorrentParser {

	private readonly _rawTorrent: ITorrent;

	constructor(data: Buffer | string) {
		const decodedData = bencodec.decode(data);

		if (Array.isArray(decodedData) || typeof decodedData !== 'object' || Buffer.isBuffer(decodedData)) {
			throw new Error('Invalid data');
		}

		this._rawTorrent = decodedData as unknown as ITorrent;
	}

	public parse(): IDotTorrent {
		return {
			announce: this._parseAnnounce(),
			announceList: this._parseAnnounceList(),
			comment: this._parseComment(),
			createdBy: this._parseCreatedBy(),
			createdAt: this._parseCreationDate(),
			encoding: this._parseEncoding(),
			files: this._parseFiles(),
			infoHash: this._getInfoHash(),
			name: this._parseName(),
			pieceLength: this._parsePieceLength(),
			pieces: this._parsePieces(),
			private: this._parsePrivate(),
			publisher: this._parsePublisher(),
			publisherUrl: this._parsePublisherUrl(),
		};
	}

	private _parseAnnounce() {
		if (!this._rawTorrent.announce) {
			return null;
		}
		return this._rawTorrent.announce.toString('utf-8');
	}

	private _parseAnnounceList() {
		const announceList = new Set<string>();
		const announceValue = this._parseAnnounce();

		if (announceValue) {
			announceList.add(announceValue);
		}

		if (!this._rawTorrent['announce-list']) {
			return Array.from(announceList);
		}

		for (const announceWrapperArray of this._rawTorrent['announce-list']) {
			for (const announce of announceWrapperArray) {
				announceList.add(announce.toString('utf-8'));
			}
		}

		return Array.from(announceList);
	}

	private _parseComment() {
		if (!this._rawTorrent.comment) {
			return null;
		}
		return this._rawTorrent.comment.toString('utf-8');
	}

	private _parseCreatedBy() {
		if (!this._rawTorrent['created by']) {
			return null;
		}
		return this._rawTorrent['created by'].toString('utf-8');
	}

	private _parseCreationDate() {
		if (!this._rawTorrent['creation date']) {
			return null;
		}
		return this._rawTorrent['creation date'];
	}

	private _parseEncoding() {
		if (!this._rawTorrent.encoding) {
			return null;
		}
		return this._rawTorrent.encoding.toString('utf-8');
	}

	private _parseFiles() {
		const files: IDotTorrentFile[] = [];

		if (!this._rawTorrent.info || !this._rawTorrent.info.files) {
			return files;
		}

		for (const file of this._rawTorrent.info.files) {
			if (!file.path || !file.length) {
				continue ;
			}

			files.push({
				length: file.length,
				path: file.path[0].toString('utf-8'),
			});
		}

		return files;
	}

	private _parseName() {
		if (!this._rawTorrent.info || !this._rawTorrent.info.name) {
			return null;
		}
		return this._rawTorrent.info.name.toString('utf-8');
	}

	private _parsePieceLength() {
		if (!this._rawTorrent.info || !this._rawTorrent.info['piece length']) {
			return 0;
		}
		return this._rawTorrent.info['piece length'];
	}

	private _parsePieces() {
		const pieces: Buffer[] = [];

		const pieceLength = this._parsePieceLength();

		if (!pieceLength || !this._rawTorrent.info || !this._rawTorrent.info.pieces) {
			return [];
		}

		for (let i = 0; i < this._rawTorrent.info.pieces.length; i += pieceLength) {
			pieces.push(
				this._rawTorrent.info.pieces.slice(i, i + pieceLength)
			);
		}

		return pieces;
	}

	private _parsePrivate() {
		if (!this._rawTorrent.info) {
			return false;
		}
		return !!this._rawTorrent.info.private;
	}

	private _parsePublisher() {
		if (!this._rawTorrent.publisher) {
			return null;
		}
		return this._rawTorrent.publisher.toString('utf-8');
	}

	private _parsePublisherUrl() {
		if (!this._rawTorrent['publisher-url']) {
			return null;
		}
		return this._rawTorrent['publisher-url'].toString('utf-8');
	}

	private _getInfoHash() {
		return crypto.createHash('sha1')
			.update(bencodec.encode(this._rawTorrent.info as { [key: string]: any } || ''))
			.digest('hex');
	}

}
