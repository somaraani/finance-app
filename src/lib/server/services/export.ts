import { AssetsService } from './assets';
import { AssetsService } from './assets';
import JSZip from 'jszip';

export class ExportService {
	static async exportUserAssetHistory(userId: number): Promise<Buffer> {
		const assetHistory = await AssetsService.getAssetTimeline(userId);

		if (!assetHistory.history.length) {
			throw new Error('No asset history found');
		}

		const zip = new JSZip();

		for (const account of assetHistory.accounts) {
			const csvRows = ['Date,Amount'];
			assetHistory.history.forEach((entry) => {
				const balance = entry.value[assetHistory.accounts.indexOf(account)];
				const row = `${entry.date.toISOString().split('T')[0]},${balance !== undefined ? balance : 0}`;
				csvRows.push(row);
			});

			const csvContent = csvRows.join('\n');
			const filename = `${account.name}-${account.institutionName}.csv`;
			zip.file(filename, csvContent);
		}

		const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
		return zipContent;
	}
}
