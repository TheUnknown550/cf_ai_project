// state.js - Durable Object for managing chat sessions and memory

export class ChatSession {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  // Handle fetch requests to the Durable Object
  async fetch(request) {
    const { message } = await request.json();

    // Get current conversation history
    let history = await this.state.storage.get('history') || [];

    // Add user message to history
    history.push({ role: 'user', content: message });

    // Keep only last 5 messages (including this one)
    if (history.length > 5) {
      history = history.slice(-5);
    }

    // Prepare messages for AI (include system prompt)
    const systemPrompt = {
      role: 'system',
      content: 'You are a helpful AI assistant. Respond to user queries in a friendly and informative manner. Maintain context from previous messages in the conversation.'
    };

    const messages = [systemPrompt, ...history];

    try {
      // Query Workers AI with Llama 3.3
      const aiResponse = await this.env.AI.run('@cf/meta/llama-3.3-70b-instruct', {
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      const aiMessage = aiResponse.response;

      // Add AI response to history
      history.push({ role: 'assistant', content: aiMessage });

      // Save updated history
      await this.state.storage.put('history', history);

      // Return AI response
      return new Response(JSON.stringify({ response: aiMessage }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('AI query error:', error);
      return new Response(JSON.stringify({ error: 'Failed to get AI response' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}