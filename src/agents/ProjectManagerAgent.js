import { ChannelTypes } from '../collaboration/MessagePassingMechanisms.js';
import { MessagePerformatives, Ontologies, createACLValidator, ProtocolHandlers } from '../collaboration/AgentCommunicationLanguage.js';

const ConflictTypes = {
  RESOURCE_CONTENTION: 'resource',
  SCHEDULING_CONFLICT: 'scheduling',
  DATA_DISCREPANCY: 'data'
};

const ResolutionStrategies = {
  ARBITRATION: 'arbitration',
  VOTING: 'voting',
  PRIORITY: 'priority'
};

const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  BLOCKED: 'blocked',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

const AgentStatus = {
  IDLE: 'idle',
  BUSY: 'busy',
  OVERLOADED: 'overloaded',
  OFFLINE: 'offline'
};

export class ProjectManagerAgent {
  constructor(messageSystem) {
    this.id = `project-manager-${window.crypto.randomUUID()}`;
    this.messageSystem = messageSystem;
    this.taskRegistry = new Map();
    this.agentRegistry = new Map();
    this.conflictHistory = new Map();
    this.workflowMetrics = {
      tasksCompleted: 0,
      tasksInProgress: 0,
      totalAgents: 0,
      averageCompletionTime: 0
    };
    
    this.channel = this.messageSystem?.createChannel(
      'project-management', 
      ChannelTypes.BROADCAST
    );
    
    this.setupMessageHandlers();
  }

  setupMessageHandlers() {
    this.channel?.subscribe({
      id: this.id,
      receive: message => this.handleMessage(message)
    });
  }

  handleMessage(message) {
    const handler = ProtocolHandlers[message.performative];
    if (handler) {
      handler.call(this, message);
    }
  }

  async assignTasks() {
    const availableAgents = [...this.agentRegistry.values()]
      .filter(agent => this.getAgentStatus(agent) !== AgentStatus.OVERLOADED);

    for (const [taskId, task] of this.taskRegistry) {
      if (task.status === TaskStatus.PENDING) {
        const bestAgent = await this.findBestAgent(task, availableAgents);
        if (bestAgent) {
          await this.delegateTask(task, bestAgent);
        }
      }
    }

    return this.generateWorkflowReport();
  }

  async findBestAgent(task, agents) {
    const capabilities = await Promise.all(
      agents.map(async agentId => {
        const agent = this.agentRegistry.get(agentId);
        return agent.getCapabilities();
      })
    );

    const scores = capabilities.map(cap => 
      Object.keys(task.requirements).reduce((score, req) => 
        score + (cap[req] || 0), 0)
    );

    const bestMatchIndex = scores.indexOf(Math.max(...scores));
    return agents[bestMatchIndex];
  }

  getAgentStatus(agent) {
    const taskCount = [...this.taskRegistry.values()]
      .filter(task => task.assignedTo === agent.id 
        && task.status === TaskStatus.IN_PROGRESS).length;

    if (taskCount === 0) return AgentStatus.IDLE;
    if (taskCount <= agent.capacity) return AgentStatus.BUSY;
    return AgentStatus.OVERLOADED;
  }

  async generateWorkflowReport() {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: { ...this.workflowMetrics },
      agentStatus: {},
      taskBreakdown: this.getTaskBreakdown(),
      bottlenecks: await this.identifyBottlenecks(),
      recommendations: []
    };

    // Generate agent status summary
    for (const [agentId, agent] of this.agentRegistry) {
      report.agentStatus[agentId] = this.getAgentStatus(agent);
    }

    // Generate recommendations
    report.recommendations = this.generateRecommendations(report);

    return report;
  }

  getTaskBreakdown() {
    const breakdown = Object.values(TaskStatus).reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});

    for (const task of this.taskRegistry.values()) {
      breakdown[task.status]++;
    }

    return breakdown;
  }

  async identifyBottlenecks() {
    const bottlenecks = [];

    // Check for overloaded agents
    const overloadedAgents = [...this.agentRegistry.entries()]
      .filter(([_, agent]) => this.getAgentStatus(agent) === AgentStatus.OVERLOADED);
    
    if (overloadedAgents.length > 0) {
      bottlenecks.push({
        type: 'resource_contention',
        description: 'Multiple agents are overloaded',
        affectedAgents: overloadedAgents.map(([id]) => id)
      });
    }

    // Check for blocked tasks
    const blockedTasks = [...this.taskRegistry.entries()]
      .filter(([_, task]) => task.status === TaskStatus.BLOCKED);
    
    if (blockedTasks.length > 0) {
      bottlenecks.push({
        type: 'task_blockage',
        description: 'Tasks are blocked waiting for dependencies',
        affectedTasks: blockedTasks.map(([id]) => id)
      });
    }

    return bottlenecks;
  }

  generateRecommendations(report) {
    const recommendations = [];

    // Resource allocation recommendations
    if (report.bottlenecks.some(b => b.type === 'resource_contention')) {
      recommendations.push({
        type: 'scaling',
        description: 'Consider increasing agent capacity or adding more agents',
        priority: 'high'
      });
    }

    // Task management recommendations
    const { BLOCKED, FAILED } = TaskStatus;
    if (report.taskBreakdown[BLOCKED] > 0 || report.taskBreakdown[FAILED] > 0) {
      recommendations.push({
        type: 'workflow',
        description: 'Review task dependencies and failure patterns',
        priority: 'high'
      });
    }

    // Performance optimization recommendations
    if (report.metrics.averageCompletionTime > this.targetCompletionTime) {
      recommendations.push({
        type: 'optimization',
        description: 'Investigate ways to improve task processing efficiency',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  // Monitoring subsystem
  startMonitoring(interval = 5000) {
    this.monitorInterval = setInterval(() => {
      this.checkSystemHealth();
      this.verifyProgress();
      this.auditTasks();
      this.updateMetrics();
    }, interval);
  }

  async checkSystemHealth() {
    for (const [agentId, agent] of this.agentRegistry) {
      const health = await agent.getHealthStatus();
      if (health.status !== 'OK') {
        this.handleAgentFailure(agentId, health);
      }
    }
  }

  verifyProgress() {
    const currentProgress = this.calculateOverallProgress();
    if (currentProgress < this.expectedProgress) {
      this.triggerCorrectiveActions();
    }
  }

  auditTasks() {
    const overdueTasks = [...this.taskRegistry.values()]
      .filter(task => !task.complete && task.deadline < Date.now());
    
    if (overdueTasks.length > 0) {
      this.reprioritizeTasks(overdueTasks);
    }
  }

  updateMetrics() {
    const tasks = [...this.taskRegistry.values()];
    
    this.workflowMetrics = {
      tasksCompleted: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
      tasksInProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
      totalAgents: this.agentRegistry.size,
      averageCompletionTime: this.calculateAverageCompletionTime(tasks)
    };
  }

  calculateAverageCompletionTime(tasks) {
    const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED);
    if (completedTasks.length === 0) return 0;
    
    const totalTime = completedTasks.reduce((sum, task) => 
      sum + (task.completedAt - task.startedAt), 0);
    return totalTime / completedTasks.length;
  }
}

// Initialize with message system
export const createProjectManager = (messageSystem) => {
  return new ProjectManagerAgent(messageSystem);
};
