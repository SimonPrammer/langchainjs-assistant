import { json, type Config } from '@sveltejs/kit';
import { OpenAIAssistantRunnable } from 'langchain/experimental/openai_assistant';

export const config: Config = {
	runtime: 'edge'
};

//server endpoint for chatGpt Stream Chat
export const POST = async ({ request, fetch }) => {
	try {
		const { messages, assistantId } = await request.json();
		if (!messages?.length) throw new Error('messages not set');

		let chatAssistantId = assistantId;

		if (!assistantId) {
			const res = await fetch('/api/assistant', {
				method: 'POST'
			});
			const { assistantId } = await res.json();
			chatAssistantId = assistantId;
		}

		if (!chatAssistantId)
			throw new Error('could not find or create assistant. missing chatAssistantId.');
		console.log('POST  chatAssistantId:', chatAssistantId);

		const assistant = new OpenAIAssistantRunnable({
			assistantId: chatAssistantId
		});

		const assistantResponse = await assistant.invoke({
			content: messages.pop().content
		});

		return json(
			{ assistantResponseContentArray: assistantResponse[0].content, error: !assistantResponse },
			{ status: 200 }
		);
	} catch (err) {
		console.error(err);
		return json(
			{
				error: true,
				errorMsg: 'There was an error processing your request'
			},
			{ status: 500 }
		);
	}
};
