export class ExchangeService {
	private static cache: { [key: string]: { rate: number; timestamp: number } } = {};
	private static cacheDuration = 3600000; // 1 hour in milliseconds

	static async fetchExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
		const cacheKey = `${fromCurrency}_${toCurrency}`;
		const now = Date.now();

		if (this.cache[cacheKey] && now - this.cache[cacheKey].timestamp < this.cacheDuration) {
			return this.cache[cacheKey].rate;
		}

		const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
		const data = await response.json();

		const rate = data.rates[toCurrency];
		this.cache[cacheKey] = { rate, timestamp: now };

		return rate;
	}

	static async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
		const cacheKey = `${fromCurrency}_${toCurrency}`;
		const now = Date.now();

		if (this.cache[cacheKey] && now - this.cache[cacheKey].timestamp < this.cacheDuration) {
			return this.cache[cacheKey].rate;
		}

		return this.fetchExchangeRate(fromCurrency, toCurrency);
	}
}
