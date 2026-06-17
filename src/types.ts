export interface SystemArchitecture {
  overview: {
    projectName: string;
    summary: string;
    techStack: string[];
    complexity: 'Low' | 'Medium' | 'High';
    estimatedTeamSize: number;
    estimatedTimeline: string;
  };
  architecture: {
    components: {
      id: string;
      name: string;
      type: 'frontend' | 'backend' | 'database' | 'service' | 'external';
      description: string;
      connections: string[];
    }[];
    layers: string[];
  };
  database: {
    tables: {
      name: string;
      fields: {
        name: string;
        type: string;
        constraints: string;
      }[];
      relationships: string[];
    }[];
  };
  api: {
    baseUrl: string;
    endpoints: {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      path: string;
      description: string;
      auth: boolean;
      requestBody: string | null;
      response: string;
    }[];
  };
  sprints: {
    number: number;
    name: string;
    duration: string;
    goals: string[];
    tasks: {
      task: string;
      points: number;
      priority: 'High' | 'Medium' | 'Low';
    }[];
  }[];
  risks: {
    title: string;
    description: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    mitigation: string;
  }[];
}
