import * as path from 'path';
import { ISourceFile } from './types';
import * as fs from 'fs';

export class SourceParser {

	private static _getRelativePath(source: string, filePath: string) {
		return path.relative(source, filePath);
	}

	private static _getFullPath(filePath: string) {
		return path.resolve(filePath);
	}

	private _files: ISourceFile[];
	private readonly _source: string;

	constructor(source: string) {
		this._files = [];
		this._source = source;
		this._collectFiles();
	}

	public getFiles() {
		return this._files;
	}

	public getFileInfo(filePath: string, size?: number) {
		return {
			fullPath: SourceParser._getFullPath(filePath),
			relativePath: SourceParser._getRelativePath(this._source, filePath),
			length: size ? size : fs.lstatSync(this._source).size,
		};
	}

	private _collectFiles() {
		this._files = [];
		const stats = fs.lstatSync(this._source);

		if (stats.isDirectory()) {
			this._collectDirectoryFilesRecursively(this._source);
		}
	}

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
