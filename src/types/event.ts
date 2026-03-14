export type Promotion = "njpw" | "ajpw" | "noah" | "ddt";

export interface Event {
  id: string;
  promotion: Promotion;
  date: string; // "YYYY-MM-DD"
  name: string | null;
  venue: string;
  prefecture: string;
  startTime: string | null; // "HH:MM"
  url: string;
}

export const PROMOTIONS: Record<Promotion, { label: string; color: string }> = {
  njpw: { label: "新日本プロレス", color: "#e8141e" },
  ajpw: { label: "全日本プロレス", color: "#0052a4" },
  noah: { label: "プロレスリング・ノア", color: "#00843d" },
  ddt: { label: "DDTプロレスリング", color: "#e07b00" },
};
