
export interface Dependency {
  name: string;
  path: string;
  url: string;
  license: string;
  description: string;
}

export type BuildStepStatus = 'pending' | 'building' | 'complete' | 'failed';

export interface BuildStep {
  title: string;
  instructions: string[];
  command?: string;
}

export interface BuildStepWithStatus extends BuildStep {
  status: BuildStepStatus;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
