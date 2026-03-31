type ClassInput =
  | string
  | number
  | null
  | undefined
  | false
  | ClassInput[]
  | { [key: string]: boolean | null | undefined };

function flattenClassNames(value: ClassInput): string[] {
  if (!value) {
    return [];
  }

  if (typeof value === "string" || typeof value === "number") {
    return [String(value)];
  }

  if (Array.isArray(value)) {
    return value.flatMap(flattenClassNames);
  }

  return Object.entries(value)
    .filter(([, enabled]) => Boolean(enabled))
    .map(([className]) => className);
}

export function cn(...inputs: ClassInput[]): string {
  return inputs.flatMap(flattenClassNames).join(" ");
}
