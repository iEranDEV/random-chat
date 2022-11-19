<template>
	<div class="bg-stone-200">
		<p>FROM: {{ from }}</p>
		<p>TO: {{ to }}</p>
		<button @click="request()">ZNAJDŹ ROZMÓWCE</button>
		<br>
		<p>{{ messages }}</p>
		<div>
			<input type="text" name="message" id="message">
			<button @click="sendMessage()">WYŚLIJ</button>
		</div>
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
					// Set current user ID
					from.value = data.from;
					break;

				// Server assigned user to your chat
				case 'USER_RESPONSE':
					// Set receiver ID
					to.value = data.to;
					break;

				// User disconnected from chat (chat ended)
				case 'USER_DISCONNECTED':
					break;

				// Message event
				case 'MESSAGE':
					messages.value.push(data);
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
	methods: {
		async request() {
			this.connection.send(JSON.stringify({
				type: 'USER_REQUEST',
			}))
		},
		async sendMessage() {
			let content = document.querySelector('#message').value;
			let data = {
				type: 'MESSAGE',
				from: this.from,
				to: this.to,
				content: content
			};
			this.connection.send(JSON.stringify(data));
			this.messages.push(data);
		}
	}
}
</script>

<style>
	
</style>
