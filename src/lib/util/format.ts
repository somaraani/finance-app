export function getRelativeTime(date: Date | null): string {
	if (!date) return '-';
	const now = new Date();
	const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
	const minutes = Math.round(seconds / 60);
	const hours = Math.round(minutes / 60);
	const days = Math.round(hours / 24);

	if (seconds < 60) {
		return 'just now';
	} else if (minutes < 60) {
		return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
	} else if (hours < 24) {
		return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
	} else if (days < 30) {
		return days === 1 ? '1 day ago' : `${days} days ago`;
	} else if (now.getFullYear() === date.getFullYear()) {
		return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
	} else {
		return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
	}
}

export function formatMoney(value?: number) {
	if (value === undefined) return '-';
	return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}
