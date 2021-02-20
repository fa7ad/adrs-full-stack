export function getEnv(name: string): string {
  return process.env[name] ?? '';
}
