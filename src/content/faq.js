const { esc } = require('../util');

const FAQ = [
  {
    q: 'Kapok azonnali árat az űrlap kitöltése után?',
    a: 'Nem. Az űrlap rögzíti a feladat kereteit, de nem számol árat. A díj a felmérendő területtől, a szintek számától, a kért kimenettől, a hozzáféréstől és a kiszállástól függ. Ha ezekből valami hiányzik, előbb visszakérdezünk, és csak utána küldünk írásos ajánlatot.',
  },
  {
    q: 'Milliméterpontos a felmérés?',
    a: 'Ilyen általános ígéretet nem teszünk. A pontosságot az adott feladathoz rögzítjük: milyen részlet kell a tervezéshez, melyik helyiségek tartoznak bele, és hol takarja a geometriát bútor vagy szerkezet. A takart felületet nem adjuk át mért adatként. Ahol a lefedettség hiányos, azt az átadásban jelezzük.',
  },
  {
    q: 'Mit kapok átadáskor?',
    a: 'Azt, amit az ajánlat tételesen felsorol. Ez lehet pontfelhő, 2D alaprajz, metszet, vagy ezek olyan csomagja, amelyet a tervezőjével előre egyeztettünk. Az átadáshoz rövid megjegyzés tartozik a lefedettségről. Ami az ajánlatban nincs felsorolva, nem része a munkának.',
  },
  {
    q: 'Kell, hogy a tervező a helyszínen legyen?',
    a: 'Nem kötelező. A kimenetet az ajánlat előtt tisztázzuk, telefonon vagy írásban is. Ha a tervező a helyszínen mégis jelen tud lenni, a bizonytalan részleteket hamarabb lehet eldönteni. A felmérés ettől még a megbízó és a tervező nélkül is elvégezhető, ha a terjedelem előre rögzített.',
  },
  {
    q: 'Ki végzi a felmérést?',
    a: 'A megkeresést, a helyszíni munkát és az egyeztetett dokumentációt ugyanaz a csapat viszi végig. Az oldal nem közvetít névtelen alvállalkozói ígéretet.',
  },
  {
    q: 'Ez földhivatali vagy hatósági felmérés?',
    a: 'Nem. A munka tervezéshez használható meglévő állapotfelmérés. Nem földhivatali térképezés, nem telekhatár-kitűzés, és nem készül hozzá hatósági vagy földmérői záradék. Ha a hatóságnak ilyen dokumentum kell, azt külön, arra jogosult szakemberrel kell elkészíttetni.',
  },
  {
    q: 'Készül statikai szakvélemény vagy energetikai számítás?',
    a: 'Nem. A felmérés a látható geometriát és a vállalt rajzi vagy pontfelhő-kimenetet rögzíti. Repedés, teherbírás, rétegrend, nedvesség vagy energetikai jellemző vizsgálata más szakfeladat. Ezeket akkor sem helyettesíti a pontfelhő, ha a falak helye pontosan látszik.',
  },
  {
    q: 'Lakott lakásban is lehet mérni?',
    a: 'Igen, ha a helyiségek megközelíthetők. A bútor mögötti és a beépített szekrény takarásában lévő felületet előre jelezzük, és az átadásban is jelöljük. Nehéz bútorokat nem mozgatunk el a megbízó külön kérése és jelenléte nélkül. A helyszínt a munka végén olyan állapotban hagyjuk, ahogyan érkezéskor találtuk.',
  },
  {
    q: 'Mi történik, ha egy fal bútor mögött van?',
    a: 'A nem látható szakaszt nem találjuk ki mért adatnak. Vagy kimarad a részletes rajzból, vagy a látható élek alapján, egyértelmű jelöléssel vezetjük át, ha a tervező ezzel meg tudja kezdeni a munkát. A választ az ajánlatban vagy a feldolgozás közbeni kérdésben rögzítjük.',
  },
  {
    q: 'Vidéki ingatlanra is szól az ajánlat?',
    a: 'Igen. A kiszállás ideje és költsége az ajánlat külön tétele, Budapesten és vidéken egyaránt. Az űrlapon a település ezért kötelező, a pontos cím a megjegyzésben vagy az egyeztetésen kerül elő.',
  },
  {
    q: 'Milyen fájlokat kapok, és mivel tudom megnyitni?',
    a: 'A formátumot a tervező szoftveréhez igazítjuk, és az ajánlatba beírjuk. A 2D rajz jellemzően PDF és szerkeszthető rajzi fájl, ha ezt kérik. A pontfelhő csereformátumát szintén előre egyeztetjük. Nem ígérjük, hogy minden tervezőprogram minden fájlt azonos módon nyit meg, ezért kérdezzük meg, miből dolgoznak.',
  },
  {
    q: 'Vállalnak tervezést vagy kivitelezést is?',
    a: 'Ezen az oldalon nem. Az ajánlat a felmérésre és a megbeszélt dokumentációra szól. Építészeti tervezés, belsőépítészeti terv és kivitelezés külön megbízás, más tartalommal. Szerződést az oldal nem köt, és fizetést sem kér.',
  },
];

function faqHtml(items) {
  return `<div class="faq-list">${items
    .map(
      (item) => `<details>
        <summary>${esc(item.q)}</summary>
        <div class="faq-body"><p>${esc(item.a)}</p></div>
      </details>`
    )
    .join('')}</div>`;
}

module.exports = { FAQ, faqHtml };
