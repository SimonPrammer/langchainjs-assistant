<script>
	import '@picocss/pico';
	import { writable } from 'svelte/store';
	export let data;
	const messages = writable([
		{
			role: 'assistant',
			content: 'Ask me something about the Langchain Assistant API!'
		}
	]);
	const input = writable('');

	async function handleSubmit() {
		messages.set([
			...$messages,
			{
				role: 'user',
				content: $input
			}
		]);
		$input = '';

		const request = await fetch('/api/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			//to prevent always creating a new Assistant you can pass in here
			//example assistantId: 'asst_e6L0UGSaFn4b17eDIQ1ukeri'
			body: JSON.stringify({ messages: $messages })
		});
		const { assistantResponseContentArray } = await request.json();

		//foreach assistantResponseContentArray entry attach message
		assistantResponseContentArray.forEach((content) => {
			messages.set([
				...$messages,
				{
					role: 'assistant',
					content: formatCodeForHTML(content.text.value)
				}
			]);
		});
	}

	//formatting
	function formatCodeForHTML(code) {
		const regex = /```([\s\S]*?)```/g;
		const formattedCode = code.replace(regex, function (match) {
			let content = match.slice(3, -3); // Remove the backticks
			content = content.replace(/ /g, '&nbsp;'); // Replace spaces with non-breaking space
			content = content.replace(/\n/g, '<br>'); // Replace newlines with HTML line breaks
			return `<pre><code>${content}</code></pre>`;
		});
		return formattedCode;
	}
</script>

<div class="messages-container">
	<ul>
		{#each $messages as message}
			<li>{message.role}: {@html message.content}</li>
		{/each}
	</ul>
</div>

<footer>
	{#if !data.isEnvSet}
		<p>
			Make sure to set all necessary environment variables before chatting! See the README file for
			more information!
		</p>
	{/if}
	<form on:submit={handleSubmit}>
		<input
			disabled={!data.isEnvSet}
			bind:value={$input}
			placeholder="Ask something about the Langchain Assistant API."
		/>
		<button disabled={!data.isEnvSet} type="submit">Send</button>
	</form>
</footer>

<style>
	button {
		max-width: 120px;
	}

	.messages-container {
		margin-bottom: 100px;
	}

	form {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 0.5rem;
	}
	footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 0.5rem;
	}
	header {
		position: fixed;
		top: 0;
		right: 0;
		padding: 0.5rem;
	}
</style>
