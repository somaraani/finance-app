<script lang="ts">
	import { Button } from '$lib/client/ui/button';
	import * as Card from '$lib/client/ui/card';

	export let data;
</script>

<h2 class="mb-6 text-3xl font-bold tracking-tight">Dashboard</h2>

{#if data.accounts?.length === 0}
	<div>
		<Card.Root>
			<Card.Header>
				<Card.Title>No Accounts Linked</Card.Title>
			</Card.Header>

			<Card.Content class="text-muted-foreground">Link an account to get started</Card.Content>

			<Card.Footer>
				<Button href="/link">Link Account</Button>
			</Card.Footer>
		</Card.Root>
	</div>
{/if}
