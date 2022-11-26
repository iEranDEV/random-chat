<template>
	<div class="w-screen h-screen bg-stone-300">
		<!-- Setup page (user has to click the start button) -->
		<div v-if="status === 'setup'" class="w-full h-full flex justify-center items-center flex-col gap-4 bg-stone-100 md:gap-3">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#10b981" class="w-16 h-16">
				<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
			</svg>
			<h1 class="font-semibold text-3xl md:text-2xl text-emerald-500">Welcome!</h1>
			<p class="text-stone-400 text-lg md:text-base">Click the button below to start chatting!</p>
			<button @click="request()" class="bg-emerald-500 rounded-lg text-stone-100 py-2 px-4 text-xl font-semibold md:text-lg">Let's go!</button>
		</div>

		<!-- Waiting for user -->
		<div v-if="status === 'waiting'" class="w-full h-full flex justify-center items-center flex-col gap-4 bg-stone-100">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#10b981" class="w-10 h-10 animate-spin">
				<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
			</svg>
			<p class="text-stone-400 text-lg">Waiting...</p>
		</div>

		<!-- Chat view -->
		<div v-if="status === 'chat'" class="w-full h-full flex flex-col">
			<!-- Header -->
			<header class="p-4 flex justify-between bg-stone-100 rounded-b-3xl md:p-2 shadow-lg">
				<button class="border-2 border-red-500 py-1 px-4 rounded-full text-red-500 font-semibold text-lg md:text-sm" @click="disconnect()">
					Disconnect
				</button>
			</header>

			<!-- Main chat component -->
			<main class="h-full flex flex-col-reverse gap-2 py-6 px-3 overflow-auto">
				<p v-for="message in messages" :key="message" :class="message.from == from ? 'message-sender' : 'message-receiver'">
					{{ message.content }}
				</p>
				<p class="self-center text-stone-400 text-center">This is the beginning of a conversation with a random user. Say hello!</p>
			</main>

			<!-- Footer -->
			<footer class="rounded-t-3xl bg-stone-100 p-4 flex gap-4 md:p-2 shadow-lg">
				<input type="text" id="message" class="bg-stone-200 rounded-3xl p-1 px-3 text-lg text-stone-700 w-full md:text-base" placeholder="Type message...">
				<button class="bg-emerald-500 rounded-full p-2 flex justify-center items-center" @click="sendMessage()">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#f5f5f4" class="w-7 h-7 md:w-6 md:h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
					</svg>

				</button>
			</footer>
		</div>

		<!-- Disconnected view -->
		<div v-if="status === 'disconnected'" class="w-full h-full flex justify-center items-center flex-col gap-4 bg-stone-100 md:gap-3">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#10b981" class="w-16 h-16">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
			</svg>
			<h1 class="font-semibold text-3xl md:text-2xl text-emerald-500">Disconnected!</h1>
			<p class="text-stone-400 text-lg md:text-base">Click the button below to start chatting again!</p>
			<button @click="request()" class="bg-emerald-500 rounded-lg text-stone-100 py-2 px-4 text-xl font-semibold md:text-lg">Let's go!</button>
		</div>
	</div>
</template>

<script>
import { ref } from 'vue';

export default {
	setup() {
		// Setup connection with websocket server
		const connection = new WebSocket(process.env.VUE_APP_WEB_SERVER);

		// Initialize necessary variables
		const messages = ref([]);
		const status = ref(null);
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
					status.value = 'setup';
					break;

				// Server assigned user to your chat
				case 'USER_RESPONSE':
					// Set receiver ID
					to.value = data.to;
					status.value = 'chat';
					break;

				// User disconnected from chat (chat ended)
				case 'DISCONNECTED':
					to.value = null;
					status.value = 'disconnected';
					messages.value = [];
					break;

				// Message event
				case 'MESSAGE':
					messages.value.unshift(data);
					break;
			}
		}

		return {
			connection,
			messages,
			from,
			to,
			status
		}
	},
	methods: {
		async request() {
			this.connection.send(JSON.stringify({
				type: 'USER_REQUEST',
			}));
			this.status = 'waiting';
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
			this.messages.unshift(data);
			window.scrollTo(0, document.body.scrollHeight);
		},
		async disconnect() {
			this.connection.send(JSON.stringify({
				type: 'DISCONNECTED',
				from: this.from,
				to: this.to
			}));
			this.to = null;
			this.status = 'disconnected';
			this.messages = [];
		}
	}
}
</script>

<style>
	
</style>
