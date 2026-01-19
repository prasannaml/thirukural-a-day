import data from "@/data/thirukural_with_mk.json";

export type Kural = {
  Number: number;
  Line1: string;
  Line2: string;
  mk?: string;
  explanation?: string;
  english_mk_translation?: string;
};

function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

// export function getDateKeyUTC(date = new Date()): string {
//   const yyyy = date.getUTCFullYear();
//   const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
//   const dd = String(date.getUTCDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
// }


export function getDateKeyIST(date = new Date()): string {
  // Asia/Kolkata = UTC +05:30
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(date.getTime() + istOffsetMs);

  const yyyy = istDate.getUTCFullYear();
  const mm = String(istDate.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(istDate.getUTCDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}


export function getKuralOfDay(dateKey = getDateKeyIST()): Kural {
  const list = (data as { kural: Kural[] }).kural;

  if (!list?.length) {
    throw new Error("No kurals found in thirukkural.json");
  }

  const index = fnv1a32(dateKey) % list.length;
  return list[index];
}

export function getRandomKural(): Kural {
  const list = (data as { kural: Kural[] }).kural;

  if (!list?.length) {
    throw new Error("No kurals found in thirukkural.json");
  }

  const index = Math.floor(Math.random() * list.length);
  return list[index];
}
