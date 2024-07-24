<script lang="ts">
	import { onMount } from "svelte";
	import { socket } from "$lib/client";

	import { generateRandomUsername } from "$lib/username";
	import { joinRandomRoom, joinRoomCode, createRoom } from "$lib/client";

	let username: string;
	let roomCodeInput: string;
	
	$: if ($socket != undefined) {
		console.log("socket loaded");

		$socket.send(JSON.stringify({ type: "test", message: "hello world!" }));

		$socket.addEventListener("message", (event: any) => {
			console.log(event.data);
		});
	}

	// runs when page is loaded
	// fixes problem where random username is generated twice
	onMount(() => {
		username = generateRandomUsername();
	});

	function joinRandomRoomEvent() {
		joinRandomRoom();
	}
	function joinRoomCodeEvent() {
		joinRoomCode("hi");
	}
	function createRoomEvent() {
		createRoom();
	}
</script>

<div>
	<h1>Doodlomatic</h1>
</div>

<div class="content">
	<form class="play-form" on:submit={joinRandomRoomEvent}>
		<input
			class="username"
			type="text"
			bind:value={username}
			placeholder="enter player name"
		/>
		<button class="play random" type="submit">Play</button>
		<p>Or</p>
		<input
			class="code"
			type="text"
			placeholder="enter room code"
			bind:value={roomCodeInput}
		/>
		<button class="play withcode" type="button" on:click={joinRoomCodeEvent}
			>Play with code</button
		>
		<p>Or</p>
		<button class="play createroom" type="button" on:click={createRoomEvent}
			>Create private room</button
		>
	</form>
</div>

<style>
	.content {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.play-form {
		min-width: 220px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.play-form > * {
		width: 100%;
		padding: 0.5rem;
	}

	.play {
		border: 1px solid black;
		margin: 0.1rem;
		cursor: pointer;
	}

	.play-form > p {
		text-align: center;
	}
</style>
