# LangchainJS Assistant (Template)

This is a minimal viable example of a Chatbot based on the new Assistant's API of OpenAI utilizing LangchainJS abstractions.

The JavaScript framework of choice is SvelteKit, however the code should be easily transferable to other frameworks (most is just simple JavaScript / Node.js code ).

The Template is held purposefully simple in its implementation while still beeing fully functional.

It is best used as reference to learn the basics of how the new Assistant API works and how to use it with LangchainJS.

Caution: This is by no means a finished product. This API is still in beta and the integrated RAG from uploaded Files is average at best.

## Links

- Official Langchain Assistant Documentation: https://js.langchain.com/docs/modules/agents/agent_types/openai_assistant
- Official OpenAI Assistant Documentation: https://platform.openai.com/docs/assistants/overview

## Other Ressources for building Chatbots

- Build a QA Chatbot with RAG - Step by step tutorial: https://simon-prammer.vercel.app/blog/post/easiest-qa-chatbot
- Easy Chatbot - Introduction to the basics: https://simon-prammer.vercel.app/blog/post/sveltekit-langchain

## Features

This app features:

- Endpoint to create an Assistant with Knowledge Base from a Document
- Endpoint to chat with that Assistant (can pass in assistantId to prevent creating over and over again)
- Minimalistic Chat interface

# Setup

### IMPORTANT - Set environment variables in a .env file (see .env.example for reference).

In the current configuration, you need:

- An OpenAI API Key

### Install dependencies.

```sh
pnpm i
```

### Run the development server at http://localhost:5173/.

```sh
pnpm run dev
```

## Important note

If you build your own example, note that this repos uses a modified vite.config.ts which is necessary to use the environment variables in local development without explicitly declaring them in the code. This is not necessary in production.
