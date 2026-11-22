/** Extracts the model ID from a `/models/<id>` pathname, or undefined. */
export function parseModelId(pathname: string): string | undefined {
  const match = /^\/models\/([^/]+)\/?$/.exec(pathname)
  if (!match) return undefined
  try {
    return decodeURIComponent(match[1])
  } catch {
    return undefined
  }
}
