OpenAI Assistant
INFO
The OpenAI Assistant API is still in beta.

OpenAI released a new API for a conversational agent like system called Assistant.

You can interact with OpenAI Assistants using OpenAI tools or custom tools. When using exclusively OpenAI tools, you can just invoke the assistant directly and get final answers. When using custom tools, you can run the assistant and tool execution loop using the built-in AgentExecutor or write your own executor. OpenAI assistants currently have access to two tools hosted by OpenAI: code interpreter, and knowledge retrieval.

We've implemented the assistant API in LangChain with some helpful abstractions. In this guide we'll go over those, and show how to use them to create powerful assistants.

Creating an assistant
Creating an assistant is easy. Use the createAssistant method and pass in a model ID, and optionally more parameters to further customize your assistant.

```ts
import { OpenAIAssistantRunnable } from 'langchain/experimental/openai_assistant';

const assistant = await OpenAIAssistantRunnable.createAssistant({
	model: 'gpt-4-1106-preview'
});
const assistantResponse = await assistant.invoke({
	content: 'Hello world!'
});
console.log(assistantResponse);
/**
    [
      {
        id: 'msg_OBH60nkVI40V9zY2PlxMzbEI',
        thread_id: 'thread_wKpj4cu1XaYEVeJlx4yFbWx5',
        role: 'assistant',
        content: [ 
          {
            type: 'text',
            value: 'Hello there! What can I do for you?'
          }
        ],
        assistant_id: 'asst_RtW03Vs6laTwqSSMCQpVND7i',
        run_id: 'run_4Ve5Y9fyKMcSxHbaNHOFvdC6',
      }
    ]
   */
```

If you have an existing assistant, you can pass it directly into the constructor:

```ts
const assistant = new OpenAIAssistantRunnable({
	assistantId: 'asst_RtW03Vs6laTwqSSMCQpVND7i'
	// asAgent: true
});
```

In this next example we'll show how you can turn your assistant into an agent.

Assistant as an agent

```ts
import { AgentExecutor } from 'langchain/agents';
import { StructuredTool } from 'langchain/tools';
import { OpenAIAssistantRunnable } from 'langchain/experimental/openai_assistant';
```

The first step is to define a list of tools you want to pass to your assistant. Here we'll only define one for simplicity's sake, however the assistant API allows for passing in a list of tools, and from there the model can use multiple tools at once. Read more about the run steps lifecycle here

NOTE
Only models released >= 1106 are able to use multiple tools at once. See the full list of OpenAI models here.

```ts
function getCurrentWeather(location: string, _unit = 'fahrenheit') {
	if (location.toLowerCase().includes('tokyo')) {
		return JSON.stringify({ location, temperature: '10', unit: 'celsius' });
	} else if (location.toLowerCase().includes('san francisco')) {
		return JSON.stringify({ location, temperature: '72', unit: 'fahrenheit' });
	} else {
		return JSON.stringify({ location, temperature: '22', unit: 'celsius' });
	}
}
class WeatherTool extends StructuredTool {
	schema = z.object({
		location: z.string().describe('The city and state, e.g. San Francisco, CA'),
		unit: z.enum(['celsius', 'fahrenheit']).optional()
	});

	name = 'get_current_weather';

	description = 'Get the current weather in a given location';

	constructor() {
		super(...arguments);
	}

	async _call(input: { location: string; unit: string }) {
		const { location, unit } = input;
		const result = getCurrentWeather(location, unit);
		return result;
	}
}
const tools = [new WeatherTool()];
```

In the above code we've defined three things:

A function for the agent to call if the model requests it.
A tool class which we'll pass to the AgentExecutor
The tool list we can use to pass to our OpenAIAssistantRunnable and AgentExecutor
Next, we construct the OpenAIAssistantRunnable and pass it to the AgentExecutor.

```ts
const agent = await OpenAIAssistantRunnable.createAssistant({
	model: 'gpt-3.5-turbo-1106',
	instructions: 'You are a weather bot. Use the provided functions to answer questions.',
	name: 'Weather Assistant',
	tools,
	asAgent: true
});
const agentExecutor = AgentExecutor.fromAgentAndTools({
	agent,
	tools
});
```

Note how we're setting asAgent to true, this input parameter tells the OpenAIAssistantRunnable to return different, agent-acceptable outputs for actions or finished conversations.

Above we're also doing something a little different from the first example by passing in input parameters for instructions and name. These are optional parameters, with the instructions being passed as extra context to the model, and the name being used to identify the assistant in the OpenAI dashboard.

Finally to invoke our executor we call the .invoke method in the exact same way as we did in the first example.

```ts
const assistantResponse = await agentExecutor.invoke({
	content: "What's the weather in Tokyo and San Francisco?"
});
console.log(assistantResponse);
/**
{
  output: 'The current weather in San Francisco is 72°F, and in Tokyo, it is 10°C.'
}
*/
```

Here we asked a question which contains two sub questions inside: What's the weather in Tokyo? and What's the weather in San Francisco?. In order for the OpenAIAssistantRunnable to answer that it returned two sets of function call arguments for each question, demonstrating it's ability to call multiple functions at once.

Assistant tools
OpenAI currently offers two tools for the assistant API: a code interpreter and a knowledge retrieval tool. You can offer these tools to the assistant simply by passing them in as part of the tools parameter when creating the assistant.

```ts
const assistant = await OpenAIAssistantRunnable.createAssistant({
	model: 'gpt-3.5-turbo-1106',
	instructions: 'You are a helpful assistant that provides answers to math problems.',
	name: 'Math Assistant',
	tools: [{ type: 'code_interpreter' }]
});
```

Since we're passing code_interpreter as a tool, the assistant will now be able to execute Python code, allowing for more complex tasks normal LLMs are not capable of doing well, like math.

```ts
const assistantResponse = await assistant.invoke({
	content: "What's 10 - 4 raised to the 2.7"
});
console.log(assistantResponse);
/**
[
  {
    id: 'msg_OBH60nkVI40V9zY2PlxMzbEI',
    thread_id: 'thread_wKpj4cu1XaYEVeJlx4yFbWx5',
    role: 'assistant',
    content: [
      {
        type: 'text',
        text: {
          value: 'The result of 10 - 4 raised to the 2.7 is approximately -32.22.',
          annotations: []
        }
      }
    ],
    assistant_id: 'asst_RtW03Vs6laTwqSSMCQpVND7i',
    run_id: 'run_4Ve5Y9fyKMcSxHbaNHOFvdC6',
  }
]
*/
```

Here the assistant was able to utilize the code_interpreter tool to calculate the answer to our question.
