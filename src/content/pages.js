const { esc, safeEmail, telHref } = require('../util');
const { FAQ, faqHtml } = require('./faq');
const { ARTICLES } = require('./articles');
const { ctaBand } = require('../form');

function renderHome({ formHtml }) {
  return `
  <section class="hero">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <p class="kicker">Lakás, ház, iroda, üzlethelyiség</p>
        <h1>3D épületfelmérés felújításhoz és tervezéshez</h1>
        <p class="lede">Épületeket mérünk fel 3D lézerszkennerrel. A felmérésből pontfelhő készül, és ha kéri, alaprajz, metszet vagy homlokzati rajz.</p>
        <p>A pontfelhő a felmért felületek pontokból álló digitális képe. A tervező ebből látja a teret, és ebből készülhet a rajz is.</p>
        <div class="actions">
          <a class="btn" href="#ajanlat">Ajánlatot kérek</a>
          <a class="btn btn-ghost" href="#mit-kapok">Mit adunk át?</a>
        </div>
      </div>
      <aside class="hero-panel">
        <p class="kicker">Átadott anyag</p>
        <h2>Amit a felmérésből kérhet</h2>
        <ul class="checklist">
          <li>Pontfelhő a felmért épületről</li>
          <li>Alaprajz a felújításhoz vagy a tervezéshez</li>
          <li>Metszet vagy homlokzati rajz, ha ezt kéri</li>
        </ul>
      </aside>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <p class="kicker">Szolgáltatás</p>
        <h2>Milyen épületet mérünk fel</h2>
      </div>
      <div class="cards">
        <article class="card">
          <p class="card-index">01</p>
          <h3>Lakás és ház</h3>
          <p>A meglévő falakat, nyílásokat és szinteket mérjük fel, hogy a felújítás vagy a terv ebből indulhasson.</p>
          <a href="/epulet-felmeres">Épületfelmérés</a>
        </article>
        <article class="card">
          <p class="card-index">02</p>
          <h3>Iroda és üzlethelyiség</h3>
          <p>A bérlemény vagy az üzlet mai terét mérjük fel átalakítás és tervezés előtt.</p>
          <a href="/epulet-felmeres">Iroda és üzlet felmérése</a>
        </article>
        <article class="card">
          <p class="card-index">03</p>
          <h3>Felújítás előtt</h3>
          <p>A mai épületet mérjük fel, hogy a tervezés ne egy régi vagy emlékezetből rajzolt alaprajzból induljon.</p>
          <a href="/felujitas-alapfelmeres">Felújítás előtti felmérés</a>
        </article>
      </div>
    </div>
  </section>
  <section class="section section-alt" id="mit-kapok">
    <div class="wrap">
      <div class="section-head">
        <p class="kicker">Átadott anyag</p>
        <h2>Mit adunk át?</h2>
      </div>
      <div class="cards">
        <article class="card">
          <h3>Pontfelhő</h3>
          <p>A 3D lézerszkenner a felmért épületrész felületeit pontfelhőként rögzíti. Ezt az anyagot a tervező a saját programjában tudja megnyitni.</p>
        </article>
        <article class="card">
          <h3>Rajz, ha kéri</h3>
          <p>Az ajánlatban meghatározott feladat szerint készülhet alaprajz, metszet vagy homlokzati rajz. A rajz a felmért épületből indul.</p>
        </article>
      </div>
      <p>A megrendelt felmérés és dokumentáció pontos tartalmát az ajánlatban rögzítjük.</p>
      <p class="section-link"><a href="/mintak">Átadott anyagok részletesebben</a></p>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <p class="kicker">Menet</p>
        <h2>Hogyan készül a felmérés</h2>
      </div>
      <ol class="steps">
        <li>
          <span>01</span>
          <h3>Megbeszéljük a feladatot</h3>
          <p>Tisztázzuk, melyik épületet vagy épületrészt kell felmérni, és pontfelhőt, rajzot vagy mindkettőt kér-e.</p>
        </li>
        <li>
          <span>02</span>
          <h3>Felmérjük a helyszínen</h3>
          <p>Az egyeztetett épületrészt 3D lézerszkennerrel mérjük fel.</p>
        </li>
        <li>
          <span>03</span>
          <h3>Elkészítjük az anyagot</h3>
          <p>Összeáll a pontfelhő, és ha kérte, az alaprajz, a metszet vagy a homlokzati rajz.</p>
        </li>
        <li>
          <span>04</span>
          <h3>Átadjuk</h3>
          <p>Azt az anyagot adjuk át, amit az ajánlatban meghatároztunk.</p>
        </li>
      </ol>
      <p class="section-link"><a href="/folyamat">A felmérés menete</a> · <a href="/cikkek">Tudnivalók felújítás előtt</a></p>
    </div>
  </section>
  <section class="section section-alt" id="ajanlat">
    <div class="wrap form-layout">
      <div>
        <p class="kicker">Ajánlatkérés</p>
        <h2>Ajánlatot kérek</h2>
        <p>Írja meg a nevét, az e-mail címét, és hogy mit szeretne felméretni. A többi adatot akkor töltse ki, ha már tudja.</p>
      </div>
      ${formHtml}
    </div>
  </section>`;
}

function renderBuilding() {
  return `
  <article class="prose wrap">
    <p class="kicker">Szolgáltatás</p>
    <h1>Épületfelmérés tervezéshez</h1>
    <p class="lede">Meglévő lakás, családi ház, iroda vagy kisebb üzlet felmérése akkor, amikor a következő lépés terv, nem pedig egy általános „szkennelési” csomag.</p>
    <p>Az épületfelmérés ezen az oldalon egy konkrét átadást jelent. A tervező megmondja, vagy velünk együtt tisztázza, hogy pontfelhőből, 2D alaprajzból, metszetből vagy ezek egyeztetett listájából tud dolgozni. A helyszíni munka ehhez a listához igazodik. Nem mérünk fel mindent, ami egy műszerrel elérhető, és nem hagyunk ki olyat, ami a listán rajta van.</p>
    <h2>Kinek készül</h2>
    <p>Építészeknek és belsőépítészeknek, akik a meglévő állapotra terveznek. Lakásfelújítóknak és kisebb generálkivitelezőknek, akiknek a kivitelezés előtt egy használható alaprajz kell, nem egy emlékezetből rajzolt skicc. Beruházóknak és magánszemélyeknek, akik átépítést vagy bővítést készítenek elő, és a tervezőjük már megfogalmazta a kimenetet – vagy éppen még nem, és ezt az ajánlat előtt rendbe kell tenni.</p>
    <h2>Mit mérünk</h2>
    <p>A vállalt helyiségek látható geometriáját: falak, nyílások, belmagasság, a kért szinteltérések, lépcső, pillér, portál. Irodánál és üzletnél a látható álmennyezet alatti teret, és csak akkor a födém alatti sávot, ha az megközelíthető és a feladat kéri. Családi háznál a tetőtér ferde síkját, ha a beépítés ehhez készül. A módszer lehet kézi ellenőrző mérés, műszeres felmérés vagy pontfelhő. A választást az ajánlat tartalmazza.</p>
    <h2>Amit ez a felmérés nem végez el</h2>
    <ul>
      <li>Nem földhivatali felmérés, nincs hatósági vagy földmérői záradék.</li>
      <li>Nem statikai szakvélemény, nem energetikai számítás, nem nedvességvizsgálat.</li>
      <li>Nem tárja fel a fal rétegrendjét és a rejtett vezetékeket.</li>
      <li>Nem készít kiviteli tervet, látványtervet vagy költségvetést.</li>
      <li>Nem tárgyszkennelés, nem alkatrész-digitalizálás, nem reverse engineering és nem gyártási méretellenőrzés.</li>
      <li>Nem mozdít el nehéz bútorokat, és nem bont burkolatot.</li>
    </ul>
    <p>A pontosságot ugyanebben a keretben kezeljük. Ahol a felület látható és a feladat kéri, ott mérünk. Ahol szekrény, beépített bútor vagy zárt álmennyezet takar, ott a hiányt írjuk le. Nem használunk olyan általános pontossági jelzőt, amely minden helyiségre és minden takarásra egyszerre vonatkozna.</p>
    <h2>Hogyan lesz ebből ajánlat</h2>
    <p>Az ajánlatkérés után a település, az ingatlan típusa, a becsült méret és a kért dokumentáció alapján visszakérdezünk, ha a lista még lyukas. Utána írásban adunk árat, határidőt, fájllistát és kizárásokat. Az űrlap ezt a lépést készíti elő. Önmagában nem ajánlat.</p>
    <p>Ha a feladat kifejezetten felújítás vagy átépítés előtti állapot, a <a href="/felujitas-alapfelmeres">felújítás előtti alapfelmérés</a> oldal a szűkebb leírás. A tervezői egyeztetés rendje a <a href="/tervezoknek">tervezőknek</a> szóló oldalon van.</p>
    ${ctaBand()}
  </article>`;
}

function renderRenovation() {
  return `
  <article class="prose wrap">
    <p class="kicker">Felújítás előtt</p>
    <h1>Felújítás előtti alapfelmérés</h1>
    <p class="lede">A bontás és az átalakítás előtt a meglévő geometria a terv kiinduló adata. Ezt mérjük fel, a tervezővel egyeztetett terjedelemben, nem egy általános épületdiagnosztika részeként.</p>
    <p>Felújításnál a legdrágább meglepetések gyakran nem a burkolat színéből, hanem egy rossz helyen feltételezett falból, egy félreolvasott belmagasságból vagy egy nem jelölt lépcsőpihenőből jönnek. Az alapfelmérés ezeket a geometriai kérdéseket rendezi, mielőtt a tervező a válaszfalat, a nyílást vagy a bővítést elhelyezi. Nem mondja meg, hogy a fal elbírja-e a tervezett terhet. Azt mondja meg, hol van a fal a vállalt mérési terjedelemben.</p>
    <h2>Mikor érdemes elvégezni?</h2>
    <p>Akkor, ha a meglévő rajz hiányzik, régi, vagy szemmel láthatóan nem a mai állapotot mutatja, és a tervezett munka mozgat valamit: válaszfalat, nyílást, konyhát, fürdőt, lépcsőt, tetőtéri térdfalat, üzletportált. Akkor is, ha a kivitelező és a tervező más-más skiccből dolgozna. Festéshez, azonos helyen maradó burkolathoz vagy bútorcseréhez általában nincs szükség új felmérésre. Ezt a <a href="/cikkek/mikor-kell-meglevo-allapotfelmeres">döntési szempontok között</a> részletesen leírtuk.</p>
    <h2>Mi kerüljön a felújítási alapba?</h2>
    <ul>
      <li>Az érintett helyiségek alaprajza, egy előre megbeszélt metszési magassággal.</li>
      <li>A nyílások helye és a látható tokméret, ajtónyitásiránnyal, ha az a helyszínen egyértelmű.</li>
      <li>Belmagasság és a tervezést befolyásoló padlóeltérések: küszöb, fellépés, galéria.</li>
      <li>Lépcső, ha a közlekedő vagy a tetőtér a feladat része.</li>
      <li>Látható strang és a nedveshelyiség kapcsolata, ha a konyha vagy a fürdő elmozdulhat.</li>
      <li>Egy metszet ott, ahol a magasság vagy a ferde sík a terv része.</li>
    </ul>
    <p>Pontfelhő akkor kerül a felújítási alapba, ha a tervező ebből akar továbbdolgozni, vagy ha a geometria egy-két kézi mérettel félrevezető lenne. A <a href="/cikkek/mikor-nem-eleg-a-kezi-felmeres">kézi felmérés határa</a> nem büszkeségi kérdés. Ha a feladat egyszerű, a kézi méret marad.</p>
    <h2>Amit a felújítás előtt sem mérünk meg bontás nélkül</h2>
    <p>A válaszfal mögötti rétegrend, a födém vasalása, a padló alatti felépítmény és a beépített szekrény takarása nem része a geometriai felmérésnek. Ha a tervező ezekre kíváncsi, azt külön szakági vizsgálat vagy a bontási ütem utáni pótmérés tudja megadni. A pótmérést nem ígérjük bele az alapfelmérés árába. Ha várható, az ajánlatban külön lehetőségként szerepel, határidővel.</p>
    <p>A felújítás ütemezése sem a felmérés mellékterméke. Mi a megbeszélt fájlokat adjuk át. A bontási sorrendet, a költségvetést és a kivitelezői organizációt a tervező és a kivitelező készíti, a saját megbízásukban.</p>
    ${ctaBand()}
  </article>`;
}

function renderDesigners() {
  return `
  <article class="prose wrap">
    <p class="kicker">Tervezőknek</p>
    <h1>Felmérés építészeknek és belsőépítészeknek</h1>
    <p class="lede">Az ajánlat előtt leírjuk, milyen fájlt kap, milyen határig mérünk, és mit jelölünk hiányként. A helyszíni munka ezt a leírást követi.</p>
    <p>Tervezőként valószínűleg nem egy újabb pontfelhő-szolgáltatót keres, hanem egy olyan kiinduló anyagot, amelyre rá lehet rajzolni. Ehhez a felmérésnek a maga munkamódszeréhez kell igazodnia: melyik programban nyitja meg a fájlt, hol metszi a teret, kell-e metszet a nedveshelyiségen, és mi az, amit a terv nem fog használni. Ezek a mondatok unalmasak, és pontosan ettől lesz az átadás használható.</p>
    <h2>Amit az ajánlatkérés előtt érdemes megírni</h2>
    <ul>
      <li>A kimenet neve: pontfelhő, 2D alaprajz, metszet, meglévő állapot modellje, vagy a kombináció.</li>
      <li>A program vagy a csereformátum, amelyből ténylegesen dolgozik.</li>
      <li>A helyiséghatár és az, hogy a lépcsőház, a homlokzat, a pince vagy a padlás része-e.</li>
      <li>A metszetek száma és iránya, ha a magasság a terv része.</li>
      <li>A részletek, amelyek kellenek: parapet, küszöb, látható strang, nyitásirány.</li>
      <li>A részletek, amelyek nem kellenek, hogy ne mérjük őket „biztos, ami biztos”.</li>
    </ul>
    <p>Ha ezt a megbízója még nem tudja összeszedni, adunk egy továbbküldhető kérdéssort. A teljes lista a <a href="/cikkek/mit-kerjen-a-tervezo">Mit kérjen a tervezője a felmérés előtt?</a> cikkben van. Az űrlapon a „még nem tudom” is elfogadott válasz: ilyenkor mi kérdezünk vissza, mielőtt árat írnánk.</p>
    <h2>Formátum, modell, részletezettség</h2>
    <p>A 2D rajzot, ha kéri, PDF-ben és szerkeszthető rajzi formában adjuk. A pontfelhő formátumát ahhoz választjuk, amit meg tud nyitni. BIM-modell csak külön vállalással készül, és akkor is a meglévő állapotról, a rögzített részletezettséggel. A rétegrendet, a vasalást és a nem látható gépészetet nem modellezzük mért adatként. Ha a projektje már egy meghatározott részletezettségi szinten fut, írja meg azt a szintet az ajánlatkérésben. Ha nincs ilyen, nem találunk ki helyette egy látványos, de nem kért modellt.</p>
    <h2>Ami a rajzon jelölve lesz</h2>
    <p>A takart fal, a be nem járt helyiség és az értelmezett, nem közvetlenül mért vonal jelölést kap. Ez a tervezésnek információ, nem a felmérés mentsége. Ha egy méret a terv szempontjából kritikus, és a helyszínen nem volt mérhető, inkább kérdezünk a feldolgozás közben, mintsem egy kerek számot írjunk a vonalra.</p>
    <p>Hatósági záradékot, földhivatali munkarészt és tervezői felelősségvállalást a felmérés nem vesz át. A rajz a meglévő állapot tervezési alapja a vállalt terjedelemben. Az engedélyezési terv a tervező munkája marad.</p>
    ${ctaBand()}
  </article>`;
}

function renderSamples() {
  return `
  <article class="prose wrap">
    <p class="kicker">Átadott anyagok</p>
    <h1>Átadott anyagok</h1>
    <p class="lede">A pontfelhő, az alaprajz, a metszet és a homlokzati rajz külön anyag. Azt készítjük el, amit az ajánlatban meghatároztunk. Itt nincs kitalált referenciaépület.</p>
    <h2>1. Pontfelhő</h2>
    <p>Átadáskor a megbeszélt csereformátumú állomány és egy rövid kísérőszöveg készül: melyik álláspontokból látszik a tér, hol takart a bútor, hol zajos a felület. A pontfelhő a látható felületek lenyomata. Nem tartalmaz falobjektumot, méretláncot és helyiségpecsétet, hacsak a feladat ezek szerkesztését külön nem kéri.</p>
    <h2>2. Alaprajz, metszet és homlokzati rajz</h2>
    <p>A rajzi minta egy lakás érintett helyiségeire: alaprajz egy rögzített metszési magassággal, nyílások a látható tok szerint, belmagasság a kért helyiségekben, és egy metszet a nappali meg a nedveshelyiség irányában, ha ezt a tervező kérte. A fájl PDF és szerkeszthető rajz, ha az ajánlat így szól. A metszet síkját nem a feldolgozó választja ki utólag.</p>
    <h2>3. Pontfelhő és rajz együtt</h2>
    <p>Egy lehetséges lakásfelújítási lista, ha a tervező pont ezt kéri:</p>
    <ul>
      <li>minden érintett helyiség alaprajza,</li>
      <li>egy jellemző metszet,</li>
      <li>a nyílások helye és a látható mérete,</li>
      <li>belmagasság helyiségenként,</li>
      <li>pontfelhő arról a térről, amelyet a metszet nem ír le,</li>
      <li>egy oldalas lefedettségi megjegyzés,</li>
      <li>nincs a listán: homlokzat, közös folyosó, statika, bútorterv.</li>
    </ul>
    <p>A fájlokat beszédes névvel adjuk, a helyszín, a szint és a tartalom szerint. Az átadási levél felsorolja őket. Nincs „végleges_2” állomány.</p>
    <h2>Amit szándékosan nem mutatunk</h2>
    <p>Nincs kitalált megrendelői idézet, nincs névtelen „elégedett ügyfél”, és nincs olyan előtt-után pár, amely nem a saját, közölhető munkánk. Ha egy későbbi mintaábra felkerül, mellette ott lesz a feladat típusa és az, hogy a megbízó a közléshez hozzájárult. Addig a szöveges tartalomjegyzék az őszintébb minta.</p>
    ${ctaBand()}
  </article>`;
}

function renderProcess() {
  return `
  <article class="prose wrap">
    <p class="kicker">Folyamat</p>
    <h1>Hogyan zajlik a felmérés</h1>
    <p class="lede">Négy lépés, mindegyiknek van kézzelfogható eredménye. Az első nélkül a másik három találgatás, az utolsó nélkül a mérés a műszerben marad.</p>
    <h2>1. Projekt és kimenet egyeztetése</h2>
    <p>Az ajánlatkérés után átnézzük a települést, az ingatlan típusát, a becsült méretet és a kért dokumentációt. Ha a tervező még nem nevezte meg a fájlt, rákérdezünk. Az írásos ajánlatban szerepel a helyszín jellege, a felmért terület határa, a fájllista, a módszer, a lefedettség kezelése, a kizárások, a határidő és az ár. Külön tétel a kiszállás. Külön tétel, ha a tervezővel a feldolgozás közben is egyeztetni kell.</p>
    <p>Amit a megbízótól a helyszínhez kérünk: cím és megközelítés, egy kapcsolattartó, a belépés időablaka, és ha van, a régi rajz másolata. A régi rajzot támpontnak tekintjük, nem mérési adatnak. A részletes iratlista a <a href="/cikkek/milyen-dokumentumok-kellenek">dokumentumokról szóló cikkben</a> van.</p>
    <h2>2. Helyszíni terepi felmérés</h2>
    <p>A megbeszélt időben érkezünk, bejárjuk a vállalt helyiségeket, és a választott módszerrel mérünk. A zárt szobát, a bonthatatlan álmennyezetet és a bútor mögötti falat nem találjuk ki. A helyszínt olyan állapotban hagyjuk, ahogyan találtuk. A nap belső rendjét a <a href="/cikkek/hogyan-zajlik-a-helyszini-felmeres">helyszíni menetről szóló cikk</a> írja le. A helyszínen nem adunk végleges rajzot és nem módosítjuk szóban, észrevétlenül az ajánlat tartalmát.</p>
    <h2>3. Feldolgozás és minőség-ellenőrzés</h2>
    <p>A mérésből itt lesz a vállalt kimenet. A rajzot a mért adatokhoz viszonyítjuk: záródnak-e a helyiségek, stimmel-e a nyílások iránya, szerepel-e minden kért magasság, és minden listán lévő fájl megszületett-e. Ahol a lefedettség hiányos, ott jelölünk. Ahol egy adat ellentmondásos, ott kérdezünk. Ez az ellenőrzés a vállalt tartalom teljességéről szól. Nem jelenti azt, hogy egy felmérés minden számban, minden körülmények között hibátlan.</p>
    <h2>4. Átadás a megbeszélt formátumban</h2>
    <p>A fájlokat és a lefedettségi megjegyzést együtt adjuk át, az ajánlatban írt formátumban. Az átadási levél felsorolja a fájlneveket. Ha a tervező egy állományt nem tud megnyitni, és a formátumot előre egyeztettük, javítjuk a formátumot. Ha a megnyitás azért sikertelen, mert időközben más programot kérnek, az új formátum külön egyeztetés.</p>
    <h2>Határidő</h2>
    <p>A helyszíni idő a terület, a szintek és a hozzáférés függvénye. A feldolgozás a kimenet függvénye. Konkrét napot az ajánlatba írunk, a kapacitás és a kért rend szerint. Az oldal nem ígér általános átfutást minden ingatlanra. Ha a kért határidő szorosabb, azt csak akkor vállaljuk, ha a sorban tényleg elfér, és ezt az ajánlatban külön jelezzük.</p>
    ${ctaBand()}
  </article>`;
}

function renderPricing() {
  return `
  <article class="prose wrap">
    <p class="kicker">Árak</p>
    <h1>Árak és ajánlatkérés</h1>
    <p class="lede">Az oldalon nincs árkalkulátor és nincs sávos „ettől a négyzetméteráron” ígéret. A díj egy adott átadási listához tartozik. A lista nélkül a szám félrevezető lenne.</p>
    <p>Két hasonló méretű lakás felmérése nem azonos munka, ha az egyiken egy alaprajz kell, a másikon pedig pontfelhő, két metszet és egyeztetés a tervező irodájával. Ezért az ajánlatkérés nem árat ad vissza, hanem elindítja a tisztázást. Ha az adatok ehhez eleve kevesek, előbb kérdezünk.</p>
    <h2>Mitől függ az ajánlat?</h2>
    <div class="table-wrap">
      <table class="factor-table">
        <thead>
          <tr><th>Szempont</th><th>Hogyan jelenik meg az ajánlatban</th></tr>
        </thead>
        <tbody>
          <tr><td>Felmérendő terület és tagoltság</td><td>A helyiségek száma, a szintek és a tagolt alaprajz a helyszíni időt és a feldolgozást is növeli.</td></tr>
          <tr><td>Külső és belső részek</td><td>A homlokzat, a tető és a beltér külön tétel. Ami nincs a listán, nem része az árnak.</td></tr>
          <tr><td>Hozzáférés</td><td>Lakott lakás, bútor, rövid időablak vagy részben járható padlás módosítja a helyszíni munkát.</td></tr>
          <tr><td>Kért részletesség</td><td>A látható geometria és a részletrajz más munka. A takart felületet nem árazzuk mért adatként.</td></tr>
          <tr><td>Kért rajzok és állományok</td><td>A pontfelhő, az alaprajz, a metszet és a homlokzati rajz külön tétel. Nem járnak együtt egy alapcsomagban.</td></tr>
          <tr><td>Ütemezés</td><td>A szokásos rendtől eltérő határidőt csak akkor vállalunk, ha a kapacitás engedi, és ezt külön írjuk.</td></tr>
        </tbody>
      </table>
    </div>
    <h2>Helyszíni idő és átadás</h2>
    <p>A helyszíni felmérés időtartama a területtől, a tagoltságtól és a hozzáféréstől függ. A feldolgozás és a dokumentáció átadása ettől külön idő: a kért rajzok és állományok határozzák meg. A kettőt az írásos ajánlatban külön sorban adjuk meg. 24 órás ajánlatot és másnapi átadást nem ígérünk. Saját, rögzített árpélda nincs az oldalon: az ár egyedi ajánlat.</p>
    <h2>Mi van az írásos ajánlatban?</h2>
    <ul>
      <li>a helyszín jellege és a felmérendő terület határa,</li>
      <li>a módszer: kézi ellenőrző mérés, műszeres felmérés, pontfelhő, vagy kombináció,</li>
      <li>az átadandó fájlok listája és formátuma,</li>
      <li>a pontosság és a lefedettség kezelése ennél a feladatnál,</li>
      <li>a kizárások,</li>
      <li>a határidő, a kiszállás és az ár.</li>
    </ul>
    <h2>Mi nincs az árban, hacsak külön nem kérik?</h2>
    <p>Tervezés, belsőépítészeti koncepció, kiviteli terv, költségvetés, statikai vagy energetikai szakvélemény, földhivatali munka, hatósági ügyintézés, bontás, bútorozás. Fizetést az oldal nem kezel, szerződést nem köt. Az elfogadott ajánlat után a megbízás a szokásos rendben, az ajánlatban írt feltételekkel jön létre, nem egy gombnyomásra.</p>
    ${ctaBand()}
  </article>`;
}

function renderFaqPage() {
  return `
  <article class="prose wrap">
    <p class="kicker">GYIK</p>
    <h1>Gyakori kérdések az épületfelmérésről</h1>
    <p class="lede">Rövid válaszok az árra, a pontosságra, a hatósági záradékra és arra, hogy mit kap átadáskor. A részleteket a kapcsolódó oldalak bontják ki.</p>
    ${faqHtml(FAQ)}
    ${ctaBand()}
  </article>`;
}

function renderContact({ formHtml, config }) {
  const email = safeEmail(config.contactEmail);
  const phoneHref = telHref(config.contactPhone);
  const phone = phoneHref
    ? `<p><a href="${esc(phoneHref)}">${esc(config.contactPhone)}</a></p>`
    : '';
  return `
  <article class="prose wrap">
    <p class="kicker">Kapcsolat</p>
    <h1>Kapcsolat és ajánlatkérés</h1>
    <p class="lede">Írjon az űrlapon, vagy hívjon. A név, az e-mail és a felmérendő épület elég az első megkereséshez.</p>
    <div class="contact-grid">
      <div>
        <h2>Elérhetőség</h2>
        ${email ? `<p><a href="mailto:${esc(email)}">${esc(email)}</a></p>` : ''}
        ${phone}
        ${phoneHref ? '<p>Telefonon hétfőtől péntekig, 8:00 és 19:00 között hívhat.</p>' : ''}
        <p>Az e-mailben elég a település, az ingatlan típusa és a tervező kérése. Ha rajzot is csatolna, inkább az egyeztetés után kérjük: az űrlap nem fogad fájlt.</p>
      </div>
      <div id="ajanlat">
        <h2>Ajánlatkérő űrlap</h2>
        ${formHtml}
      </div>
    </div>
  </article>`;
}

function renderArticlesIndex() {
  const items = ARTICLES.map(
    (article) => `<li>
      <article>
        <h2><a href="${article.path}">${article.title}</a></h2>
        <p>${article.description}</p>
      </article>
    </li>`
  ).join('');
  return `
  <article class="prose wrap">
    <p class="kicker">Tudnivalók</p>
    <h1>Cikkek a felmérés előtt</h1>
    <p class="lede">Hat hosszabb jegyzet arról, mikor kell felmérés, mire való a pontfelhő, és mit érdemes a tervezőtől megkérdezni. Nem településoldalak és nem átvett versenyszövegek.</p>
    <ul class="article-index">${items}</ul>
  </article>`;
}

function renderArticle(article) {
  const more = ARTICLES.filter((item) => item.slug !== article.slug)
    .slice(0, 3)
    .map((item) => `<li><a href="${item.path}">${item.title}</a></li>`)
    .join('');
  return `
  <article class="prose wrap">
    <p class="kicker">Cikk · ${article.published}</p>
    <h1>${article.title}</h1>
    ${article.html}
    <p class="byline">A szöveg tájékoztató, nem ajánlat.</p>
    ${ctaBand()}
    <h2>Kapcsolódó jegyzetek</h2>
    <ul>${more}</ul>
  </article>`;
}

function renderPrivacy(config) {
  const months = Number.isInteger(config.retentionMonths) ? config.retentionMonths : 24;
  const email = safeEmail(config.contactEmail);
  return `
  <article class="prose wrap">
    <p class="kicker">Adatvédelem</p>
    <h1>Adatkezelési tájékoztató</h1>
    <p class="lede">Ez a tájékoztató azt írja le, mit csinál ez a weboldal az ajánlatkérés adataival. Más honlap, hírlevél vagy fizetési szolgáltatás nincs a működésben.</p>
    <h2>Adatkezelő</h2>
    <p>${esc(config.companyLegalName)} (${esc(config.companyShortName)})<br>
    Székhely: ${esc(config.companySeat)}<br>
    Cégjegyzékszám: ${esc(config.companyRegNumber)}<br>
    Adószám: ${esc(config.companyTaxId)}<br>
    ${email ? `E-mail: <a href="mailto:${esc(email)}">${esc(email)}</a>` : ''}
    ${config.contactPhone ? `<br>Telefon: ${esc(config.contactPhone)} · hétfőtől péntekig, 8:00–19:00` : ''}</p>
    <h2>Milyen adatot rögzítünk?</h2>
    <p>Ha ajánlatot kér, a nevét, e-mail címét, telefonszámát, a települést, az ingatlan típusát, a becsült alapterületet, a tervezett munka típusát, a kért dokumentációt, a tervező elérhetőségét, ha megadja, a kívánt határidőt és a megjegyzését. Rögzítjük a beküldés időpontját, a forrásoldal címét, a forrásdomaint, a kampány- és UTM-paramétereket, ha a link tartalmazta őket, valamint a hozzájárulás tényét. Az ajánlatkéréshez IP-címet nem tárolunk az adatbázisban.</p>
    <h2>Miért és milyen jogalapon?</h2>
    <p>Az adatokat az Ön által indított ajánlatkérés megválaszolásához kezeljük: a feladat tisztázásához, az írásos ajánlat elkészítéséhez és a kapcsolattartáshoz. A jogalap a szerződéskötést megelőző lépés az Ön kérésére, a GDPR 6. cikk (1) bekezdés b) pontja szerint. A jelölőnégyzet azt erősíti meg, hogy elolvasta ezt a tájékoztatót, és kéri a megkeresést. Hírlevelet, profilalkotást és automatikus döntést nem végzünk. A hozzájárulás nem terjed ki marketingcélra.</p>
    <h2>Meddig őrizzük?</h2>
    <p>A be nem fogadott vagy lezárt ajánlatkérés adatait a lezárást követő ${months} hónapig őrizzük, hogy egy későbbi kérdésnél a hivatkozási szám visszakereshető legyen. Ha a megkeresésből megbízás lesz, a szerződéses és számviteli iratokat a jogszabályban előírt ideig őrizzük. A törlést a fenti e-mail címen lehet kérni, ha nincs ennél erősebb megőrzési kötelezettség.</p>
    <h2>Kinek továbbítjuk?</h2>
    <p>Az adatokat a cég munkatársai kezelik. E-mail értesítés csak akkor megy, ha a levelezés be van állítva: ekkor a megadott SMTP-kiszolgáló üzemeltetője a küldéshez szükséges adatokat adatfeldolgozóként látja. Hirdetési hálózatnak, közösségi modulnak és külső analitikai szolgáltatónak az oldal nem ad át adatot. Ha a beállított levelező az Európai Gazdasági Térségen kívül dolgozza fel a levelet, a közzététel előtt ezt a tájékoztatót frissíteni kell. Az alapértelmezett oldal ilyen továbbítást nem épít be.</p>
    <h2>Kampányparaméterek és napló</h2>
    <p>Ha egy link UTM-paramétert tartalmaz, azt az ajánlatkéréssel együtt mentjük, hogy lássuk, melyik oldalról vagy kampányból érkezett a megkeresés. Ezt nem küldjük vissza hirdetési rendszernek: a honlap nem tartalmaz mérőkódot. Az alkalmazás technikai naplója a kérés idejét, az útvonalat és a válasz kódját írja a saját folyamat kimenetére. A reverse proxy saját hozzáférési naplója, ha az üzemeltető bekapcsolja, tartalmazhat IP-címet. Azt a naplót nem használjuk marketingre, és nem keverjük más weboldalak naplójával.</p>
    <h2>Sütik</h2>
    <p>A nyilvános oldalak nem helyeznek el sütit. Az adminisztrációs felület belépés után egy saját, httpOnly munkamenet-sütit használ (<span class="mono">pf6_admin</span>), amely legfeljebb 12 óráig él, és csak ennek a felületnek a védelmére szolgál. Nem elemez látogatót, és nem osztozik más alkalmazások munkamenetén.</p>
    <h2>Az Ön jogai</h2>
    <p>Kérheti a hozzáférést, a helyesbítést, a törlést, a kezelés korlátozását, és tiltakozhat a jogos érdeken alapuló kezelés ellen, ha ilyenre sor kerülne. Panaszt a Nemzeti Adatvédelmi és Információszabadság Hatóságnál tehet. A hatóság aktuális elérhetősége a <a href="https://naih.hu">naih.hu</a> oldalon olvasható. A kérelmet a fenti e-mail címre küldje, és ha van, adja meg a PF kezdetű hivatkozási számot.</p>
    <p>A tájékoztató a weboldal tényleges működéséhez készült. Közzététel előtt érdemes adatvédelmi szakértővel átnézetni, különösen ha a levelező szolgáltató vagy a tárhely időközben változik.</p>
  </article>`;
}

function renderImpressum(config) {
  const email = safeEmail(config.contactEmail);
  const hostingEmail = safeEmail(config.hostingEmail);
  const hosting = config.hostingProvider
    ? `<p>Tárhelyszolgáltató: ${esc(config.hostingProvider)}${config.hostingAddress ? `, ${esc(config.hostingAddress)}` : ''}${hostingEmail ? `, ${esc(hostingEmail)}` : ''}.</p>`
    : `<p class="notice">A tárhelyszolgáltató adata még nincs kitöltve. Éles közzététel előtt a HOSTING_PROVIDER, HOSTING_ADDRESS és HOSTING_EMAIL beállítást meg kell adni.</p>`;
  return `
  <article class="prose wrap">
    <p class="kicker">Impresszum</p>
    <h1>Impresszum</h1>
    <p>A pontosfelmeres.hu oldalt az alábbi gazdasági társaság üzemelteti. Az oldal a meglévő állapotfelmérés bemutatására és ajánlatkérésre szolgál. Online fizetés és automatikus szerződéskötés nincs rajta.</p>
    <h2>Üzemeltető</h2>
    <p>${esc(config.companyLegalName)}<br>
    Rövid név: ${esc(config.companyShortName)}<br>
    Székhely: ${esc(config.companySeat)}<br>
    Cégjegyzékszám: ${esc(config.companyRegNumber)}<br>
    Nyilvántartó bíróság: ${esc(config.companyCourt)}<br>
    Adószám: ${esc(config.companyTaxId)}<br>
    Közösségi adószám: ${esc(config.companyEuTaxId)}</p>
    <h2>Elérhetőség</h2>
    <p>${email ? `E-mail: <a href="mailto:${esc(email)}">${esc(email)}</a>` : ''}
    ${config.contactPhone ? `<br>Telefon: ${esc(config.contactPhone)} · hétfőtől péntekig, 8:00–19:00` : ''}</p>
    <h2>Tárhely</h2>
    ${hosting}
    <h2>A tartalomról</h2>
    <p>A szövegek a szolgáltatás kereteit írják le. Az ajánlat mindig a konkrét feladatra szól, írásban. Az oldal nem mutat kitalált referenciaépületet. A pontosság és a felmért épületrész az ajánlatban rögzített feladat részei, nem általános ígéretek. Az oldal nem nyújt földhivatali, hatósági záradékolási vagy tervezői felelősségvállalási szolgáltatást.</p>
  </article>`;
}

function renderThanks(ref) {
  const safeRef = /^PF-\d{5,}$/.test(ref || '') ? ref : '';
  const refLine = safeRef ? `<p class="ref">Hivatkozási szám: <strong>${esc(safeRef)}</strong></p>` : '';
  return `
  <article class="prose wrap thanks">
    <p class="kicker">Ajánlatkérés</p>
    <h1>Rögzítettük az ajánlatkérését</h1>
    ${refLine}
    <p>Átnézzük a megadott adatokat, és írásos ajánlatot küldünk. Az elküldés még nem szerződés.</p>
    <p>Ha néhány munkanapon belül nem jelentkezünk, írjon a kapcsolati e-mail címre, és tüntesse fel a hivatkozási számot.</p>
    <p><a class="btn" href="/">Vissza a főoldalra</a></p>
  </article>`;
}

function renderNotFound() {
  return `
  <article class="prose wrap">
    <p class="kicker">404</p>
    <h1>Ez az oldal nincs a felmérésben</h1>
    <p>A cím nem mutat létező oldalra. A fő témák innen elérhetők:</p>
    <ul>
      <li><a href="/epulet-felmeres">Épületfelmérés</a></li>
      <li><a href="/felujitas-alapfelmeres">Felújítás előtti alapfelmérés</a></li>
      <li><a href="/arak">Árazási logika</a></li>
      <li><a href="/kapcsolat">Ajánlatkérés</a></li>
    </ul>
  </article>`;
}

const PAGES = {
  home: {
    path: '/',
    title: '3D épületfelmérés, alaprajz és pontfelhő | Pontosfelmérés',
    description:
      'Lakások, házak, irodák és üzlethelyiségek 3D lézeres felmérése. Pontfelhő, igény szerint alaprajz, metszet és homlokzati rajz. Kérjen ajánlatot!',
    imageAlt: '3D épületfelmérés felújításhoz és tervezéshez',
    h1: '3D épületfelmérés felújításhoz és tervezéshez',
    lastmod: '2026-11-17',
  },
  building: {
    path: '/epulet-felmeres',
    title: 'Meglévő épület felmérése | Pontosfelmérés',
    description:
      'Lakás, ház, iroda és kisebb üzlet meglévő állapotának felmérése. A pontfelhő vagy a rajz csak akkor készül, ha a feladat kéri.',
    imageAlt: 'Meglévő épület felmérése tervezéshez',
    crumb: 'Épületfelmérés',
    lastmod: '2026-11-17',
  },
  renovation: {
    path: '/felujitas-alapfelmeres',
    title: 'Felújítás előtti állapotfelmérés | Pontosfelmérés',
    description:
      'Felújítás és átépítés előtt a meglévő geometria a terv kiinduló adata. A felmérés nem statika és nem hatósági záradék.',
    imageAlt: 'Felújítás előtti állapotfelmérés',
    crumb: 'Felújítás előtt',
    lastmod: '2026-11-17',
  },
  designers: {
    path: '/tervezoknek',
    title: 'Felmérés építészeknek | Pontosfelmérés',
    description:
      'Építészeknek és belsőépítészeknek: a fájl, a terjedelem és a kizárások a helyszín előtt rögzülnek. Az átadás ehhez a listához igazodik.',
    imageAlt: 'Épületfelmérés építészeknek és belsőépítészeknek',
    crumb: 'Tervezőknek',
    lastmod: '2026-11-17',
  },
  samples: {
    path: '/mintak',
    title: 'Átadott anyagok: pontfelhő és rajz | Pontosfelmérés',
    description:
      'A pontfelhő, az alaprajz, a metszet és a homlokzati rajz külön kérhető. Azt adjuk át, amit az ajánlatban meghatároztunk.',
    imageAlt: 'Átadott anyagok: pontfelhő és rajz',
    crumb: 'Átadott anyagok',
    lastmod: '2026-11-17',
  },
  process: {
    path: '/folyamat',
    title: 'Az épületfelmérés menete | Pontosfelmérés',
    description:
      'Négy lépés: a kimenet egyeztetése, a helyszíni munka, a feldolgozás, majd az átadás a megbeszélt formátumban.',
    imageAlt: 'Az épületfelmérés menete',
    crumb: 'Folyamat',
    lastmod: '2026-11-17',
  },
  pricing: {
    path: '/arak',
    title: 'Ajánlat épületfelmérésre | Pontosfelmérés',
    description:
      'A díj a kért kimenettől, a területtől és a helyszíntől függ. Az oldal nem ír ki árat, és nem számol automatikusan.',
    imageAlt: 'Ajánlat épületfelmérésre',
    crumb: 'Árak',
    lastmod: '2026-11-17',
  },
  faq: {
    path: '/gyik',
    title: 'Kérdések a meglévő állapotfelmérésről | Pontosfelmérés',
    description:
      'Válaszok az árról, a pontosságról, a lakott lakásról és a fájlformátumról. A felmérés nem hatósági dokumentáció.',
    imageAlt: 'Kérdések a meglévő állapotfelmérésről',
    crumb: 'GYIK',
    lastmod: '2026-11-17',
  },
  contact: {
    path: '/kapcsolat',
    title: 'Ajánlatkérés épületfelmérésre | Pontosfelmérés',
    description:
      'Írja meg a települést, az ingatlan típusát és a tervező által kért dokumentációt. Az ajánlat a tisztázás után készül.',
    imageAlt: 'Ajánlatkérés épületfelmérésre',
    crumb: 'Kapcsolat',
    lastmod: '2026-11-17',
  },
  privacy: {
    path: '/adatvedelem',
    title: 'Adatkezelési tájékoztató | Pontosfelmérés',
    description:
      'Hogyan kezeli a pontosfelmeres.hu az ajánlatkérés adatait. Nincs hírlevél és nincs követőkód.',
    imageAlt: 'Pontosfelmérés adatkezelési tájékoztató',
    crumb: 'Adatvédelem',
    lastmod: '2026-11-09',
  },
  impressum: {
    path: '/impresszum',
    title: 'Impresszum | Pontosfelmérés',
    description:
      'A pontosfelmeres.hu üzemeltetője az ADP-TOP Kft. Cégadatok, elérhetőség és a tárhely feltüntetése.',
    imageAlt: 'Pontosfelmérés impresszum',
    crumb: 'Impresszum',
    lastmod: '2026-11-09',
  },
  articles: {
    path: '/cikkek',
    title: 'Tudnivalók felújítás előtti felméréshez | Pontosfelmérés',
    description:
      'Mikor kell állapotfelmérés felújítás előtt, mire való a pontfelhő és az alaprajz, és mit egyeztessen a tervező a helyszín előtt.',
    imageAlt: 'Tudnivalók felújítás előtti felméréshez',
    crumb: 'Tudnivalók',
    lastmod: '2026-11-09',
  },
  thanks: {
    path: '/koszonjuk',
    title: 'Ajánlatkérés rögzítve | Pontosfelmérés',
    description: 'Az ajánlatkérés rögzítve. Átnézzük az adatokat, és írásos ajánlatot a tisztázás után küldünk.',
    crumb: 'Visszaigazolás',
  },
};

module.exports = {
  PAGES,
  renderHome,
  renderBuilding,
  renderRenovation,
  renderDesigners,
  renderSamples,
  renderProcess,
  renderPricing,
  renderFaqPage,
  renderContact,
  renderArticlesIndex,
  renderArticle,
  renderPrivacy,
  renderImpressum,
  renderThanks,
  renderNotFound,
};
