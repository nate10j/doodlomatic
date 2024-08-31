<script lang="ts">
	import { onMount } from "svelte";
	import { socketStore, playerData } from "$lib/client";
	import { messageType } from "$lib/client";
	import { generateRandomUsername } from "$lib/username";
	import { joinRandomRoom, joinRoomCode, createRoom } from "$lib/client";
	import { goto } from "$app/navigation";

	let roomCodeInput: string;

	$: if ($socketStore !== null) {
		console.log("message recieved")
	}

	playerData.set({
		username: generateRandomUsername()
	})

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

<div id="content">
	<form class="play-form" on:submit={joinRandomRoomEvent}>
		<input
			id="username"
			type="text"
			bind:value={$playerData.username}
			placeholder="enter player name"
		/>
		<button id="random" class="play" type="submit">Play</button>
		<p>Or</p>
		<input
			id="code"
			type="text"
			placeholder="enter room code"
			bind:value={roomCodeInput}
		/>
		<button
			id="withcode"
			class="play"
			type="button"
			on:click={joinRoomCodeEvent}>Play with code</button
		>
		<p>Or</p>
		<button
			id="createroom"
			class="play"
			type="button"
			on:click={createRoomEvent}>Create private room</button
		>
	</form>
</div>

<style>
	#content {
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
