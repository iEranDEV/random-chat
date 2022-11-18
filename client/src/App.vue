<template>
	<div>
		<p>{{ from }}</p>
	</div>
</template>

<script>
import { ref } from 'vue';

export default {
	setup() {
		// Setup connection with websocket server
		const connection = new WebSocket("ws://localhost:3000");

		// Initialize necessary variables
		const messages = ref([]);
		const from = ref(null);
		const to = ref(null);

		// On message event listener
		connection.onmessage = (event) => {
			let data = JSON.parse(event.data);
			switch(data.type) {
				// Connection setup return message from server with ID
				case 'CONNECTION_SETUP':
					from.value = data.from;
					break;

				// Server assigned user to your chat
				case 'USER_RESPONSE':
					break;
				
				// User disconnected from chat (chat ended)
				case 'USER_DISCONNECTED':
					break;

				// Message event
				case 'MESSAGE':
					break;
			}
		}

		return {
			connection,
			messages,
			from,
			to
		}
	},
}
</script>

<style>
	
</style>
