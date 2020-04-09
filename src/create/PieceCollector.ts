import crypto from 'crypto';
import * as fs from 'fs';

export default class PieceCollector {

	private _buffer: Buffer;
	private _files: Array<string>;
	private _pieces: Array<Buffer>;
	private _totalLength: number;

	/**
	 * Constructor
	 */
	constructor(files: Array<string>, totalLength: number) {
		this._buffer = Buffer.alloc(0, 'utf-8');
		this._files = files;
		this._pieces = [];
		this._totalLength = totalLength;
	}

	/**
	 * Calculate piece length
	 */
	public getPieceLength() {
		return Math.max(16384, 1 << Math.log2(this._totalLength < 1024
			? 1
			: this._totalLength / 1024) + 0.5 | 0);
	}

	/**
	 * Read files and collect pieces
	 */
	public async collectFromFiles() {
		for (let i = 0; i < this._files.length; i++) {
			await this._readFile(this._files[i]);
		}
		this._flushBuffer();
	}

	/**
	 * Get collected pieces
	 */
	public getPieces() {
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
			stream.on('close', resolve);
		});
	}

	/**
	 * File data stream listener
	 */
	private _onFileData(data: Buffer) {
		this._buffer = Buffer.concat([ this._buffer, data ]);

		while (this._buffer.length > this.getPieceLength()) {
			this._collectPiece();
		}
	}

	/**
	 * Extract pieces from buffer
	 */
	private _collectPiece() {
		const piece = this._buffer.slice(0, this.getPieceLength());
		this._buffer = this._buffer.slice(this.getPieceLength());
		this._pieces.push(
			crypto.createHash('sha1').update(piece).digest()
		);
	}

}
