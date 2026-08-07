import type { User, Deployment, Log } from "../types";

const BASE = "/api/v1";

export async function signup(
  username: string,
  password: string
): Promise<User> {
  const res = await fetch(`${BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.user;
}

export async function signin(
  username: string,
  password: string
): Promise<User> {
  const res = await fetch(`${BASE}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.user;
}

export async function logout(): Promise<void> {
  const res = await fetch(`${BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
}

export async function getMe(): Promise<User> {
  const res = await fetch(`${BASE}/me`, {
    credentials: "include",
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.user;
}

export async function getDeployments(): Promise<Deployment[]> {
  const res = await fetch(`${BASE}/deployments`, {
    credentials: "include",
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.deployments;
}

export async function getDeploymentDetails(
  id: string
): Promise<Deployment> {
  const res = await fetch(`${BASE}/deployment/${id}`, {
    credentials: "include",
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.details;
}

export async function getLogs(deploymentId: string): Promise<Log[]> {
  const res = await fetch(`${BASE}/deployment/logs/${deploymentId}`, {
    credentials: "include",
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.details;
}

export async function createDeployment(payload: {
  url: string;
  projectName: string;
  directory?: string;
  env?: Record<string, any> | any;
}): Promise<{ url: string; projectName: string; id: string; directory: string }> {
  const res = await fetch(`${BASE}/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.deploymentDetails;
}
