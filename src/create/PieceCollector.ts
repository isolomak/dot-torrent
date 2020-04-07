import crypto from 'crypto';
import * as fs from 'fs';

export default class PieceCollector {

	private _buffer: Buffer;
	private _pieces: Array<Buffer>;
	private _pieceLength: number;

	/**
	 * Constructor
	 */
	constructor() {
		this._buffer = Buffer.alloc(0, 'utf-8');
		this._pieces = [];
		this._pieceLength = 32768; // 262144;
	}

	/**
	 * Read files and collect pieces
	 */
	public async collectFromFiles(files: Array<string>) {
		for (let i = 0; i < files.length; i++) {
			await this._readFile(files[i]);
		}
	}

	/**
	 * Get collected pieces
	 */
	public getPieces() {
		this._flushBuffer();
		return Buffer.concat(this._pieces);
	}

	/**
	 * Process buffer remainings
	 */
	private _flushBuffer() {
		while (this._buffer.length) {
			this._collectPiece();
		}
	}

	/**
	 * Read file
	 */
	private _readFile(filePath: string) {
		return new Promise((resolve, reject) => {
			const stream = fs.createReadStream(filePath);

			stream.on('data', this._onFileData.bind(this));
			stream.on('error', reject);
			stream.on('end', resolve);
		});
	}

	/**
	 * File data stream listener
	 */
	private _onFileData(data: Buffer) {
		this._buffer = Buffer.concat([ this._buffer, data ]);

		while (this._buffer.length > this._pieceLength) {
			this._collectPiece();
		}
	}

	/**
	 * Extract pieces from buffer
	 */
	private _collectPiece() {
		const piece = this._buffer.slice(0, this._pieceLength);
		this._buffer = this._buffer.slice(this._pieceLength);

		this._pieces.push(
			crypto.createHash('sha1').update(piece).digest()
		);
	}

}
