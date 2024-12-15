import type { Connector } from '../connectors/abstract';
import { QuestradeConnector } from '../connectors/questrade';
import { AccountsService } from './accounts';

export type ConnectorType = 'questrade' | 'manual';

export class ConnectorsService {
	static async initializeConnector(
		userId: number,
		connectorType: ConnectorType,
		metadata: any
	): Promise<void> {
		const connector = ConnectorsService.getConnector(connectorType, userId);
		return connector?.initialize(metadata);
	}

	static async updateAccountBalances(userId: number, institutionId: number): Promise<void> {
		const institution = await AccountsService.getInstitutionById(userId, institutionId);
		const connector = ConnectorsService.getConnector(
			institution.connectorType as ConnectorType,
			userId,
			institutionId
		);
		await connector?.updateAccountBalances();
	}

	static getConnector(
		connectorType: ConnectorType,
		userId: number,
		institutionId?: number
	): Connector | undefined {
		switch (connectorType) {
			case 'questrade':
				return new QuestradeConnector(userId, institutionId);
			default:
				undefined;
		}
	}
}
