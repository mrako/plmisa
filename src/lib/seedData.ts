import type { Task } from "./types";

type SeedItem = {
  group: string;
  name: string;
  resp?: string;
  amount?: string;
  note?: string;
  needsInput?: boolean;
};

function slug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[äå]/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toText(item: SeedItem): string {
  const suffix = item.amount ? ` (${item.amount})` : "";
  const flag = item.needsInput ? " ⚠️" : "";
  return `${item.name}${suffix}${flag}`;
}

export function buildTasksFromSeed(items: SeedItem[], prefix: string): Task[] {
  const counts: Record<string, number> = {};
  return items.map((item) => {
    const base = `${prefix}-${slug(item.group)}-${slug(item.name)}`;
    counts[base] = (counts[base] ?? 0) + 1;
    const id = counts[base] > 1 ? `${base}-${counts[base]}` : base;
    return {
      id,
      text: toText(item),
      done: false,
      responsible: item.resp || undefined,
      note: item.note || undefined,
      group: item.group || undefined,
    };
  });
}

/* Seed data transcribed from seeds-review.md (Pekka + Liina 90v suunnitelma). */

export const TODO_SEED: SeedItem[] = [
  { group: "Muista", name: "Tarjoiluastiat ja ottimet", resp: "Liina" },
  { group: "Muista", name: "Jäkälänmetsästys", resp: "Marko" },
  { group: "Muista", name: "Banh Mi -sämpylät" },
  { group: "Muista", name: "Sunnuntain leipä" },
  { group: "Muista", name: "Flan-resepti + aineet" },
  { group: "Muista", name: "Ruokavalioiden tarkistus" },
  { group: "Muista", name: "Lounaan ja Yöpalan astiat" },
];

export const MISE_SEED: SeedItem[] = [
  // --- Yleiset valmistelut ---
  { group: "Yleiset", name: "Astiat päivälliselle", resp: "Liina" },
  { group: "Yleiset", name: "Viinit (valinta ja tilaus)" },
  { group: "Yleiset", name: "Kahvin keitto ja säilytys", note: "Kesälahdella perkolaattori (n. 90 kuppia) + 2 x 3 l termaria" },
  { group: "Yleiset", name: "Jälkiruoan astiat" },
  { group: "Yleiset", name: "Lounaan juoma" },
  { group: "Yleiset", name: "Focaccia", resp: "Iida" },

  // --- Lauantai: Lounas 13-14.45 ---
  { group: "Lounas", name: "Gazpacho", resp: "Dima", amount: "10–12 L", note: "10 l kattilat löytyy Kesälahdelta" },
  { group: "Lounas", name: "Pico de Gallo (mansikka-tomaatti)", resp: "Marko, Laura, Iida?", amount: "2 L", note: "Valmistus samana aamuna" },
  { group: "Lounas", name: "Tuore leipä (paahdetaan esim. grillillä)" },
  { group: "Lounas", name: "Focaccia", resp: "Iida", amount: "3–4 kpl", note: "Valmistus edellisenä päivänä" },

  // --- Päivällinen: Sälä ---
  { group: "Päivällinen", name: "Boquerones", resp: "Marko", note: "Laivurin valinnasta" },
  { group: "Päivällinen", name: "Skagen", resp: "Marko", amount: "2 L", note: "Valmistus la aamulla" },
  { group: "Päivällinen", name: "Oliivit", resp: "Marko", amount: "2 kg", note: "Rolling cheese" },
  { group: "Päivällinen", name: "Manchego", resp: "Marko", amount: "2 kg", note: "Rolling cheese" },
  { group: "Päivällinen", name: "Saaristolaisleipä", resp: "Mari", amount: "5–6 leipää (1 pala / hlö)", note: "Villa Mari" },
  { group: "Päivällinen", name: "Leikkeleet", resp: "Marko", amount: "max 2 kg", note: "Rolling cheese" },

  // --- Päivällinen: Kasvit ---
  { group: "Päivällinen", name: "Vihreä salaatti" },
  { group: "Päivällinen", name: "Joku toinen salaatti" },
  { group: "Päivällinen", name: "Versot", resp: "Marko" },
  { group: "Päivällinen", name: "Pikkelit (kurkut, punasipuli)", resp: "Iida", note: "Tehdään pari päivää ennen" },
  { group: "Päivällinen", name: "Jääretiisi", resp: "Marko", note: "Sheivaus ja jää" },

  // --- Päivällinen: Proteiini ---
  { group: "Päivällinen", name: "Entrecote", amount: "4–5 kg" },
  { group: "Päivällinen", name: "Savulohi", amount: "4–5 kg" },
  { group: "Päivällinen", name: "Mukulaselleri", amount: "1–2 kg" },
  { group: "Päivällinen", name: "Marinoitu tofu", amount: "1 kg" },

  // --- Jälkiruoka ---
  { group: "Jälkiruoka", name: "Flan", resp: "Dima" },
  { group: "Jälkiruoka", name: "Mansikat", resp: "Liina", amount: "5 x 40 l laatikkoa", note: "Haku pe aamupäivällä" },
  { group: "Jälkiruoka", name: "Keksit", resp: "Iiris", amount: "120 kpl" },
  { group: "Jälkiruoka", name: "Kahvi / Tee", resp: "Marko", amount: "12–16 L" },
  { group: "Jälkiruoka", name: "Karkkinurkka", resp: "Liina", note: "Muista kulhot!" },

  // --- Yöpala ---
  { group: "Yöpala", name: "Banh Mi -leivät" },
  { group: "Yöpala", name: "Gluteeniton banh mi" },
  { group: "Yöpala", name: "Pikkelit (kurkku, punasipuli)", resp: "Iida", note: "Tehdään pari päivää ennen" },
  { group: "Yöpala", name: "Possunkylki" },

  // --- Brunssi ---
  { group: "Brunssi", name: "Puuro" },
  { group: "Brunssi", name: "Munavoi", note: "" },
];

export const RAAKA_SEED: SeedItem[] = [
  { group: "Gazpacho", name: "Tomaatteja (kypsiä)", amount: "8kg", note: "Gazpacho" },
  { group: "Gazpacho", name: "Kurkkuja", amount: "2kg", note: "Gazpacho" },
  { group: "Gazpacho", name: "Paprikoita (punainen/keltainen)", amount: "2kg", note: "Gazpacho" },
  { group: "Gazpacho", name: "Salottisipulia", amount: "1kg", note: "Gazpacho" },
  { group: "Gazpacho", name: "Valkosipulia", amount: "2", note: "Gazpacho" },
  { group: "Gazpacho", name: "Oliiviöljyä", note: "Gazpacho" },
  { group: "Gazpacho", name: "Viinietikkaa (puna- tai valkoviini-)", note: "Gazpacho" },
  { group: "Gazpacho", name: "Vaaleaa leipää", note: "Gazpacho" },
  { group: "Gazpacho", name: "Suola" },
  { group: "Gazpacho", name: "Sokeri" },
  { group: "Gazpacho", name: "Mustapippuri" },

  { group: "Pico de Gallo", name: "Tomaatteja" },
  { group: "Pico de Gallo", name: "Mansikoita" },
  { group: "Pico de Gallo", name: "Punasipulia" },
  { group: "Pico de Gallo", name: "Tuoretta chiliä / habaneroa" },
  { group: "Pico de Gallo", name: "Limettejä" },
  { group: "Pico de Gallo", name: "Korianteri / Persilja / Sitruunaverbena" },

  { group: "Skagen", name: "Katkarapuja", note: "Skagen" },
  { group: "Skagen", name: "Majoneesia", note: "Skagen" },
  { group: "Skagen", name: "Purjoa", note: "Skagen" },
  { group: "Skagen", name: "Chiliä", note: "Skagen" },
  { group: "Skagen", name: "Sitruunoita", note: "Skagen" },
  { group: "Skagen", name: "Tilliä", note: "Skagen" },
  { group: "Skagen", name: "Ruohosipulia", note: "Skagen" },

  { group: "Sälä", name: "Boquerones", amount: "", note: "" },
  { group: "Sälä", name: "Oliivit", amount: "2 kg" },
  { group: "Sälä", name: "Manchego-juusto", amount: "2 kg" },
  { group: "Sälä", name: "Leikkeleet", amount: "max 2 kg" },

  { group: "Salaatit", name: "Vihreän salaatin ainekset" },
  { group: "Salaatit", name: "Toisen salaatin ainekset" },
  { group: "Salaatit", name: "Versot", note: "Petriltä" },

  { group: "Proteiinit", name: "Entrecote", amount: "4–5 kg" },
  { group: "Proteiinit", name: "Savulohi", amount: "4–5 kg" },
  { group: "Proteiinit", name: "Mukulaselleri", amount: "1–2 kg" },
  { group: "Proteiinit", name: "Marinoitu tofu", amount: "1 kg", note: "Valmis tuote tai marinoidaan itse – TARKISTA" },

  { group: "Jälkiruoka", name: "Kananmunia (flan)" },
  { group: "Jälkiruoka", name: "Maitoa / kermaa (flan)", note: "Huomioi 2+1 maidotonta vierasta – tarvitaan maidoton versio tai vaihtoehto" },
  { group: "Jälkiruoka", name: "Sokeria (flan + karamelli)" },
  { group: "Jälkiruoka", name: "Vaniljaa" },
  { group: "Jälkiruoka", name: "Mansikoita", resp: "Liina", amount: "5 x 40 l laatikkoa" },
  { group: "Jälkiruoka", name: "Keksit", resp: "Marko / Iiris", amount: "120 kpl" },
  { group: "Jälkiruoka", name: "Kahvia (suodatin)", note: "12–16 L tarve, perkolaattori n. 90 kupille" },
  { group: "Jälkiruoka", name: "Teetä" },
  { group: "Jälkiruoka", name: "Irtokarkkeja (karkkinurkka)", note: "Muista kulhot!" },

  { group: "Yöpala", name: "Patonkeja / pehmeitä sämpylöitä" },
  { group: "Yöpala", name: "Gluteenittomia sämpylöitä", note: "2+1 gluteenitonta vierasta" },
  { group: "Yöpala", name: "Possunkylkeä (täyte)" },
  { group: "Yöpala", name: "Banh Mi -pikkelit" },
  { group: "Yöpala", name: "Kurkkua" },
  { group: "Yöpala", name: "Tuoretta korianteria" },
  { group: "Yöpala", name: "Majoneesia" },
  { group: "Yöpala", name: "Srirachaa tai muuta chilikastiketta" },

  { group: "Brunssi", name: "Kaurahiutaleita (puuro)" },
  { group: "Brunssi", name: "Maitoa / laktoositonta maitoa (puuro)" },
  { group: "Brunssi", name: "Karjalanpiirakat", resp: "Liina (tilattu)", amount: "150 kpl laktoositonta + 20 maidotonta/gluteenitonta", note: "Haetaan valmiina, Erkki su klo 10" },
  { group: "Brunssi", name: "Voita (munavoihin)" },
  { group: "Brunssi", name: "Hapanjuurileipää", note: "Huomioi myös gluteeniton leipä" },
  { group: "Brunssi", name: "Kinkkua" },
  { group: "Brunssi", name: "Juustoa" },
  { group: "Brunssi", name: "Tuoreita kasviksia (esim. kurkku, tomaatti, paprika)" },
  { group: "Brunssi", name: "Tuoremehua" },
  { group: "Brunssi", name: "Kahvia" },
  { group: "Brunssi", name: "Teetä" },

  { group: "Juomat", name: "Vishy" },
  { group: "Juomat", name: "Mehut" },
  { group: "Juomat", name: "Viinit" },
  { group: "Juomat", name: "Malmgård-olut, 2 kegiä", resp: "Pekka", amount: "2 kegiä" },
];
