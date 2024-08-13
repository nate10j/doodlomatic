<script lang="ts">
	import "../app.css";
</script>

<div class="container">
	<slot/>
</div>

<style>
	.container {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
