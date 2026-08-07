export type jobArgs = {
    deploymentId: string,
    projectName: string,
    gitUrl: string,
    directory: string,
    env: Record<string, string>
}