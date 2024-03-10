<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let username = '';
	let password = '';
	let formValid = false;

	$: {
		formValid = username.trim() !== '' && password.trim() !== '';
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		if (formValid) {
			// Handle form submission here
		}
	};
</script>

<div class="flex h-screen items-center justify-center">
	<Card.Root class="w-[400px]">
		<Card.Header>
			<Card.Title>Login</Card.Title>
			<Card.Description>Log in to get started</Card.Description>
		</Card.Header>
		<Card.Content>
			<form on:submit={handleSubmit}>
				<div class="grid w-full items-center gap-4">
					<div class="flex flex-col space-y-1.5">
						<Label for="username">Username</Label>
						<Input id="username" bind:value={username} placeholder="Enter your username" required />
					</div>
					<div class="flex flex-col space-y-1.5">
						<Label for="password">Password</Label>
						<Input
							id="password"
							bind:value={password}
							placeholder="Enter your password"
							type="password"
							required
						/>
					</div>
				</div>
			</form>
		</Card.Content>
		<Card.Footer>
			<div class="mt-3 w-full">
				<Button class="w-full" disabled={!formValid}>Login</Button>
				<Button href="./signup" variant="ghost" class="mt-4 w-full text-muted-foreground"
					>Create an account</Button
				>
			</div>
		</Card.Footer>
	</Card.Root>
</div>
