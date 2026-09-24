export function hourKey(date = new Date()) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const h = String(date.getUTCHours()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}`;
}

export function prettyHour(key) {
  if (!key) return "";
  const [day, hour] = key.split("T");
  return `${day} · ${hour}:00 UTC`;
}

export const STAFF_HEADLINES = [
  "The presses are warm and the street is quiet.",
  "Someone left a window open on the third floor.",
  "Ink dries slower after midnight. That is the point.",
  "A city of unread notes is still a city.",
  "The hour turns. The paper does not apologize.",
  "If you write it down, it has to stay somewhere.",
  "Public is a choice. Silence is also a choice.",
];

export const STAFF_BLURBS = [
  "No public copy was waiting on the spike, so the night editor ran a house note. Leave something on the desk if you want the next hour to sound like you.",
  "The board is empty of new public work. That is rarer than it looks. The next person who marks a piece public will take this space.",
  "Hourly rotation found nothing released. The desk stays lit anyway.",
];
