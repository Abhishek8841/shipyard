export type DeploymentStatus =
  | "PENDING"
  | "QUEUED"
  | "BUILDING"
  | "DEPLOYING"
  | "READY"
  | "FAILED";

export interface User {
  id: string;
  username: string;
}

export interface Deployment {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  gitUrl: string;
  projectName: string;
  status: DeploymentStatus;
  directory: string;
  env: Record<string, string> | null;
}

export interface Log {
  id: string;
  deploymentId: string;
  message: string;
  createdAt: string;
}
