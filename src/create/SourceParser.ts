import fs from 'fs';
import path from 'path';
import { ISourceFileInfo } from '../types';

export default class SourceParser {

	private _files: Array<ISourceFileInfo>;
	private readonly _source: string;

	/**
	 * Constructor
	 */
	constructor(source: string) {
		this._files = [];
		this._source = source;

		this._parseSource();
	}

	/**
	 * Get files info
	 */
	public getFiles(): Array<ISourceFileInfo> {
		return this._files;
	}

	/**
	 * Get all file locations
	 */
	public getFilePathList(): Array<string> {
		const filePathList: Array<string> = [];

		for (const file of this._files) {
			filePathList.push( file.fullPath );
		}

		return filePathList;
	}

	/**
	 * Get total of files size
	 */
	public getTotalFilesSize(): number {
		let total = 0;

		for (const file of this._files) {
			total += file.length;
		}

		return total;
	}

	/**
	 * Get file info
	 */
	public getFileInfo(filePath: string, size?: number): { fullPath: string; relativePath: string; length: number; } {
		return {
			fullPath: path.resolve(filePath),
			relativePath: path.relative(this._source, filePath),
			length: size ? size : fs.lstatSync(this._source).size,
		};
	}

	/**
	 * Parse source and collect files info
	 */
	private _parseSource(): void {
		const stats = fs.lstatSync(this._source);

		if (stats.isDirectory()) {
			this._collectDirectoryFilesRecursively(this._source);
		}
	}

	/**
	 * Find all files in directory and collect info
	 */
	private _collectDirectoryFilesRecursively(directoryPath: string): void {
		const files = fs.readdirSync(directoryPath);

		for (const file of files) {
			const filePath = path.join(directoryPath, file);
			const fileStats = fs.lstatSync(filePath);

			fileStats.isDirectory()
				? this._collectDirectoryFilesRecursively(filePath)
				: this._files.push( this.getFileInfo(filePath, fileStats.size) );
		}
	}

}
