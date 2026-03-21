export type AgentType = 'chat' | 'input-output' | 'example';

export type Issue = {
  id: string;
  title: string;
  author: string;
  status: 'open' | 'closed';
  createdAt: string;
  commentsCount: number;
};

export type PullRequest = {
  id: string;
  title: string;
  author: string;
  status: 'open' | 'merged' | 'closed';
  createdAt: string;
};

export type Agent = {
  id: string;
  name: string;
  owner: string;
  ownerAvatar?: string;
  description: string;
  tags: string[];
  type: AgentType;
  rating: number;
  runs: string;
  stars: number;
  forks: number;
  issuesCount: number;
  pullRequestsCount: number;
  readme: string;
  promptTemplate: string;
  configYaml: string;
  metadataJson: string;
  usageCode: string;
  category: string;
  updatedAt: string;
  exampleInput?: string;
  exampleOutput?: string;
  issues?: Issue[];
  pullRequests?: PullRequest[];
};

export type User = {
  username: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  location: string;
  website: string;
  twitter: string;
};
