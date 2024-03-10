<script lang="ts">
	import { onMount } from 'svelte';

	export let data;
	let plaidHandler;

	onMount(() => {
		console.log(data.linkToken);
		console.log('starting pli');
		const handler = Plaid.create({
			token: data.linkToken,
			onSuccess: handleSuccess,
			onLoad: () => {},
			onExit: (err, metadata) => {},
			onEvent: (eventName, metadata) => {}
		});

		handler.open();
	});

	function handleSuccess(publicToken: string, metadata: any) {
		fetch('/link', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ publicToken, metadata })
		});
	}
</script>

<svelte:head>
	<script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"></script>
</svelte:head>
