// Message Passing Mechanisms Implementation
import { MessagePerformatives } from './AgentCommunicationLanguage.js';

export const ChannelTypes = {
  DIRECT: 'direct',
  BROADCAST: 'broadcast',
  TOPIC: 'topic'
};

export class MessageQueue {
  constructor() {
    this.queues = {
      emergency: [],
      high: [],
      normal: [],
      low: []
    };
  }

  enqueue(message, priority = 'normal') {
    if (!this.queues[priority]) throw new Error(`Invalid priority: ${priority}`);
    this.queues[priority].push(message);
  }

  dequeue() {
    return [
      ...this.queues.emergency,
      ...this.queues.high,
      ...this.queues.normal,
      ...this.queues.low
    ].shift();
  }
}

export class MessageChannel {
  constructor(type = ChannelTypes.DIRECT) {
    this.type = type;
    this.subscribers = new Set();
    this.queue = new MessageQueue();
  }

  subscribe(agent) {
    this.subscribers.add(agent);
  }

  unsubscribe(agent) {
    this.subscribers.delete(agent);
  }

  async send(message) {
    const priority = message.performative === MessagePerformatives.REQUEST 
      ? 'high' 
      : 'normal';
    this.queue.enqueue(message, priority);
    
    for (const subscriber of this.subscribers) {
      try {
        await subscriber.receive(message);
      } catch (error) {
        console.error(`Message delivery failed to ${subscriber.id}:`, error);
      }
    }
  }
}

// Core message passing system
export class MessagePassingSystem {
  constructor() {
    this.channels = new Map();
    this.agentRegistry = new Map();
  }

  createChannel(name, type = ChannelTypes.DIRECT) {
    const channel = new MessageChannel(type);
    this.channels.set(name, channel);
    return channel;
  }

  registerAgent(agent) {
    this.agentRegistry.set(agent.id, agent);
  }

  getAgentChannel(agentId) {
    const agent = this.agentRegistry.get(agentId);
    if (!agent) throw new Error(`Agent ${agentId} not registered`);
    return agent.channel;
  }
}

// Conflict detection middleware
export const createConflictDetector = () => next => async message => {
  const conflicts = await checkForConflicts(message);
  if (conflicts.length > 0) {
    throw new Error(`Message conflict detected: ${conflicts.join(', ')}`);
  }
  return next(message);
};

async function checkForConflicts(message) {
  // Implement conflict detection logic
  return [];
}
