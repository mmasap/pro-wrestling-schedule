import { readFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";
import type { Event } from "../types/event";

function loadYaml(filename: string): Event[] {
	const filePath = join(process.cwd(), "data", "events", filename);
	const content = readFileSync(filePath, "utf-8");
	return load(content) as Event[];
}

export function getAllEvents(): Event[] {
	const files = ["njpw_2026.yaml"];
	return files.flatMap(loadYaml).sort((a, b) => a.date.localeCompare(b.date));
}

export function getUniquePrefectures(events: Event[]): string[] {
	return [...new Set(events.map((e) => e.prefecture))].sort();
}
