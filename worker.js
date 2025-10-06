// worker.js - Main Cloudflare Worker script for AI chat application

// Import the Durable Object class
import { ChatSession } from './state.js';

// Handle incoming requests
export default {
  async fetch(request, env) {
    // CORS headers for web requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST requests for chat
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const url = new URL(request.url);

      // Route to chat endpoint
      if (url.pathname === '/chat') {
        return await handleChat(request, env, corsHeaders);
      }

      // Default response
      return new Response('Not found', { status: 404, headers: corsHeaders });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal server error', { status: 500, headers: corsHeaders });
    }
  },
};

// Handle chat requests
async function handleChat(request, env, corsHeaders) {
  const { message, sessionId } = await request.json();

  // Validate input
  if (!message || !sessionId) {
    return new Response(JSON.stringify({ error: 'Missing message or sessionId' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Get or create Durable Object for this session
  const id = env.CHAT_SESSION.idFromName(sessionId);
  const stub = env.CHAT_SESSION.get(id);

  // Send message to Durable Object and get response
  const response = await stub.fetch(request);

  return new Response(response.body, {
    status: response.status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Export Durable Object class
export { ChatSession };