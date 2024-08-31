<script lang="ts">
    import { goto } from "$app/navigation";
	import { roomData, socketStore } from "$lib/client";

	if ($socketStore === null) {
		goto("/")
	}

	if ($socketStore !== null) {
		console.log("connected")
	}
</script>

<div id="content">
	<h1>Room: {$roomData.roomCode}</h1>
	<div id="game-container">
		<canvas id="game-canvas" width="600" height="600" />
	</div>
</div>

<style>
	#content {
		width: 100%;
		display: flex;
		justify-content: center;
	}
</style>
