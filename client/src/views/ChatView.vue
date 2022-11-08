<template>
	<div v-if="connection && id">
		<p v-if="id">Twoje ID: {{ id }}</p>
		<p v-if="to">ID rozmówcy: {{ to }}</p>
		<span>
			Wiadomości: <p v-for="message in messages" :key="message">{{ message }}</p>
		</span>
		<div>
			<input type="text" name="tekst" id="tekst">
			<button @click="sendMessage()">WYŚLIJ</button>
		</div>
	</div>
</template>

<script>

export default {
	data() {
		return {
			connection: null,
			messages: [],
			id: null,
			to: null
		}
	},
	async mounted() {
		// Connect to WebSocket server
		this.connection = await new WebSocket("ws://localhost:3000");

		this.connection.onmessage = (event) => {
			let data = JSON.parse(event.data);
			if(data.type === 'MESSAGE') {
				this.messages.push(data);
			} else if(data.type === 'CONNECTION') {
				this.id = data.id;
				this.findReceiver();
			} else if(data.type === 'USER_FOUND') {
				this.to = data.to;
			}
		}
	},
	methods: {
		findReceiver() {
			this.connection.send(JSON.stringify({
				type: 'REQUEST',
			}))
		},
		sendMessage() {
			let tekst = document.getElementById("tekst").value;
			let data = {
				type: 'MESSAGE',
				from: this.id,
				to: this.to,
				content: tekst,
			}
			this.messages.push(data);
			this.connection.send(JSON.stringify(data));
		}
	}
}
</script>
