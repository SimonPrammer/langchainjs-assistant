# LangchainJS Assistant (Template)

This is a minimal viable example of a Chatbot based on the new Assistant's API of OpenAI utilizing LangchainJS abstractions.

The JavaScript framework of choice is SvelteKit, however the code should be easily transferable to other frameworks (most is just simple JavaScript / Node.js code ).

The Template is held purposefully simple in its implementation while still beeing fully functional.

It is best used as reference to learn the basics of how the new Assistant API works and how to use it with LangchainJS.
It is by no means a finished product and should be extended to fit your needs.

## Links

- Deployed version: https://svelte-chat-langchain.vercel.app/

## Other Ressources

- Build a QA Chatbot - Step by step tutorial: https://simon-prammer.vercel.app/blog/post/easiest-qa-chatbot
- Easy Chatbot - Introduction: https://simon-prammer.vercel.app/blog/post/sveltekit-langchain

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
