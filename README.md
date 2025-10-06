# Cloudflare AI Chat Application

This is a complete Cloudflare AI-powered chat application that uses Llama 3.3 via Workers AI. It features a simple chat interface, memory for the last 5 messages per user, and support for multiple users using Durable Objects.

## Features

- Chat interface with text input
- Optional voice input using Web Speech API
- LLM responses from Llama 3.3 on Workers AI
- Session memory for last 5 messages
- Multi-user support via Durable Objects
- Served via Cloudflare Pages and Workers

## Project Structure

```
cf_ai_project/
├─ README.md          # This file
├─ PROMPTS.md         # AI prompts used
├─ package.json       # Dependencies and scripts
├─ wrangler.toml      # Wrangler configuration
├─ worker.js          # Main Worker script
├─ workflow.js        # Workflow logic (optional)
├─ state.js           # Durable Object for state management
└─ pages/             # Frontend files
    ├─ index.html     # Main HTML page
    └─ script.js      # Frontend JavaScript
```

## Setup and Deployment

### Prerequisites

- Node.js installed
- Cloudflare account with Workers and Pages enabled
- Wrangler CLI installed: `npm install -g wrangler`

### Installation

1. Clone or download this project.
2. Navigate to the project directory: `cd cf_ai_project`
3. Install dependencies: `npm install`

### Configuration

1. Login to Wrangler: `wrangler auth login`
2. Update `wrangler.toml` with your account ID and zone ID if needed.
3. For Workers AI, ensure your account has access to Llama 3.3.

### Deployment

1. Deploy the Worker: `wrangler deploy`
2. Deploy the Pages site: `wrangler pages deploy pages/ --project-name your-project-name`

Replace `your-project-name` with a unique name for your Pages project.

### Local Development

- Run Worker locally: `wrangler dev`
- For Pages, you can serve locally with a simple HTTP server, but for full integration, use Wrangler.

## Usage

1. Open the deployed Pages URL.
2. Enter your message in the chat box.
3. Optionally, use the voice button to speak your message.
4. The AI will respond, maintaining context from previous messages.

## API Endpoints

- `POST /chat`: Send a message and receive AI response. Body: `{ "message": "user input", "sessionId": "unique session id" }`

## Notes

- Session IDs are generated client-side for simplicity.
- Memory is limited to last 5 messages per session.
- Voice input requires browser support for Web Speech API.