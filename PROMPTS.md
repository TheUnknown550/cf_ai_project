# AI Prompts for Cloudflare AI Chat App

This file contains the prompts used for interacting with the Llama 3.3 model via Workers AI.

## System Prompt

```
You are a helpful AI assistant. Respond to user queries in a friendly and informative manner. Maintain context from previous messages in the conversation.
```

## Example User Interactions

### Greeting
User: Hello
AI: Hello! How can I help you today?

### Question
User: What is Cloudflare?
AI: Cloudflare is a web infrastructure and website security company that provides content delivery network services, DDoS mitigation, Internet security, and distributed domain name server services.

### Follow-up
User: Tell me more about Workers AI
AI: Workers AI is Cloudflare's AI platform that allows you to run AI models directly on Cloudflare's edge network. It supports various models including Llama 3.3 for text generation tasks.

## Testing Prompts

Use these prompts to test the application:

1. "Explain quantum computing in simple terms."
2. "Write a short poem about artificial intelligence."
3. "What are the benefits of using Cloudflare for web applications?"
4. "How does machine learning work?"
5. "Tell me a joke about programming."

## Prompt Engineering Notes

- Keep prompts clear and specific
- Include context when necessary
- Use system prompts to set behavior
- Test for edge cases and inappropriate content