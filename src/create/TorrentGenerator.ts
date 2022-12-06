import bencodec from 'bencodec';
import { BencodeDictionary } from 'bencodec/lib/types';
import fs from 'fs';
import path from 'path';
import { ICreateTorrentParams } from '../types';
import PieceCollector from './PieceCollector';
import SourceParser from './SourceParser';

export default class TorrentGenerator {

	private _parameters: ICreateTorrentParams;
	private _torrent: BencodeDictionary;
	private _torrentInfo: BencodeDictionary;
	private _pieceCollector: PieceCollector;
	private _sourceParser: SourceParser;

	/**
	 * Constructor
	 */
	constructor(parameters: ICreateTorrentParams) {
		this._parameters = parameters;
		this._torrent = { };
		this._torrentInfo = { };

		this._sourceParser = new SourceParser(this._parameters.source);
		this._pieceCollector = new PieceCollector(
			this._sourceParser.getFilePathList(),
			this._sourceParser.getTotalFilesSize()
		);
	}

	/**
	 * Create torrent file
	 */
	public async create(outPath: string): Promise<boolean> {
		return new Promise(async (resolve, reject) => {

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
	private _announce(): void {
		if (Array.isArray(this._parameters.announceList) && this._parameters.announceList[0]) {
			this._torrent.announce = this._parameters.announceList[0];
		}
	}

	/**
	 * Set 'announce-list' field
	 */
	private _announceList(): void {
		const announceList: Array<Array<string>> = [];

		if (Array.isArray(this._parameters.announceList)) {
			for (const announce of this._parameters.announceList) {
				announceList.push([ announce ]);
			}
		}

		this._torrent['announce-list'] = announceList;
	}

	/**
	 * Set 'comment' field
	 */
	private _comment(): void {
		if (this._parameters.comment) {
			this._torrent.comment = this._parameters.comment;
		}
	}

	/**
	 * Set 'created by' field
	 */
	private _createdBy(): void {
		this._torrent['created by'] = 'https://www.npmjs.com/package/dot-torrent';
	}

	/**
	 * Set 'creation date' field
	 */
	private _creationDate(): void {
		this._torrent['creation date'] = Math.ceil(Date.now() / 1000);
	}

	/**
	 * Set 'encoding' field
	 */
	private _encoding(): void {
		this._torrent.encoding = 'UTF-8';
	}


	/**
	 * Set 'files' field to torrent info
	 */
	private _files(): void {
		const files = this._sourceParser.getFiles();

		this._torrentInfo.files = files.map(file => {
			return { length: file.length, path: [ file.relativePath ] };
		});
	}

	/**
	 * Set 'length' field to torrent info
	 * only for single file torrent
	 */
	private _length(): void {
		const files = this._sourceParser.getFiles();

		if (!files.length) {
			const sourceInfo = this._sourceParser.getFileInfo(this._parameters.source);
			this._torrentInfo.length = sourceInfo.length;
		}
	}

	/**
	 * Set 'name' field to torrent info
	 */
	private _name(): void {
		this._torrentInfo.name = this._parameters.name
			? this._parameters.name
			: path.basename(this._parameters.source);
	}

	/**
	 * Set 'piece length' field to torrent info
	 */
	private _pieceLength(): void {
		this._torrentInfo['piece length'] = this._pieceCollector.getPieceLength();
	}

	/**
	 * Set 'pieces' field to torrent info
	 */
	private async _pieces(): Promise<void> {
		await this._pieceCollector.collectFromFiles();
		this._torrentInfo.pieces = this._pieceCollector.getPieces();
	}

	/**
	 * Set 'private' field to torrent info
	 */
	private _private(): void {
		this._torrentInfo.private = !!this._parameters.private ? 1 : 0;
	}

	/**
	 * Set 'publisher' field
	 */
	private _publisher(): void {
		if (this._parameters.publisher) {
			this._torrent.publisher = this._parameters.publisher;
		}
	}

	/**
	 * Set 'publisher-url' field
	 */
	private _publisherUrl(): void {
		// TODO: validate url
		if (this._parameters.publisherUrl) {
			this._torrent['publisher-url'] = this._parameters.publisherUrl;
		}
	}

}
