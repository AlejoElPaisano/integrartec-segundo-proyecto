import type { Command } from "./schema";

export function filterCommands(commands: Command[], query: string): Command[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return commands;
  return commands.filter((command) => {
    const labelMatch = command.label.toLowerCase().includes(trimmed);
    const keywordsMatch = command.keywords?.some((keyword) =>
      keyword.toLowerCase().includes(trimmed)
    );
    return labelMatch || Boolean(keywordsMatch);
  });
}
