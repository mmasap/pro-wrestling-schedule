import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";
import type { Event } from "../types/event";

function loadYaml(filename: string): Event[] {
	const filePath = join(process.cwd(), "data", "events", filename);
	const content = readFileSync(filePath, "utf-8");
	return load(content) as Event[];
}

export function getAllEvents(): Event[] {
	const dir = join(process.cwd(), "data", "events");
	const files = readdirSync(dir).filter((f) => f.endsWith(".yaml"));
	return files.flatMap(loadYaml).sort((a, b) => {
		const dateCmp = a.date.localeCompare(b.date);
		if (dateCmp !== 0) return dateCmp;
		if (a.startTime === b.startTime) return 0;
		if (a.startTime === null) return -1;
		if (b.startTime === null) return 1;
		return a.startTime.localeCompare(b.startTime);
	});
}

export function getUniquePrefectures(events: Event[]): string[] {
	return [...new Set(events.map((e) => e.prefecture))].sort();
}
