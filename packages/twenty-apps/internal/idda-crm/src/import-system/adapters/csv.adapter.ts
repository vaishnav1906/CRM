// Phase 14 — CSV Source Adapter
// Parses a CSV file and emits normalized RawLead objects.
// Usage: npx ts-node scripts/ingest-leads.ts --file leads.csv --source CSV

import fs from 'fs';

export type RawLead = Record<string, unknown>;

export function parseCsvToRawLeads(filePath: string): RawLead[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const record: RawLead = {};
    headers.forEach((header, i) => {
      record[header] = values[i]?.replace(/^"|"$/g, '').trim() ?? '';
    });
    return record;
  });
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let inQuotes = false;
  let current = '';
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === ',' && !inQuotes) { result.push(current); current = ''; continue; }
    current += ch;
  }
  result.push(current);
  return result;
}
