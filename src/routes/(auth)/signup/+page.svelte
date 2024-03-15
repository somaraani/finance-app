<script lang="ts">
	import type { ActionData } from './$types';
	import { Button } from '$lib/client/ui/button/index.js';
	import * as Card from '$lib/client/ui/card/index.js';
	import { Input } from '$lib/client/ui/input/index.js';
	import { Label } from '$lib/client/ui/label/index.js';

	export let form: ActionData;

	let username = '';
	let password = '';
	let repeatPassword = '';
	let firstname = '';
	let lastname = '';

	let formValid = false;

	$: {
		formValid =
			username.trim() !== '' &&
			password.trim() !== '' &&
			repeatPassword.trim() !== '' &&
			firstname.trim() !== '' &&
			lastname.trim() !== '' &&
			password === repeatPassword;
	}

	$: passwordsDifferent = password && repeatPassword && password !== repeatPassword;
</script>

<div class="flex h-screen items-center justify-center">
	<Card.Root class="w-[400px]">
		<Card.Header>
			<Card.Title>Sign up</Card.Title>
			<Card.Description>Welcome to finance app! Create an account to get started</Card.Description>
		</Card.Header>
		<form method="POST">
			<Card.Content>
				<div class="grid w-full items-center gap-4">
					<div class="flex flex-col space-y-1.5">
						<Label for="firstname">First Name</Label>
						<Input
							id="firstname"
							name="firstname"
							bind:value={firstname}
							placeholder="Enter your name"
							required
						/>
					</div>

					<div class="flex flex-col space-y-1.5">
						<Label for="lastname">Last Name</Label>
						<Input
							id="lastname"
							name="lastname"
							bind:value={lastname}
							placeholder="Enter your last name"
							required
						/>
					</div>

					<div class="flex flex-col space-y-1.5">
						<Label for="username">Username</Label>
						<Input
							id="username"
							name="username"
							bind:value={username}
							placeholder="Enter your username"
							required
						/>
						{#if form?.usernameExists}
							<p class="text-red-500">Username already exists</p>
						{/if}
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
					<div class="flex flex-col space-y-1.5">
						<Label for="repeat-password">Repeat Password</Label>
						<Input
							id="repeat-password"
							name="repeat-password"
							bind:value={repeatPassword}
							placeholder="Repeat password"
							type="password"
							required
						/>
						{#if passwordsDifferent}
							<p class="text-red-500">Passwords do not match</p>
						{/if}
					</div>
				</div></Card.Content
			>
			<Card.Footer>
				<div class="mt-3 w-full">
					<Button type="submit" class="w-full" disabled={!formValid}>Create Account</Button>
				</div>
			</Card.Footer>
		</form>
	</Card.Root>
</div>
