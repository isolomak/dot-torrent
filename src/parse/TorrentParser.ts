import bencodec from 'bencodec';
import crypto from 'crypto';
import { IDotTorrent, IDotTorrentFile, ITorrent } from '../types';

export default class TorrentParser {

	private readonly _rawTorrent: ITorrent;

	/**
	 * Constructor
	 */
	constructor(data: Buffer | string) {
		const decodedData = bencodec.decode(data);

		if (Array.isArray(decodedData) || typeof decodedData !== 'object' || Buffer.isBuffer(decodedData)) {
			throw new Error('Invalid data');
		}

		this._rawTorrent = decodedData as unknown as ITorrent;
	}

	/**
	 * Parse torrent file
	 */
	public parse(): IDotTorrent {
		return {
			announce: this._announce(),
			announceList: this._announceList(),
			comment: this._comment(),
			createdBy: this._createdBy(),
			createdAt: this._creationDate(),
			encoding: this._encoding(),
			files: this._files(),
			infoHash: this._infoHash(),
			name: this._name(),
			pieceLength: this._pieceLength(),
			pieces: this._pieces(),
			private: this._private(),
			publisher: this._publisher(),
			publisherUrl: this._publisherUrl(),
			totalLength: this._totalLength()
		};
	}

	/**
	 * Get announce
	 */
	private _announce() {
		if (!this._rawTorrent.announce) {
			return null;
		}
		return this._rawTorrent.announce.toString('utf-8');
	}

	/**
	 * Get announceList
	 */
	private _announceList() {
		const announceList = new Set<string>();
		const announceValue = this._announce();

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

	/**
	 * Get comment
	 */
	private _comment() {
		if (!this._rawTorrent.comment) {
			return null;
		}
		return this._rawTorrent.comment.toString('utf-8');
	}

	/**
	 * Get createdBy
	 */
	private _createdBy() {
		if (!this._rawTorrent['created by']) {
			return null;
		}
		return this._rawTorrent['created by'].toString('utf-8');
	}

	/**
	 * Get creationDate
	 */
	private _creationDate() {
		if (!this._rawTorrent['creation date']) {
			return null;
		}
		return this._rawTorrent['creation date'];
	}

	/**
	 * Get encoding
	 */
	private _encoding() {
		if (!this._rawTorrent.encoding) {
			return null;
		}
		return this._rawTorrent.encoding.toString('utf-8');
	}

	/**
	 * Get files
	 */
	private _files() {
		const files: Array<IDotTorrentFile> = [];

		if (!this._rawTorrent.info) {
			return files;
		}

		if (!this._rawTorrent.info.files  || !this._rawTorrent.info.files.length) {

			if (!this._rawTorrent.info.name) {
				return files;
			}

			files.push({
				length: this._rawTorrent.info.length || 0,
				path: this._rawTorrent.info.name.toString('utf-8')
			});
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

	/**
	 * Get name
	 */
	private _name() {
		if (!this._rawTorrent.info || !this._rawTorrent.info.name) {
			return null;
		}
		return this._rawTorrent.info.name.toString('utf-8');
	}

	/**
	 * Get pieceLength
	 */
	private _pieceLength() {
		if (!this._rawTorrent.info || !this._rawTorrent.info['piece length']) {
			return 0;
		}
		return this._rawTorrent.info['piece length'];
	}

	/**
	 * Get pieces
	 */
	private _pieces() {
		const pieces: Array<Buffer> = [];

		const pieceLength = this._pieceLength();

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

	/**
	 * Get private
	 */
	private _private() {
		if (!this._rawTorrent.info) {
			return false;
		}
		return !!this._rawTorrent.info.private;
	}

	/**
	 * Get publisher
	 */
	private _publisher() {
		if (!this._rawTorrent.publisher) {
			return null;
		}
		return this._rawTorrent.publisher.toString('utf-8');
	}

	/**
	 * Get publisherUrl
	 */
	private _publisherUrl() {
		if (!this._rawTorrent['publisher-url']) {
			return null;
		}
		return this._rawTorrent['publisher-url'].toString('utf-8');
	}

	/**
	 * Get total files length
	 */
	private _totalLength() {
		let totalLength = 0;

		const files = this._files();

		for (let i = 0; i < files.length; i++) {
			totalLength += files[i].length;
		}

		return totalLength;
	}

	/**
	 * Get infoHash
	 */
	private _infoHash() {
		return crypto.createHash('sha1')
			.update(bencodec.encode(this._rawTorrent.info as { [key: string]: any } || ''))
			.digest('hex');
	}

}
