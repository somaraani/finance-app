export function color(opacity: string = '1') {
	return () => `hsl(var(--primary) / ${opacity})`;
}

export const monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

export const monthlyTickFormat = (d: number) => {
	const date = new Date(d);
	const month = date.getMonth() + 1;
	return monthNames[month];
};

export const dailyTickFormat = (d: number) =>
	new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

/**
 * If you want to set color for multiple lines at once, you'll have to define a colors array in your component and reference colors by index in the accessor function.
 * For example, in this instance below, we know that we only have 2 lines, so we can hardcode the colors array to return 2 colors for the 2 indexes i.e. 2 lines.
 */
export function lineColors<T>(_: T, i: number) {
	return ['hsl(var(--primary))', 'hsl(var(--primary) / 0.50)'][i];
}

export function scatterPointColors<T>(_: T, i: number) {
	return ['hsl(0, 0%, 100%)', 'hsl(var(--primary) / 0.50)'][i];
}

export function scatterPointStrokeColors<T>(_: T, i: number) {
	return ['hsl(var(--primary))', 'hsl(var(--primary) / 0.50)'][i];
}

export function crosshairPointColors<T>(_: T, i: number) {
	return ['hsl(var(--primary))', 'hsl(var(--primary) / 0.50)'][i];
}

export function crosshairStrokeWidths<T>(_: T, i: number) {
	return [2, 1][i];
}

export function tooltipTemplate(d: any) {
	return `
<div class="rounded-lg border bg-background p-2 shadow-sm">
  <div class="grid grid-cols-2 gap-2">
    <div class="flex flex-col">
      <span class="text-[0.70rem] uppercase text-muted-foreground">
        ${new Date(d[0]).toLocaleDateString()}
      </span>
      <span class="font-bold text-muted-foreground">
        $${d[1]}
      </span>
    </div>
  </div>
</div>
`;
}
