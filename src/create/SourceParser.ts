import * as path from 'path';
import { ISourceFileInfo } from '../types';
import * as fs from 'fs';

export default class SourceParser {

	/**
	 * Get the file path relative to the source
	 */
	private static _getRelativePath(source: string, filePath: string) {
		return path.relative(source, filePath);
	}

	/**
	 * Get full path to the file
	 */
	private static _getFullPath(filePath: string) {
		return path.resolve(filePath);
	}

	private _files: Array<ISourceFileInfo>;
	private readonly _source: string;

	/**
	 * Constructor
	 */
	constructor(source: string) {
		this._files = [];
		this._source = source;
	}

	/**
	 * Parse source and collect files info
	 */
	public parseSource() {
		const stats = fs.lstatSync(this._source);

		if (stats.isDirectory()) {
			this._collectDirectoryFilesRecursively(this._source);
		}
	}

	/**
	 * Get files info
	 */
	public getFiles() {
		return this._files;
	}

	/**
	 * Get file info
	 */
	public getFileInfo(filePath: string, size?: number) {
		return {
			fullPath: SourceParser._getFullPath(filePath),
			relativePath: SourceParser._getRelativePath(this._source, filePath),
			length: size ? size : fs.lstatSync(this._source).size,
		};
	}

	/**
	 * Find all files in directory and collent info
	 */
	private _collectDirectoryFilesRecursively(directoryPath: string) {
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
