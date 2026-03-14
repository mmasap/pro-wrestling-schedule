import { useMemo, useState } from "preact/hooks";
import type { Event, Promotion } from "../types/event";
import { PROMOTIONS } from "../types/event";

interface Props {
	events: Event[];
}

const DAYS = ["日", "月", "火", "水", "木", "金", "土"];

const PREFECTURE_GROUPS: { label: string; prefectures: string[] }[] = [
	{ label: "北海道", prefectures: ["北海道"] },
	{
		label: "東北",
		prefectures: ["青森", "岩手", "宮城", "秋田", "山形", "福島"],
	},
	{
		label: "関東",
		prefectures: ["茨城", "栃木", "群馬", "埼玉", "千葉", "東京", "神奈川"],
	},
	{
		label: "中部",
		prefectures: [
			"新潟",
			"富山",
			"石川",
			"福井",
			"山梨",
			"長野",
			"岐阜",
			"静岡",
			"愛知",
		],
	},
	{
		label: "近畿",
		prefectures: ["三重", "滋賀", "京都", "大阪", "兵庫", "奈良", "和歌山"],
	},
	{ label: "中国", prefectures: ["鳥取", "島根", "岡山", "広島", "山口"] },
	{ label: "四国", prefectures: ["徳島", "香川", "愛媛", "高知"] },
	{
		label: "九州・沖縄",
		prefectures: [
			"福岡",
			"佐賀",
			"長崎",
			"熊本",
			"大分",
			"宮崎",
			"鹿児島",
			"沖縄",
		],
	},
];

function formatDate(dateStr: string): string {
	const date = new Date(`${dateStr}T00:00:00`);
	const [y, m, d] = dateStr.split("-");
	return `${y}/${parseInt(m, 10)}/${parseInt(d, 10)}(${DAYS[date.getDay()]})`;
}

function todayStr(): string {
	const t = new Date();
	const y = t.getFullYear();
	const m = String(t.getMonth() + 1).padStart(2, "0");
	const d = String(t.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

function getInitialPromotions(): Set<Promotion> {
	const allKeys = Object.keys(PROMOTIONS) as Promotion[];
	if (typeof window === "undefined") return new Set(allKeys);
	const param = new URLSearchParams(window.location.search).get("promotion");
	if (!param) return new Set(allKeys);
	const selected = param
		.split(",")
		.filter((p): p is Promotion => allKeys.includes(p as Promotion));
	return selected.length > 0 ? new Set(selected) : new Set(allKeys);
}

export default function EventFilter({ events }: Props) {
	const today = todayStr();

	const futureEvents = useMemo(
		() => events.filter((e) => e.date >= today),
		[events],
	);

	const [selectedPromotions, setSelectedPromotions] = useState<Set<Promotion>>(
		getInitialPromotions,
	);
	const [selectedYearMonth, setSelectedYearMonth] = useState("all");
	const [selectedRegion, setSelectedRegion] = useState("all");
	const [selectedPrefecture, setSelectedPrefecture] = useState("all");

	const yearMonthOptions = useMemo(() => {
		const set = new Set(futureEvents.map((e) => e.date.slice(0, 7)));
		return [...set].sort().map((ym) => {
			const [y, m] = ym.split("-");
			return { value: ym, label: `${y}年${parseInt(m, 10)}月` };
		});
	}, [futureEvents]);

	const regionPrefectures = useMemo(() => {
		if (selectedRegion === "all") return null;
		return (
			PREFECTURE_GROUPS.find((g) => g.label === selectedRegion)?.prefectures ??
			[]
		);
	}, [selectedRegion]);

	function handleRegionChange(region: string) {
		setSelectedRegion(region);
		setSelectedPrefecture("all");
	}

	const filtered = useMemo(() => {
		return futureEvents.filter((e) => {
			if (!selectedPromotions.has(e.promotion)) return false;
			if (selectedYearMonth !== "all" && !e.date.startsWith(selectedYearMonth))
				return false;
			if (regionPrefectures && !regionPrefectures.includes(e.prefecture))
				return false;
			if (selectedPrefecture !== "all" && e.prefecture !== selectedPrefecture)
				return false;
			return true;
		});
	}, [
		futureEvents,
		selectedPromotions,
		selectedYearMonth,
		regionPrefectures,
		selectedPrefecture,
	]);

	function togglePromotion(p: Promotion) {
		setSelectedPromotions((prev) => {
			const next = new Set(prev);
			next.has(p) ? next.delete(p) : next.add(p);
			const allKeys = Object.keys(PROMOTIONS) as Promotion[];
			const params = new URLSearchParams(window.location.search);
			if (next.size === allKeys.length) {
				params.delete("promotion");
			} else {
				params.set("promotion", [...next].join(","));
			}
			const qs = params.toString();
			history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
			return next;
		});
	}

	const selectClass =
		"w-full bg-zinc-900 border border-zinc-600 text-zinc-100 text-sm rounded px-3 py-2 focus:outline-none focus:border-zinc-400";

	return (
		<div class="space-y-4">
			{/* 団体フィルター */}
			<div class="space-y-1.5">
				<span class="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
					団体
				</span>
				<div class="flex flex-wrap gap-2">
					{(
						Object.entries(PROMOTIONS) as [
							Promotion,
							{ label: string; color: string },
						][]
					).map(([key, { label, color }]) => {
						const active = selectedPromotions.has(key);
						return (
							<button
								type="button"
								key={key}
								onClick={() => togglePromotion(key)}
								class="px-3 py-1.5 rounded-full text-sm border-2 font-medium transition-all cursor-pointer"
								style={
									active
										? `background:${color};border-color:${color};color:#fff`
										: `background:transparent;border-color:${color};color:${color}`
								}
							>
								{label}
							</button>
						);
					})}
				</div>
			</div>

			{/* 月・地域フィルター */}
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
				<div class="space-y-1.5">
					<span class="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
						月
					</span>
					<select
						value={selectedYearMonth}
						onChange={(e) =>
							setSelectedYearMonth((e.target as HTMLSelectElement).value)
						}
						class={selectClass}
					>
						<option value="all">全期間</option>
						{yearMonthOptions.map(({ value, label }) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</select>
				</div>

				<div class="space-y-1.5">
					<span class="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
						地域
					</span>
					<select
						value={selectedRegion}
						onChange={(e) =>
							handleRegionChange((e.target as HTMLSelectElement).value)
						}
						class={selectClass}
					>
						<option value="all">すべての地域</option>
						{PREFECTURE_GROUPS.map(({ label }) => (
							<option key={label} value={label}>
								{label}
							</option>
						))}
					</select>
				</div>

				<div class="space-y-1.5">
					<span class="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
						都道府県
					</span>
					<select
						value={selectedPrefecture}
						onChange={(e) =>
							setSelectedPrefecture((e.target as HTMLSelectElement).value)
						}
						class={selectClass}
					>
						<option value="all">すべて</option>
						{(
							regionPrefectures ??
							PREFECTURE_GROUPS.flatMap((g) => g.prefectures)
						).map((p) => (
							<option key={p} value={p}>
								{p}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* 件数 */}
			<p class="text-xs text-zinc-500">{filtered.length} 件</p>

			{/* カード（モバイル） */}
			<div class="sm:hidden space-y-2">
				{filtered.length === 0 ? (
					<p class="py-10 text-center text-zinc-500">
						該当する興行はありません。
					</p>
				) : (
					filtered.map((e) => (
						<div
							key={e.id}
							class="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 space-y-1"
						>
							<div class="flex items-center gap-2">
								<span
									class="inline-block px-2 py-0.5 rounded text-xs font-bold text-white tracking-wide shrink-0"
									style={`background:${PROMOTIONS[e.promotion].color}`}
								>
									{e.promotion.toUpperCase()}
								</span>
								<span class="text-xs text-zinc-400 tabular-nums">
									{formatDate(e.date)}
									{e.startTime && ` ${e.startTime}〜`}
								</span>
							</div>
							<div class="text-sm font-medium text-zinc-100">
								{e.url ? (
									<a
										href={e.url}
										target="_blank"
										rel="noopener noreferrer"
										class="hover:underline"
									>
										{e.name ?? "（未定）"}
									</a>
								) : (
									(e.name ?? "（未定）")
								)}
							</div>
							<div class="text-xs text-zinc-400">
								{e.venue}
								{e.prefecture && (
									<span class="text-zinc-600">　{e.prefecture}</span>
								)}
							</div>
						</div>
					))
				)}
			</div>

			{/* テーブル（デスクトップ） */}
			<div class="hidden sm:block overflow-x-auto rounded-lg border border-zinc-800">
				<table class="w-full text-sm border-collapse">
					<thead>
						<tr class="bg-zinc-900 border-b border-zinc-700">
							<th class="text-left px-4 py-2.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap w-36">
								日付
							</th>
							<th class="text-left px-4 py-2.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap w-20">
								団体
							</th>
							<th class="text-left px-4 py-2.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
								大会名
							</th>
							<th class="text-left px-4 py-2.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
								会場
							</th>
							<th class="text-left px-4 py-2.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap w-20">
								都道府県
							</th>
						</tr>
					</thead>
					<tbody>
						{filtered.map((e, i) => (
							<tr
								key={e.id}
								class={`border-b border-zinc-800 hover:bg-zinc-900 transition-colors ${
									i % 2 === 0 ? "" : "bg-zinc-950"
								}`}
							>
								<td class="px-4 py-2.5 whitespace-nowrap text-zinc-300 tabular-nums">
									<div>{formatDate(e.date)}</div>
									{e.startTime && (
										<div class="text-xs text-zinc-500">{e.startTime}〜</div>
									)}
								</td>
								<td class="px-4 py-2.5 whitespace-nowrap">
									<span
										class="inline-block px-2 py-0.5 rounded text-xs font-bold text-white tracking-wide"
										style={`background:${PROMOTIONS[e.promotion].color}`}
									>
										{e.promotion.toUpperCase()}
									</span>
								</td>
								<td class="px-4 py-2.5 text-zinc-100">
									{e.url ? (
										<a
											href={e.url}
											target="_blank"
											rel="noopener noreferrer"
											class="hover:underline"
										>
											{e.name ?? "（未定）"}
										</a>
									) : (
										(e.name ?? "（未定）")
									)}
								</td>
								<td class="px-4 py-2.5 text-zinc-300">{e.venue}</td>
								<td class="px-4 py-2.5 text-zinc-500">{e.prefecture}</td>
							</tr>
						))}
					</tbody>
				</table>
				{filtered.length === 0 && (
					<p class="py-10 text-center text-zinc-500">
						該当する興行はありません。
					</p>
				)}
			</div>
		</div>
	);
}
