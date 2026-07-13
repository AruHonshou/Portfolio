const sensitivePatterns = [
  /(?:password|contrasena|contraseña|api[_ -]?key|secret|token)\s*[:=]\s*\S+/gi,
  /\b\d{1,3}(?:\.\d{1,3}){3}\b/g,
  /\b\d{3,4}[- ]?\d{4}\b/g,
];

export function sanitizePublicText(value: string): string {
  return sensitivePatterns.reduce((result, pattern) => result.replace(pattern, "[redacted]"), value);
}

export function isPublicSafe(value: string): boolean {
  return sensitivePatterns.every((pattern) => {
    pattern.lastIndex = 0;
    return !pattern.test(value);
  });
}
