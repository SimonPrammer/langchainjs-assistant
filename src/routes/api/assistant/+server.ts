import { OPENAI_API_KEY } from '$env/static/private';
import { json, type Config } from '@sveltejs/kit';
import fs from 'fs';

export const config: Config = {
	runtime: 'edge'
};

import OpenAI from 'openai';
const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

export const POST = async () => {
	try {
		//this is for windows file path. might have to change this depending on your system!
		const localFile = fs.createReadStream('.\\static\\docs\\assistant-docs.md');
		if (!localFile) throw new Error('localFile not found. check path');

		//get langchain assistant docs file
		const file = await openai.files.create({
			file: localFile,
			purpose: 'assistants'
		});

		// Add the file to the assistant
		const assistant = await openai.beta.assistants.create({
			instructions:
				'You are a adviser for using the Langchain Assistant API. ALWAYS check your knowledge base before you answer.',
			model: 'gpt-4-1106-preview',
			tools: [{ type: 'retrieval' }],
			file_ids: [file.id]
		});

		console.log('POST  assistant.id:', assistant.id);
		return json({ assistantId: assistant.id, error: !assistant }, { status: 200 });
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
