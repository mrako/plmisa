import type { Day, Task } from "./types";

type SeedItem = {
  group: string;
  name: string;
  resp?: string;
  amount?: string;
  note?: string;
  needsInput?: boolean;
  day?: Day;
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
    const base = item.group
      ? `${prefix}-${slug(item.group)}-${slug(item.name)}`
      : `${prefix}-${slug(item.name)}`;
    counts[base] = (counts[base] ?? 0) + 1;
    const id = counts[base] > 1 ? `${base}-${counts[base]}` : base;
    return {
      id,
      text: toText(item),
      done: false,
      responsible: item.resp || undefined,
      note: item.note || undefined,
      group: item.group || undefined,
      day: item.day,
    };
  });
}

/* Seed data reconciled with the live production list (Pekka + Liina 90v suunnitelma).
   Deletions/additions made live in the app have been carried over here.
   `day` is a best-effort guess — please review and correct. */

export const TODO_SEED: SeedItem[] = [
  { group: "", name: "Tarjoiluastiat ja ottimet", resp: "Liina", day: "Pe" },
  { group: "", name: "Jäkälänmetsästys", resp: "Marko", day: "Pe" },
  { group: "", name: "Banh Mi -sämpylät", day: "Pe" },
  { group: "", name: "Sunnuntain leipä", day: "Pe" },
  { group: "", name: "Flan-resepti + aineet", day: "Pe" },
  { group: "", name: "Ruokavalioiden tarkistus", day: "Pe" },
  { group: "", name: "Lounaan ja Yöpalan astiat", day: "Pe" },
];

export const MISE_SEED: SeedItem[] = [
  // --- Yleiset valmistelut ---
  { group: "Yleiset", name: "Kahvin keitto ja säilytys", note: "Kesälahdella perkolaattori (n. 90 kuppia) + 2 x 3 l termaria", day: "Pe" },
  { group: "Yleiset", name: "Jälkiruoan astiat", day: "Pe" },
  { group: "Yleiset", name: "Lounaan juoma", day: "Pe" },

  // --- Lauantai: Lounas 13-14.45 ---
  { group: "Lounas", name: "Gazpacho", resp: "Dima", amount: "10–12 L", note: "10 l kattilat löytyy Kesälahdelta", day: "La" },
  { group: "Lounas", name: "Pico de Gallo (mansikka-tomaatti)", resp: "Marko, Laura, Iida?", amount: "2 L", note: "Valmistus samana aamuna", day: "La" },
  { group: "Lounas", name: "Tuore leipä (paahdetaan esim. grillillä)", day: "La" },
  { group: "Lounas", name: "Focaccia", resp: "Iida", amount: "3–4 kpl", note: "Valmistus edellisenä päivänä", day: "La" },

  // --- Päivällinen ---
  { group: "Päivällinen", name: "Saaristolaisleipä", resp: "Mari", amount: "5–6 leipää (1 pala / hlö)", note: "Villa Mari", day: "La" },
  { group: "Päivällinen", name: "Skagen", resp: "Marko", day: "La" },
  { group: "Päivällinen", name: "Vihreä salaatti", day: "La" },
  { group: "Päivällinen", name: "Joku toinen salaatti", day: "La" },
  { group: "Päivällinen", name: "Pikkelit (kurkut, punasipuli)", resp: "Iida", note: "Tehdään pari päivää ennen", day: "La" },
  { group: "Päivällinen", name: "Jääretiisi", resp: "Marko", note: "Sheivaus ja jää", day: "La" },
  { group: "Päivällinen", name: "Entrecote", amount: "4–5 kg", day: "La" },
  { group: "Päivällinen", name: "Savulohi", amount: "4–5 kg", day: "La" },
  { group: "Päivällinen", name: "Mukulaselleri", amount: "1–2 kg", day: "La" },
  { group: "Päivällinen", name: "Marinoitu tofu", amount: "1 kg", day: "La" },

  // --- Jälkiruoka ---
  { group: "Jälkiruoka", name: "Flan", resp: "Dima", day: "La" },
  { group: "Jälkiruoka", name: "Keksit", resp: "Iiris", amount: "120 kpl", day: "La" },
  { group: "Jälkiruoka", name: "Kahvi / Tee", resp: "Marko", amount: "12–16 L", day: "La" },

  // --- Yöpala ---
  { group: "Yöpala", name: "Banh Mi -leivät", day: "La" },
  { group: "Yöpala", name: "Gluteeniton banh mi", day: "La" },
  { group: "Yöpala", name: "Possunkylki", day: "La" },

  // --- Brunssi ---
  { group: "Brunssi", name: "Puuro", day: "Su" },
  { group: "Brunssi", name: "Munavoi", note: "", day: "Su" },
];

export const RAAKA_SEED: SeedItem[] = [
  { group: "Gazpacho", name: "Tomaatteja (kypsiä)", amount: "8kg", note: "Gazpacho", day: "La" },
  { group: "Gazpacho", name: "Kurkkuja", amount: "2kg", note: "Gazpacho", day: "La" },
  { group: "Gazpacho", name: "Paprikoita (punainen/keltainen)", amount: "2kg", note: "Gazpacho", day: "La" },
  { group: "Gazpacho", name: "Salottisipulia", amount: "1kg", note: "Gazpacho", day: "La" },
  { group: "Gazpacho", name: "Valkosipulia", amount: "2", note: "Gazpacho", day: "La" },
  { group: "Gazpacho", name: "Oliiviöljyä", note: "Gazpacho", day: "La" },
  { group: "Gazpacho", name: "Viinietikkaa (puna- tai valkoviini-)", note: "Gazpacho", day: "La" },
  { group: "Gazpacho", name: "Suola", day: "La" },
  { group: "Gazpacho", name: "Sokeri", day: "La" },
  { group: "Gazpacho", name: "Mustapippuri", day: "La" },

  { group: "Pico de Gallo", name: "Mansikoita", day: "La" },
  { group: "Pico de Gallo", name: "Punasipulia", day: "La" },
  { group: "Pico de Gallo", name: "Tuoretta chiliä / habaneroa", day: "La" },
  { group: "Pico de Gallo", name: "Limettejä", day: "La" },
  { group: "Pico de Gallo", name: "Korianteri / Persilja / Sitruunaverbena", day: "La" },

  { group: "Skagen", name: "Katkarapuja", note: "Skagen", day: "La" },
  { group: "Skagen", name: "Majoneesia", note: "Skagen", day: "La" },
  { group: "Skagen", name: "Purjoa", note: "Skagen", day: "La" },
  { group: "Skagen", name: "Chiliä", note: "Skagen", day: "La" },
  { group: "Skagen", name: "Sitruunoita", note: "Skagen", day: "La" },
  { group: "Skagen", name: "Tilliä", note: "Skagen", day: "La" },
  { group: "Skagen", name: "Ruohosipulia", note: "Skagen", day: "La" },

  { group: "Sälä", name: "Boquerones", day: "La" },
  { group: "Sälä", name: "Oliivit", amount: "2 kg", day: "La" },
  { group: "Sälä", name: "Manchego-juusto", amount: "2 kg", day: "La" },
  { group: "Sälä", name: "Leikkeleet", amount: "max 2 kg", day: "La" },

  { group: "Salaatit", name: "Vihreän salaatin ainekset", day: "La" },
  { group: "Salaatit", name: "Toisen salaatin ainekset", day: "La" },
  { group: "Salaatit", name: "Versot", note: "Petriltä", day: "La" },

  { group: "Proteiinit", name: "Entrecote", amount: "4–5 kg", day: "La" },
  { group: "Proteiinit", name: "Savulohi", amount: "4–5 kg", day: "La" },
  { group: "Proteiinit", name: "Mukulaselleri", amount: "1–2 kg", day: "La" },
  { group: "Proteiinit", name: "Marinoitu tofu", amount: "1 kg", note: "Valmis tuote tai marinoidaan itse – TARKISTA", day: "La" },

  { group: "Jälkiruoka", name: "Kananmunia (flan)", day: "La" },
  { group: "Jälkiruoka", name: "Maitoa / kermaa (flan)", note: "Huomioi 2+1 maidotonta vierasta – tarvitaan maidoton versio tai vaihtoehto", day: "La" },
  { group: "Jälkiruoka", name: "Sokeria (flan + karamelli)", day: "La" },
  { group: "Jälkiruoka", name: "Vaniljaa", day: "La" },
  { group: "Jälkiruoka", name: "Mansikoita", resp: "Liina", amount: "5 x 40 l laatikkoa", day: "La" },
  { group: "Jälkiruoka", name: "Keksit", resp: "Marko / Iiris", amount: "120 kpl", day: "La" },
  { group: "Jälkiruoka", name: "Irtokarkkeja (karkkinurkka)", note: "Muista kulhot!", day: "La" },

  { group: "Yöpala", name: "Patonkeja / pehmeitä sämpylöitä", day: "La" },
  { group: "Yöpala", name: "Gluteenittomia sämpylöitä", note: "2+1 gluteenitonta vierasta", day: "La" },
  { group: "Yöpala", name: "Possunkylkeä (täyte)", day: "La" },
  { group: "Yöpala", name: "Banh Mi -pikkelit", day: "La" },
  { group: "Yöpala", name: "Kurkkua", day: "La" },
  { group: "Yöpala", name: "Tuoretta korianteria", day: "La" },
  { group: "Yöpala", name: "Majoneesia", day: "La" },
  { group: "Yöpala", name: "Srirachaa tai muuta chilikastiketta", day: "La" },

  { group: "Brunssi", name: "Kaurahiutaleita (puuro)", day: "Su" },
  { group: "Brunssi", name: "Maitoa / laktoositonta maitoa (puuro)", day: "Su" },
  { group: "Brunssi", name: "Karjalanpiirakat", resp: "Liina (tilattu)", amount: "150 kpl laktoositonta + 20 maidotonta/gluteenitonta", note: "Haetaan valmiina, Erkki su klo 10", day: "Su" },
  { group: "Brunssi", name: "Voita (munavoihin)", day: "Su" },
  { group: "Brunssi", name: "Hapanjuurileipää", note: "Huomioi myös gluteeniton leipä", day: "Su" },
  { group: "Brunssi", name: "Kinkkua", day: "Su" },
  { group: "Brunssi", name: "Juustoa", day: "Su" },
  { group: "Brunssi", name: "Tuoremehua", day: "Su" },
  { group: "Brunssi", name: "Kahvia", day: "Su" },
  { group: "Brunssi", name: "Teetä", day: "Su" },

  { group: "Juomat", name: "Vishy", day: "La" },
  { group: "Juomat", name: "Mehut", day: "La" },
  { group: "Juomat", name: "Viinit", day: "La" },
  { group: "Juomat", name: "Malmgård-olut, 2 kegiä", resp: "Pekka", amount: "2 kegiä", day: "La" },
];
