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
  const parts: string[] = [];
  if (item.amount) parts.push(item.amount);
  if (item.note) parts.push(item.note);
  const suffix = parts.length ? ` (${parts.join("; ")})` : "";
  const flag = item.needsInput ? " ⚠️" : "";
  return `[${item.group}] ${item.name}${suffix}${flag}`;
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
    };
  });
}

/* Seed data transcribed from data/index.html (Pekka + Liina 90v suunnitelma). */

export const TODO_SEED: SeedItem[] = [
  { group: "Muista", name: "Ladon sisätilaan noutopöytä + mahd. grilli" },
  { group: "Muista", name: "Yön nuotio / hiiligrilli" },
];

export const MISE_SEED: SeedItem[] = [
  // --- Yleiset valmistelut ---
  { group: "Yleiset valmistelut", name: "Astiat päivälliselle", resp: "Purujärven Martat" },
  { group: "Yleiset valmistelut", name: "Tarjoiluastiat + ottimet", needsInput: true },
  { group: "Yleiset valmistelut", name: "Viinit (valinta ja tilaus)", needsInput: true },
  { group: "Yleiset valmistelut", name: "Diman lennot", needsInput: true },
  { group: "Yleiset valmistelut", name: "Gazpachon raaka-aineiden tilaus", resp: "Dima" },
  { group: "Yleiset valmistelut", name: "Banh Mi -sämpylät (tilaus/leivonta)", needsInput: true },
  { group: "Yleiset valmistelut", name: "Ruokatilaus Kesälahden K-kauppaan", needsInput: true },
  { group: "Yleiset valmistelut", name: "Lisää Iida whatsapp-ryhmään" },
  { group: "Yleiset valmistelut", name: "Kahvin keitto ja säilytys", note: "Kesälahdella perkolaattori (n. 90 kuppia) + 2 x 3 l termaria" },
  { group: "Yleiset valmistelut", name: "Jälkiruoka – kokonaissuunnitelma" },
  { group: "Yleiset valmistelut", name: "Jälkiruoan astiat", needsInput: true },
  { group: "Yleiset valmistelut", name: "Sunnuntain tarkistus (mitä tarkoittaa – täsmennä)", needsInput: true },
  { group: "Yleiset valmistelut", name: "Lounaan juoma", needsInput: true },
  { group: "Yleiset valmistelut", name: "Focaccia – kuka vastaa: Iida vai Mari?", needsInput: true },

  // --- Lauantai: Lounas 13-14.45 ---
  { group: "La Lounas (13–14.45)", name: "Gazpacho", resp: "Dima", amount: "10–12 L", note: "10 l kattilat löytyy Kesälahdelta" },
  { group: "La Lounas (13–14.45)", name: "Pico de Gallo (mansikka-tomaatti)", resp: "Marko, Laura, Iida?", amount: "2 L", note: "Valmistus samana aamuna" },
  { group: "La Lounas (13–14.45)", name: "Tuore leipä (paahdetaan esim. grillillä)", needsInput: true },
  { group: "La Lounas (13–14.45)", name: "Focaccia", resp: "Iida", amount: "3–4 kpl", note: "Valmistus edellisenä päivänä" },
  { group: "La Lounas (13–14.45)", name: '"Happolappu" / keittiön tervehdyksen jakelu', note: "n. ¾ keikasta tehtynä" },

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
  { group: "Su Brunssi (11–>)", name: "Graavilohi", note: "Edellisen päivän rippeet — ei uutta ostosta" },

  // --- Juomat ---
  { group: "Juomat", name: "Viini 1", needsInput: true },
  { group: "Juomat", name: "Viini 2", needsInput: true },
  { group: "Juomat", name: "Viini 3", needsInput: true },
  { group: "Juomat", name: "Mehu 1", needsInput: true },
  { group: "Juomat", name: "Mehu 2", needsInput: true },
  { group: "Juomat", name: "Malmgård-olut", resp: "Pekka", amount: "2 kegiä", note: "Oluthana: helppo (surf ale) + vaikea (kausimakku), tai vain helppo" },
];

export const RAAKA_SEED: SeedItem[] = [
  { group: "Gazpacho (Dima) – tavoite 10–12 L", name: "Tomaatteja (kypsiä)", amount: "arvio, säädä maun mukaan", note: "Perusaine, muodostaa suurimman osan nesteestä" },
  { group: "Gazpacho (Dima) – tavoite 10–12 L", name: "Kurkkuja", amount: "arvio" },
  { group: "Gazpacho (Dima) – tavoite 10–12 L", name: "Paprikoita (punainen/keltainen)", amount: "arvio" },
  { group: "Gazpacho (Dima) – tavoite 10–12 L", name: "Punasipulia tai keltasipulia", amount: "arvio" },
  { group: "Gazpacho (Dima) – tavoite 10–12 L", name: "Valkosipulia", amount: "arvio" },
  { group: "Gazpacho (Dima) – tavoite 10–12 L", name: "Oliiviöljyä", amount: "arvio" },
  { group: "Gazpacho (Dima) – tavoite 10–12 L", name: "Viinietikkaa (puna- tai valkoviini-)", amount: "arvio" },
  { group: "Gazpacho (Dima) – tavoite 10–12 L", name: "Vaaleaa leipää (paksuuttamiseen)", amount: "arvio", note: "Jätetään pois gluteenittomasta erästä (2+1 gluteenitonta vierasta)", needsInput: true },
  { group: "Gazpacho (Dima) – tavoite 10–12 L", name: "Suolaa, sokeria, mustapippuria" },

  { group: "Pico de Gallo, mansikka-tomaatti – tavoite 2 L", name: "Tomaatteja" },
  { group: "Pico de Gallo, mansikka-tomaatti – tavoite 2 L", name: "Mansikoita" },
  { group: "Pico de Gallo, mansikka-tomaatti – tavoite 2 L", name: "Punasipulia" },
  { group: "Pico de Gallo, mansikka-tomaatti – tavoite 2 L", name: "Tuoretta chiliä / jalapeñoa" },
  { group: "Pico de Gallo, mansikka-tomaatti – tavoite 2 L", name: "Limettejä" },
  { group: "Pico de Gallo, mansikka-tomaatti – tavoite 2 L", name: "Tuoretta korianteria (tai persiljaa)", note: "Osalle korianteri maistuu saippualta – harkitse osa persiljalla" },
  { group: "Pico de Gallo, mansikka-tomaatti – tavoite 2 L", name: "Suolaa" },

  { group: "Focaccia (3–4 kpl)", name: "Vehnäjauhoja" },
  { group: "Focaccia (3–4 kpl)", name: "Hiivaa" },
  { group: "Focaccia (3–4 kpl)", name: "Oliiviöljyä" },
  { group: "Focaccia (3–4 kpl)", name: "Merisuolaa" },
  { group: "Focaccia (3–4 kpl)", name: "Rosmariinia / muita tuoreita yrttejä" },

  { group: "Skagen – tavoite 2 L", name: "Katkarapuja (kuorittuja, kypsiä)" },
  { group: "Skagen – tavoite 2 L", name: "Majoneesia" },
  { group: "Skagen – tavoite 2 L", name: "Ranskankermaa tai kermaviiliä", note: "Osa laktoosittomana (2 vierasta)", needsInput: true },
  { group: "Skagen – tavoite 2 L", name: "Sitruunoita" },
  { group: "Skagen – tavoite 2 L", name: "Punasipulia" },
  { group: "Skagen – tavoite 2 L", name: "Tuoretta tilliä" },
  { group: "Skagen – tavoite 2 L", name: "Suolaa, mustapippuria" },

  { group: "Sälä – valmiit ostotuotteet", name: "Boquerones (marinoidut sardellit)", amount: "TARKISTA", note: "Ostetaan valmiina, Laivurin valikoimasta", needsInput: true },
  { group: "Sälä – valmiit ostotuotteet", name: "Oliivit", amount: "2 kg" },
  { group: "Sälä – valmiit ostotuotteet", name: "Manchego-juusto", amount: "2 kg" },
  { group: "Sälä – valmiit ostotuotteet", name: "Leikkeleet", amount: "max 2 kg" },
  { group: "Sälä – valmiit ostotuotteet", name: "Saaristolaisleipä", amount: "5–6 leipää", note: "Villa Mari" },

  { group: "Kasvit / salaatit", name: "Vihreän salaatin ainekset", note: "Resepti puuttuu kokonaan", needsInput: true },
  { group: "Kasvit / salaatit", name: "Toisen salaatin ainekset", note: "Resepti puuttuu kokonaan", needsInput: true },
  { group: "Kasvit / salaatit", name: "Versot", needsInput: true },
  { group: "Kasvit / salaatit", name: "Kurkkuja (pikkeliin)" },
  { group: "Kasvit / salaatit", name: "Punasipulia (pikkeliin)" },
  { group: "Kasvit / salaatit", name: "Viinietikkaa, sokeria, suolaa (pikkeliliemi)" },
  { group: "Kasvit / salaatit", name: "Retiisejä (jääretiisi)" },

  { group: "Proteiinit (päivällinen)", name: "Entrecote", amount: "4–5 kg" },
  { group: "Proteiinit (päivällinen)", name: "Savulohi", amount: "4–5 kg" },
  { group: "Proteiinit (päivällinen)", name: "Mukulaselleri", amount: "1–2 kg" },
  { group: "Proteiinit (päivällinen)", name: "Marinoitu tofu", amount: "1 kg", note: "Valmis tuote tai marinoidaan itse – TARKISTA", needsInput: true },

  { group: "Jälkiruoka", name: "Kananmunia (flan)", needsInput: true },
  { group: "Jälkiruoka", name: "Maitoa / kermaa (flan)", note: "Huomioi 2+1 maidotonta vierasta – tarvitaan maidoton versio tai vaihtoehto", needsInput: true },
  { group: "Jälkiruoka", name: "Sokeria (flan + karamelli)" },
  { group: "Jälkiruoka", name: "Vaniljaa" },
  { group: "Jälkiruoka", name: "Mansikoita", amount: "5 x 40 l laatikkoa", note: "Haetaan pe aamupäivällä" },
  { group: "Jälkiruoka", name: "Keksit", amount: "120 kpl", note: "Ostetaan vai leivotaan?", needsInput: true },
  { group: "Jälkiruoka", name: "Kahvia (suodatin)", note: "12–16 L tarve, perkolaattori n. 90 kupille", needsInput: true },
  { group: "Jälkiruoka", name: "Teetä", needsInput: true },
  { group: "Jälkiruoka", name: "Irtokarkkeja (karkkinurkka)", note: "Muista kulhot!", needsInput: true },

  { group: "Yöpala – Banh Mi", name: "Patonkeja / pehmeitä sämpylöitä" },
  { group: "Yöpala – Banh Mi", name: "Gluteenittomia sämpylöitä", note: "2+1 gluteenitonta vierasta", needsInput: true },
  { group: "Yöpala – Banh Mi", name: "Possunkylkeä (täyte)", needsInput: true },
  { group: "Yöpala – Banh Mi", name: "Porkkanaa (pikkeliin)" },
  { group: "Yöpala – Banh Mi", name: "Retiisiä/daikonia (pikkeliin)" },
  { group: "Yöpala – Banh Mi", name: "Kurkkua" },
  { group: "Yöpala – Banh Mi", name: "Tuoretta korianteria" },
  { group: "Yöpala – Banh Mi", name: "Majoneesia" },
  { group: "Yöpala – Banh Mi", name: "Srirachaa tai muuta chilikastiketta" },
  { group: "Yöpala – Banh Mi", name: "Soijakastiketta" },
  { group: "Yöpala – Banh Mi", name: "Viinietikkaa, sokeria (pikkeliliemi)" },

  { group: "Brunssi", name: "Kaurahiutaleita (puuro)", needsInput: true },
  { group: "Brunssi", name: "Maitoa / laktoositonta maitoa (puuro)", needsInput: true },
  { group: "Brunssi", name: "Karjalanpiirakat", resp: "Liina (tilattu)", amount: "150 kpl laktoositonta + 20 maidotonta/gluteenitonta", note: "Haetaan valmiina, Erkki su klo 10" },
  { group: "Brunssi", name: "Voita (munavoihin)" },
  { group: "Brunssi", name: "Kananmunia (munavoi + sellaisenaan)", needsInput: true },
  { group: "Brunssi", name: "Hapanjuurileipää", note: "Huomioi myös gluteeniton leipä", needsInput: true },
  { group: "Brunssi", name: "Kinkkua", needsInput: true },
  { group: "Brunssi", name: "Juustoa", note: "Mikä juusto?", needsInput: true },
  { group: "Brunssi", name: "Tuoreita kasviksia (esim. kurkku, tomaatti, paprika)", needsInput: true },
  { group: "Brunssi", name: "Tuoremehua", needsInput: true },
  { group: "Brunssi", name: "Kahvia", needsInput: true },
  { group: "Brunssi", name: "Teetä", needsInput: true },
  { group: "Brunssi", name: "Graavilohi", note: "Edellisen päivän savulohi/graavilohi – ei uutta ostosta" },

  { group: "Juomat", name: "Viini 1", needsInput: true },
  { group: "Juomat", name: "Viini 2", needsInput: true },
  { group: "Juomat", name: "Viini 3", needsInput: true },
  { group: "Juomat", name: "Mehu 1", needsInput: true },
  { group: "Juomat", name: "Mehu 2", needsInput: true },
  { group: "Juomat", name: "Malmgård-olut, 2 kegiä", resp: "Pekka", amount: "2 kegiä" },
];
