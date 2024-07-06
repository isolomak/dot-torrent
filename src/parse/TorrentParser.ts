import bencodec, { BencodeDictionary, BencodeTypes } from 'bencodec';
import crypto from 'crypto';
import { IDotTorrent, IDotTorrentFileInfo } from '../types';
import { join } from 'path';

export default class TorrentParser {

	/**
	 * Parse torrent file
	 */
	public parse(data: Buffer | string): IDotTorrent {
		const decodedData = bencodec.decode<BencodeDictionary>(data);

		if (Array.isArray(decodedData) || Buffer.isBuffer(decodedData) || typeof decodedData !== 'object') {
			throw new Error('TorrentParser failed to parse torrent. Invalid data');
		}

		return {
			announce: TorrentParser._announce(decodedData),
			announceList: TorrentParser._announceList(decodedData),
			comment: TorrentParser._comment(decodedData),
			createdBy: TorrentParser._createdBy(decodedData),
			createdAt: TorrentParser._creationDate(decodedData),
			encoding: TorrentParser._encoding(decodedData),
			files: TorrentParser._files(decodedData),
			infoHash: TorrentParser._infoHash(decodedData),
			name: TorrentParser._name(decodedData),
			pieceLength: TorrentParser._pieceLength(decodedData),
			pieces: TorrentParser._pieces(decodedData),
			private: TorrentParser._private(decodedData),
			publisher: TorrentParser._publisher(decodedData),
			publisherUrl: TorrentParser._publisherUrl(decodedData),
			totalLength: TorrentParser._totalLength(decodedData)
		};
	}

	/**
	 * Get announce
	 */
	private static _announce(decodedData: BencodeDictionary): string | null {
		return TorrentParser._getStringFromBencode(decodedData.announce);
	}

	/**
	 * Get announceList
	 */
	private static _announceList(decodedData: BencodeDictionary): Array<string> {
		const announceList = new Set<string>();
		const announceValue = TorrentParser._announce(decodedData);

		if (announceValue) {
			announceList.add(announceValue);
		}

		if (!Array.isArray(decodedData['announce-list'])) {
			return Array.from(announceList);
		}

		for (const announceItem of decodedData['announce-list']) {
			if (Array.isArray(announceItem)) {
				for (const announce of announceItem) {
					if (Buffer.isBuffer(announce)) {
						announceList.add(announce.toString('utf-8'));
					}
				}
			}
		}

		return Array.from(announceList);
	}

	/**
	 * Get comment
	 */
	private static _comment(decodedData: BencodeDictionary): string | null {
		return TorrentParser._getStringFromBencode(decodedData.comment);
	}

	/**
	 * Get createdBy
	 */
	private static _createdBy(decodedData: BencodeDictionary): string | null {
		return TorrentParser._getStringFromBencode(decodedData['created by']);
	}

	/**
	 * Get creationDate
	 */
	private static _creationDate(decodedData: BencodeDictionary): number | null {
		if (typeof decodedData['creation date'] !== 'number') {
			return null;
		}

		return decodedData['creation date'];
	}

	/**
	 * Get encoding
	 */
	private static _encoding(decodedData: BencodeDictionary): string | null {
		return TorrentParser._getStringFromBencode(decodedData.encoding);
	}

	/**
	 * Get files
	 */
	private static _files(decodedData: BencodeDictionary): Array<IDotTorrentFileInfo> {
		const torrentInfo = TorrentParser._info(decodedData);

		if (!torrentInfo) {
			return [];
		}

		const fileMap: Map<string, number> = new Map();

		// Single file
		if (!Array.isArray(torrentInfo.files) || !torrentInfo.files.length) {
			if (!torrentInfo.name || typeof torrentInfo.length !== 'number') {
				return [];
			}

			const filePath = TorrentParser._getStringFromBencode(torrentInfo.name);
	
			if (!filePath) {
				return [];
			}

			fileMap.set(filePath, torrentInfo.length);
		}
		// Multiple files
		else {
			for (const fileInfo of torrentInfo.files) {
				if (Buffer.isBuffer(fileInfo) || Array.isArray(fileInfo) || typeof fileInfo !== 'object') {
					continue ;
				}
	
				if (typeof fileInfo.length !== 'number' || !Array.isArray(fileInfo.path)) {
					continue ;
				}

				if (!fileInfo.path.length) {
					continue ;
				}

				const pathItems = fileInfo.path.map((item: BencodeTypes) => TorrentParser._getStringFromBencode(item));

				if (pathItems.some((item: string) => !item)) {
					continue ;
				}

				const filePath = join(...pathItems as Array<string>);
	
				fileMap.set(filePath, fileInfo.length);
			}
		}

		const files = Array.from(fileMap.entries())
			.map(([ key, value ]) => ({ path: key, length: value }));

		return files
			.map((item, index) => {
				let offset = 0;

				files
					.filter((_, internalIndex) => internalIndex < index)
					.forEach(({ length }) => { offset += length; });

				return { ...item, offset };
			});
	}

	/**
	 * Get name
	 */
	private static _name(decodedData: BencodeDictionary): string | null {
		const torrentInfo = TorrentParser._info(decodedData);

		if (!torrentInfo?.name) {
			return null;
		}

		return TorrentParser._getStringFromBencode(torrentInfo.name);
	}

	/**
	 * Get pieceLength
	 */
	private static _pieceLength(decodedData: BencodeDictionary): number | null {
		const torrentInfo = TorrentParser._info(decodedData);

		return torrentInfo && typeof torrentInfo['piece length'] === 'number'
			? torrentInfo['piece length']
			: null;
	}

	/**
	 * Get pieces
	 */
	private static _pieces(decodedData: BencodeDictionary): Array<Buffer> {
		const torrentInfo = TorrentParser._info(decodedData);

		if (!torrentInfo || !Buffer.isBuffer(torrentInfo.pieces)) {
			return [];
		}

		// console.log(torrentInfo.pieces.length, torrentInfo.pieces[0], pieceLength);

		const pieces: Array<Buffer> = [];

		for (let i = 0; i < torrentInfo.pieces.length; i += 20) {
			pieces.push(
				torrentInfo.pieces.subarray(i, i + 20)
			);
		}

		return pieces;
	}

	/**
	 * Get private
	 */
	private static _private(decodedData: BencodeDictionary): boolean | null {
		const torrentInfo = TorrentParser._info(decodedData);

		return torrentInfo && typeof torrentInfo.private === 'number'
			? Boolean(torrentInfo.private)
			: null;
	}

	/**
	 * Get publisher
	 */
	private static _publisher(decodedData: BencodeDictionary): string | null {
		return TorrentParser._getStringFromBencode(decodedData.publisher);
	}

	/**
	 * Get publisherUrl
	 */
	private static _publisherUrl(decodedData: BencodeDictionary): string | null {
		return TorrentParser._getStringFromBencode(decodedData['publisher-url']);
	}

	/**
	 * Get total files length
	 */
	private static _totalLength(decodedData: BencodeDictionary): number | null {
		const files = TorrentParser._files(decodedData);

		if (!files.length) {
			return null;
		}

		return files.reduce((acc, next) => acc + next.length, 0);
	}

	/**
	 * Get infoHash
	 */
	private static _infoHash(decodedData: BencodeDictionary): string {
		return crypto.createHash('sha1')
			.update(bencodec.encode(TorrentParser._info(decodedData) || ''))
			.digest('hex');
	}

	/**
	 * Get torrent info
	 */
	private static _info(decodedData: BencodeDictionary): BencodeDictionary | null {
		if (!decodedData.info || Buffer.isBuffer(decodedData.info) || Array.isArray(decodedData.info) || typeof decodedData.info !== 'object') {
			return null;
		}

		return decodedData.info as BencodeDictionary | null;
	}

	private static _getStringFromBencode(data: BencodeTypes): string | null {
		if (!data || !Buffer.isBuffer(data)) {
			return null;
		}

		return data.toString('utf-8');
	}

}
