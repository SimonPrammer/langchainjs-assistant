// import { OPENAI_API_KEY } from '$env/static/private';
// import { json, type Config } from '@sveltejs/kit';

// import OpenAI from 'openai';

// const openai = new OpenAI({
// 	apiKey: OPENAI_API_KEY
// });

// export const config: Config = {
// 	runtime: 'edge'
// };

// //server endpoint for chatGpt Stream Chat
// export const POST = async ({ request }) => {
// 	try {
// 		const { messages } = await request.json();

// 		// const thread = await openai.beta.threads.create({
// 		// 	messages
// 		// 	// [
// 		// 	//   {
// 		// 	// 	"role": "user",
// 		// 	// 	"content": "Create 3 data visualizations based on the trends in this file.",
// 		// 	// 	"file_ids": [file.id]
// 		// 	//   }
// 		// 	// ]
// 		// });

// 		const assistant = await openai.beta.assistants.create({
// 			name: 'Math Tutor',
// 			instructions: 'You are a personal math tutor. Write and run code to answer math questions.',
// 			tools: [{ type: 'code_interpreter' }],
// 			model: 'gpt-4'
// 		});

// 		const thread = await openai.beta.threads.create();
// 		const message = await openai.beta.threads.messages.create(thread.id, {
// 			role: 'user',
// 			content: 'I need to solve the equation `3x + 11 = 14`. Can you help me?'
// 		});

// 		console.log(assistant);

// 		const run = await openai.beta.threads.runs.create(thread.id, {
// 			assistant_id: assistant.id,
// 			instructions: 'Please address the user as Jane Doe. The user has a premium account.'
// 		});

// 		const retrieveRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);

// 		//periodically check if retrieveRun.status === "completed"
// 		const time = Date.now();
// 		while (retrieveRun.status !== 'completed') {
// 			await new Promise((resolve) => setTimeout(resolve, 1000));
// 			//abort while after 10 seconds
// 			if (Date.now() - time > 10000) {
// 				break;
// 			}
// 		}

// 		const newMessages = await openai.beta.threads.messages.list(thread.id);

// 		return json({ result: newMessages, error: !newMessages }, { status: 200 });
// 	} catch (err) {
// 		console.error(err);
// 		return json(
// 			{
// 				error: true,
// 				errorMsg: 'There was an error processing your request'
// 			},
// 			{ status: 500 }
// 		);
// 	}
// };
