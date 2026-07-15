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
    };
  });
}

/* Seed data transcribed from seeds-review.md (Pekka + Liina 90v suunnitelma). */

export const TODO_SEED: SeedItem[] = [
  { group: "Muista", name: "Tarjoiluastiat ja ottimet", resp: "Liina" },
  { group: "Muista", name: "Jäkälänmetsästys", resp: "Marko" },
  { group: "Muista", name: "Banh Mi -sämpylät", needsInput: true },
  { group: "Muista", name: "Sunnuntain leipä", needsInput: true },
  { group: "Muista", name: "Flan-resepti + aineet" },
  { group: "Muista", name: "Ruokavalioiden tarkistus" },
  { group: "Muista", name: "Lounaan ja Yöpalan astiat" },
];

export const MISE_SEED: SeedItem[] = [
  // --- Yleiset valmistelut ---
  { group: "Yleiset valmistelut", name: "Astiat päivälliselle", resp: "Purujärven Martat" },
  { group: "Yleiset valmistelut", name: "Viinit (valinta ja tilaus)", needsInput: true },
  { group: "Yleiset valmistelut", name: "Kahvin keitto ja säilytys", note: "Kesälahdella perkolaattori (n. 90 kuppia) + 2 x 3 l termaria" },
  { group: "Yleiset valmistelut", name: "Jälkiruoan astiat", needsInput: true },
  { group: "Yleiset valmistelut", name: "Lounaan juoma", needsInput: true },
  { group: "Yleiset valmistelut", name: "Focaccia", resp: "Iida", needsInput: true },

  // --- Lauantai: Lounas 13-14.45 ---
  { group: "La Lounas (13–14.45)", name: "Gazpacho", resp: "Dima", amount: "10–12 L", note: "10 l kattilat löytyy Kesälahdelta" },
  { group: "La Lounas (13–14.45)", name: "Pico de Gallo (mansikka-tomaatti)", resp: "Marko, Laura, Iida?", amount: "2 L", note: "Valmistus samana aamuna" },
  { group: "La Lounas (13–14.45)", name: "Tuore leipä (paahdetaan esim. grillillä)", needsInput: true },
  { group: "La Lounas (13–14.45)", name: "Focaccia", resp: "Iida", amount: "3–4 kpl", note: "Valmistus edellisenä päivänä" },

  // --- Päivällinen: Sälä ---
  { group: "La Päivällinen (17.30) – Sälä", name: "Boquerones", resp: "Marko", note: "Laivurin valinnasta", needsInput: true },
  { group: "La Päivällinen (17.30) – Sälä", name: "Skagen", resp: "Marko", amount: "2 L", note: "Valmistus la aamulla" },
  { group: "La Päivällinen (17.30) – Sälä", name: "Oliivit", resp: "Marko", amount: "2 kg", note: "Rolling cheese" },
  { group: "La Päivällinen (17.30) – Sälä", name: "Manchego", resp: "Marko", amount: "2 kg", note: "Rolling cheese" },
  { group: "La Päivällinen (17.30) – Sälä", name: "Saaristolaisleipä", resp: "Mari", amount: "5–6 leipää (1 pala / hlö)", note: "Villa Mari" },
  { group: "La Päivällinen (17.30) – Sälä", name: "Leikkeleet", resp: "Marko", amount: "max 2 kg", note: "Rolling cheese" },

  // --- Päivällinen: Kasvit ---
  { group: "La Päivällinen (17.30) – Kasvit", name: "Vihreä salaatti", needsInput: true },
  { group: "La Päivällinen (17.30) – Kasvit", name: "Joku toinen salaatti", needsInput: true },
  { group: "La Päivällinen (17.30) – Kasvit", name: "Versot", resp: "Marko", needsInput: true },
  { group: "La Päivällinen (17.30) – Kasvit", name: "Pikkelit (kurkut, punasipuli)", resp: "Iida", note: "Tehdään pari päivää ennen", needsInput: true },
  { group: "La Päivällinen (17.30) – Kasvit", name: "Jääretiisi", resp: "Marko", note: "Sheivaus ja jää", needsInput: true },

  // --- Päivällinen: Proteiini ---
  { group: "La Päivällinen (17.30) – Proteiini", name: "Entrecote", amount: "4–5 kg", needsInput: true },
  { group: "La Päivällinen (17.30) – Proteiini", name: "Savulohi", amount: "4–5 kg", needsInput: true },
  { group: "La Päivällinen (17.30) – Proteiini", name: "Mukulaselleri", amount: "1–2 kg", needsInput: true },
  { group: "La Päivällinen (17.30) – Proteiini", name: "Marinoitu tofu", amount: "1 kg", needsInput: true },

  // --- Jälkiruoka ---
  { group: "La Jälkiruoka", name: "Flan", resp: "Dima", needsInput: true },
  { group: "La Jälkiruoka", name: "Mansikat", resp: "Liina", amount: "5 x 40 l laatikkoa", note: "Haku pe aamupäivällä" },
  { group: "La Jälkiruoka", name: "Keksit", resp: "Iiris", amount: "120 kpl", needsInput: true },
  { group: "La Jälkiruoka", name: "Kahvi / Tee", resp: "Marko", amount: "12–16 L" },
  { group: "La Jälkiruoka", name: "Karkkinurkka", resp: "Liina", note: "Muista kulhot!", needsInput: true },

  // --- Yöpala ---
  { group: "La Yöpala (n. 21.30)", name: "Banh Mi -leivät", needsInput: true },
  { group: "La Yöpala (n. 21.30)", name: "Gluteeniton banh mi", needsInput: true },
  { group: "La Yöpala (n. 21.30)", name: "Pikkelit (kurkku, punasipuli)", resp: "Iida", note: "Tehdään pari päivää ennen", needsInput: true },
  { group: "La Yöpala (n. 21.30)", name: "Possunkylki", needsInput: true },

  // --- Brunssi ---
  { group: "Su Brunssi (11–>)", name: "Puuro", needsInput: true },
  { group: "Su Brunssi (11–>)", name: "Karjalanpiirakat", resp: "Liina (tilannut)", amount: "150 kpl laktoositonta + 20 maidotonta/gluteenitonta", note: "Erkki hakee su-aamuna klo 10" },
  { group: "Su Brunssi (11–>)", name: "Munavoi", note: "Tehdään paikan päällä", needsInput: true },
  { group: "Su Brunssi (11–>)", name: "Kananmunat", needsInput: true },
  { group: "Su Brunssi (11–>)", name: "Hapanjuurileipä", needsInput: true },
  { group: "Su Brunssi (11–>)", name: "Kinkku", needsInput: true },
  { group: "Su Brunssi (11–>)", name: "Joku juusto", needsInput: true },
  { group: "Su Brunssi (11–>)", name: "Kasvikset", needsInput: true },
  { group: "Su Brunssi (11–>)", name: "Tuoremehut", needsInput: true },
  { group: "Su Brunssi (11–>)", name: "Kahvi", needsInput: true },
  { group: "Su Brunssi (11–>)", name: "Tee", needsInput: true },
];

export const RAAKA_SEED: SeedItem[] = [
  { group: "Gazpacho (Dima) – tavoite 10–12 L", name: "Tomaatteja (kypsiä)", amount: "8kg", note: "Gazpacho" },
  { group: "Gazpacho (Dima) – tavoite 10–12 L", name: "Kurkkuja", amount: "2kg", note: "Gazpacho" },
  { group: "Gazpacho (Dima) – tavoite 10–12 L", name: "Paprikoita (punainen/keltainen)", amount: "2kg", note: "Gazpacho" },
  { group: "Gazpacho (Dima) – tavoite 10–12 L", name: "Salottisipulia", amount: "1kg", note: "Gazpacho" },
  { group: "Gazpacho (Dima) – tavoite 10–12 L", name: "Valkosipulia", amount: "2", note: "Gazpacho" },
  { group: "Gazpacho (Dima) – tavoite 10–12 L", name: "Oliiviöljyä", note: "Gazpacho" },
  { group: "Gazpacho (Dima) – tavoite 10–12 L", name: "Viinietikkaa (puna- tai valkoviini-)", note: "Gazpacho" },
  { group: "Gazpacho (Dima) – tavoite 10–12 L", name: "Vaaleaa leipää", note: "Gazpacho" },
  { group: "Gazpacho (Dima) – tavoite 10–12 L", name: "Suola" },
  { group: "Gazpacho (Dima) – tavoite 10–12 L", name: "Sokeri" },
  { group: "Gazpacho (Dima) – tavoite 10–12 L", name: "Mustapippuri" },

  { group: "Pico de Gallo, mansikka-tomaatti – tavoite 2 L", name: "Tomaatteja", note: "Pico de Gallo" },
  { group: "Pico de Gallo, mansikka-tomaatti – tavoite 2 L", name: "Mansikoita", note: "Pico de Gallo" },
  { group: "Pico de Gallo, mansikka-tomaatti – tavoite 2 L", name: "Punasipulia", note: "Pico de Gallo" },
  { group: "Pico de Gallo, mansikka-tomaatti – tavoite 2 L", name: "Tuoretta chiliä / habaneroa", note: "Pico de Gallo" },
  { group: "Pico de Gallo, mansikka-tomaatti – tavoite 2 L", name: "Limettejä", note: "Pico de Gallo" },
  { group: "Pico de Gallo, mansikka-tomaatti – tavoite 2 L", name: "Korianteri / Persilja / Sitruunaverbena", note: "Pico de Gallo" },

  { group: "Skagen – tavoite 2 L", name: "Katkarapuja (kuorittuja, kypsiä)", note: "Skagen" },
  { group: "Skagen – tavoite 2 L", name: "Majoneesia", note: "Skagen" },
  { group: "Skagen – tavoite 2 L", name: "Purjoa", note: "Skagen" },
  { group: "Skagen – tavoite 2 L", name: "Chiliä", note: "Skagen" },
  { group: "Skagen – tavoite 2 L", name: "Sitruunoita", note: "Skagen" },
  { group: "Skagen – tavoite 2 L", name: "Tilliä", note: "Skagen" },
  { group: "Skagen – tavoite 2 L", name: "Ruohosipulia", note: "Skagen" },

  { group: "Sälä – valmiit ostotuotteet", name: "Boquerones (marinoidut sardellit)", amount: "TARKISTA", note: "Ostetaan valmiina, Laivurin valikoimasta", needsInput: true },
  { group: "Sälä – valmiit ostotuotteet", name: "Oliivit", amount: "2 kg" },
  { group: "Sälä – valmiit ostotuotteet", name: "Manchego-juusto", amount: "2 kg" },
  { group: "Sälä – valmiit ostotuotteet", name: "Leikkeleet", amount: "max 2 kg" },
  { group: "Sälä – valmiit ostotuotteet", name: "Saaristolaisleipä", amount: "5–6 leipää", note: "Villa Mari" },

  { group: "Kasvit / salaatit", name: "Vihreän salaatin ainekset", needsInput: true },
  { group: "Kasvit / salaatit", name: "Toisen salaatin ainekset", needsInput: true },
  { group: "Kasvit / salaatit", name: "Versot", note: "Petriltä", needsInput: true },

  { group: "Proteiinit (päivällinen)", name: "Entrecote", amount: "4–5 kg" },
  { group: "Proteiinit (päivällinen)", name: "Savulohi", amount: "4–5 kg" },
  { group: "Proteiinit (päivällinen)", name: "Mukulaselleri", amount: "1–2 kg" },
  { group: "Proteiinit (päivällinen)", name: "Marinoitu tofu", amount: "1 kg", note: "Valmis tuote tai marinoidaan itse – TARKISTA", needsInput: true },

  { group: "Jälkiruoka", name: "Kananmunia (flan)", needsInput: true },
  { group: "Jälkiruoka", name: "Maitoa / kermaa (flan)", note: "Huomioi 2+1 maidotonta vierasta – tarvitaan maidoton versio tai vaihtoehto", needsInput: true },
  { group: "Jälkiruoka", name: "Sokeria (flan + karamelli)" },
  { group: "Jälkiruoka", name: "Vaniljaa" },
  { group: "Jälkiruoka", name: "Mansikoita", resp: "Liina", amount: "5 x 40 l laatikkoa" },
  { group: "Jälkiruoka", name: "Keksit", resp: "Marko / Iiris", amount: "120 kpl", needsInput: true },
  { group: "Jälkiruoka", name: "Kahvia (suodatin)", note: "12–16 L tarve, perkolaattori n. 90 kupille", needsInput: true },
  { group: "Jälkiruoka", name: "Teetä", needsInput: true },
  { group: "Jälkiruoka", name: "Irtokarkkeja (karkkinurkka)", note: "Muista kulhot!", needsInput: true },

  { group: "Yöpala – Banh Mi", name: "Patonkeja / pehmeitä sämpylöitä" },
  { group: "Yöpala – Banh Mi", name: "Gluteenittomia sämpylöitä", note: "2+1 gluteenitonta vierasta", needsInput: true },
  { group: "Yöpala – Banh Mi", name: "Possunkylkeä (täyte)", needsInput: true },
  { group: "Yöpala – Banh Mi", name: "Banh Mi -pikkelit" },
  { group: "Yöpala – Banh Mi", name: "Kurkkua" },
  { group: "Yöpala – Banh Mi", name: "Tuoretta korianteria" },
  { group: "Yöpala – Banh Mi", name: "Majoneesia" },
  { group: "Yöpala – Banh Mi", name: "Srirachaa tai muuta chilikastiketta" },

  { group: "Brunssi", name: "Kaurahiutaleita (puuro)", needsInput: true },
  { group: "Brunssi", name: "Maitoa / laktoositonta maitoa (puuro)", needsInput: true },
  { group: "Brunssi", name: "Karjalanpiirakat", resp: "Liina (tilattu)", amount: "150 kpl laktoositonta + 20 maidotonta/gluteenitonta", note: "Haetaan valmiina, Erkki su klo 10" },
  { group: "Brunssi", name: "Voita (munavoihin)" },
  { group: "Brunssi", name: "Hapanjuurileipää", note: "Huomioi myös gluteeniton leipä", needsInput: true },
  { group: "Brunssi", name: "Kinkkua", needsInput: true },
  { group: "Brunssi", name: "Juustoa", needsInput: true },
  { group: "Brunssi", name: "Tuoreita kasviksia (esim. kurkku, tomaatti, paprika)", needsInput: true },
  { group: "Brunssi", name: "Tuoremehua", needsInput: true },
  { group: "Brunssi", name: "Kahvia", needsInput: true },
  { group: "Brunssi", name: "Teetä", needsInput: true },

  { group: "Juomat", name: "Vishy" },
  { group: "Juomat", name: "Mehut" },
  { group: "Juomat", name: "Viinit" },
  { group: "Juomat", name: "Malmgård-olut, 2 kegiä", resp: "Pekka", amount: "2 kegiä" },
];
