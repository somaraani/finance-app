<script lang="ts">
	import type { ActionData } from './$types';
	import { Button } from '$lib/client/ui/button/index.js';
	import * as Card from '$lib/client/ui/card/index.js';
	import { Input } from '$lib/client/ui/input/index.js';
	import { Label } from '$lib/client/ui/label/index.js';

	export let form: ActionData;

	let username = form?.username ?? '';
	let password = '';
	let formValid = false;

	$: {
		formValid = username.trim() !== '' && password.trim() !== '';
	}
</script>

<div class="flex h-screen items-center justify-center">
	<form method="post">
		<Card.Root class="w-[400px]">
			<Card.Header>
				<Card.Title>Login</Card.Title>
				<Card.Description>Log in to get started</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="grid w-full items-center gap-4">
					<div class="flex flex-col space-y-1.5">
						<Label for="username">Username</Label>
						<Input
							name="username"
							id="username"
							bind:value={username}
							placeholder="Enter your username"
							required
						/>
					</div>
					<div class="flex flex-col space-y-1.5">
						<Label for="password">Password</Label>
						<Input
							id="password"
							name="password"
							bind:value={password}
							placeholder="Enter your password"
							type="password"
							required
						/>
					</div>

					{#if form?.invalidCredentials}
						<p class="text-sm text-red-500">Invalid credentials</p>
					{/if}
				</div>
			</Card.Content>
			<Card.Footer>
				<div class="mt-3 w-full">
					<Button type="submit" class="w-full" disabled={!formValid}>Login</Button>
					<Button href="./signup" variant="ghost" class="mt-4 w-full text-muted-foreground"
						>Create an account</Button
					>
				</div>
			</Card.Footer>
		</Card.Root>
	</form>
</div>
