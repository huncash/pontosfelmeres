const { esc, safeEmail, telHref } = require('../util');
const { FAQ, faqHtml } = require('./faq');
const { ARTICLES } = require('./articles');
const { ctaBand } = require('../form');

const HOME_FAQ = FAQ.slice(0, 5);

function renderHome({ formHtml }) {
  return `
  <section class="hero">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <p class="kicker">Építészeknek, belsőépítészeknek, felújítóknak</p>
        <h1>Tervezéshez használható meglévő állapotfelmérés</h1>
        <p class="lede">Pontfelhő, alaprajz és a tervezőjével egyeztetett dokumentáció.</p>
        <div class="actions">
          <a class="btn" href="#ajanlat">Kérjen ajánlatot</a>
          <a class="btn btn-ghost" href="/mintak">Nézze meg, mit kap pontosan</a>
        </div>
        <p class="note">Már az ajánlat előtt tisztázzuk, mire lesz szüksége a tervezőnek, és pontosan mit adunk át.</p>
      </div>
      <aside class="hero-panel">
        <p class="kicker">Átadás</p>
        <h2>A lista a feladaté, nem egy általános csomagé.</h2>
        <ul class="checklist">
          <li>Pontfelhő, ha a tervező ebből dolgozik</li>
          <li>2D alaprajz és a megbeszélt metszet</li>
          <li>Rövid megjegyzés arról, hol nem látott be a mérés</li>
          <li>Ami nincs a listán, nem része a munkának</li>
        </ul>
        <figure class="plate">
          <img src="/images/plate-plan.svg" width="640" height="420" alt="Sematikus alaprajzi helyőrző. Nem egy elvégzett felmérés rajza.">
          <figcaption><span>Helyőrző</span> Ide kerül a jóváhagyott projektábra.</figcaption>
        </figure>
      </aside>
    </div>
  </section>
  <section class="statement">
    <div class="wrap">
      <p>A meglévő épület felmérése, a tervezőjével egyeztetett dokumentációval.</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <p class="kicker">Szolgáltatás</p>
        <h2>Milyen feladatra kérhető</h2>
      </div>
      <div class="cards">
        <article class="card">
          <p class="card-index">01</p>
          <h3>Lakás és családi ház felmérés</h3>
          <p>Ha a tervezés egy meglévő lakásból vagy házból indul, a falak, a nyílások és a szinteltérések nem maradhatnak feltételezések. Az ajánlat előtt rögzítjük, hogy alaprajz, metszet, pontfelhő vagy ezek kombinációja kell.</p>
          <a href="/epulet-felmeres">Épületfelmérés részletesen</a>
        </article>
        <article class="card">
          <p class="card-index">02</p>
          <h3>Iroda, üzlet és kisebb kereskedelmi egység felmérés</h3>
          <p>Bérlemény felújításánál a belmagasság, a pillérek, a portál és a látható gépészeti nyomvonalak befolyásolják a tervet. A helyszíni munkát a nyitvatartáshoz és a hozzáféréshez igazítjuk.</p>
          <a href="/epulet-felmeres">Mire terjed ki a felmérés</a>
        </article>
        <article class="card">
          <p class="card-index">03</p>
          <h3>Felújítás vagy átépítés előtti állapotfelmérés</h3>
          <p>Bontás, válaszfalmozgatás vagy bővítés előtt a meglévő geometria a terv kiinduló állapota. A munka nem helyettesíti a statikai vizsgálatot, és nem mér abba, ami bontás nélkül nem látszik.</p>
          <a href="/felujitas-alapfelmeres">Felújítás előtti alapfelmérés</a>
        </article>
      </div>
    </div>
  </section>
  <section class="section section-alt">
    <div class="wrap">
      <div class="section-head">
        <p class="kicker">Menet</p>
        <h2>Hogyan dolgozunk</h2>
      </div>
      <ol class="steps">
        <li>
          <span>01</span>
          <h3>Projekt és kimenet egyeztetése</h3>
          <p>Megkérdezzük, miből dolgozik a tervező, melyik helyiségek kellenek, és mi marad ki. Az ajánlat ezt a listát árazza, nem egy előre gyártott csomagot.</p>
        </li>
        <li>
          <span>02</span>
          <h3>Helyszíni terepi felmérés</h3>
          <p>A választott módszerrel mérünk: kézi ellenőrző mérettel, műszeresen vagy pontfelhővel. A takart felületet a helyszínen feljegyezzük.</p>
        </li>
        <li>
          <span>03</span>
          <h3>Feldolgozás és minőség-ellenőrzés</h3>
          <p>A rajzot és a pontfelhőt a vállalt tartalomhoz viszonyítjuk. A hiányos lefedettséget jelöljük, nem hallgatjuk el.</p>
        </li>
        <li>
          <span>04</span>
          <h3>Átadás a megbeszélt formátumban</h3>
          <p>A fájlok és a rövid lefedettségi megjegyzés együtt mennek. Ami a listán nem szerepelt, nem kerül utólag a munkába.</p>
        </li>
      </ol>
      <p class="section-link"><a href="/folyamat">A négy lépés részletesen</a></p>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <p class="kicker">Kimenet</p>
        <h2>Három konkrét átadási példa</h2>
        <p>Ezek nem választható díjcsomagok. Azt mutatják, milyen különböző dolgot jelent a három gyakori kérés. A valódi lista a tervezővel egyeztetve, az ajánlatban születik meg.</p>
      </div>
      <div class="outputs">
        <article>
          <figure class="plate">
            <img src="/images/plate-cloud.svg" width="640" height="420" alt="Sematikus pontfelhő-helyőrző, nem mérési eredmény.">
            <figcaption><span>Helyőrző</span> Pontfelhő</figcaption>
          </figure>
          <h3>Pontfelhő</h3>
          <p>A látható felületek térbeli lenyomata. Akkor hasznos, ha a tervező ebből modellez, vagy ha a ferde sík és a lépcső egy alaprajzból nem érthető. Önmagában még nem alaprajz és nem engedélyezési terv.</p>
        </article>
        <article>
          <figure class="plate">
            <img src="/images/plate-plan.svg" width="640" height="420" alt="Sematikus alaprajz és metszet helyőrző.">
            <figcaption><span>Helyőrző</span> 2D rajz</figcaption>
          </figure>
          <h3>2D alaprajz és metszet</h3>
          <p>Értelmezett rajz a megbeszélt metszési magassággal, a kért nyílásokkal és magasságokkal. Ezt lehet szerkeszteni. A metszet helyét előre kijelöljük, nem a feldolgozás végén sorsoljuk.</p>
        </article>
        <article>
          <figure class="plate">
            <img src="/images/plate-pack.svg" width="640" height="420" alt="Sematikus dokumentációs csomag helyőrző, három lap felirattal.">
            <figcaption><span>Helyőrző</span> Egyeztetett csomag</figcaption>
          </figure>
          <h3>Tervezővel egyeztetett dokumentációs csomag</h3>
          <p>A pontfelhő, a rajz és a lefedettségi megjegyzés abból a listából áll, amelyet a tervező a munka előtt jóváhagy. Az átadás ehhez a listához igazodik, formátummal együtt.</p>
        </article>
      </div>
      <p class="section-link"><a href="/mintak">Minta kimenetek és ami kimarad belőlük</a></p>
    </div>
  </section>
  <section class="section section-alt">
    <div class="wrap trust">
      <p class="kicker">Ki végzi</p>
      <h2>A felmérést ugyanaz a csapat viszi végig.</h2>
      <p>A megkeresést, a helyszíni felmérést és az egyeztetett dokumentációt egy folyamatban kezeljük. Az oldal nem készít automatikus árat, nem köt szerződést, és nem ígér hatósági záradékot.</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <p class="kicker">Kérdések</p>
        <h2>Amit az ajánlat előtt érdemes tudni</h2>
      </div>
      ${faqHtml(HOME_FAQ)}
      <p class="section-link"><a href="/gyik">Az összes kérdés</a></p>
    </div>
  </section>
  <section class="section section-alt" id="ajanlat">
    <div class="wrap form-layout">
      <div>
        <p class="kicker">Ajánlatkérés</p>
        <h2>Kérjen ajánlatot</h2>
        <p>Az űrlap nem számít árat. Azt rögzíti, amiből egy tisztázó kérdéssor és egy írásos ajánlat készülhet. Ha a tervezői kimenet még bizonytalan, válassza azt a lehetőséget: az ajánlat előtt ezt tisztázzuk.</p>
      </div>
      ${formHtml}
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <p class="kicker">Tovább a témában</p>
        <h2>A felmérés előtti döntésekről</h2>
      </div>
      <div class="cards">
        ${ARTICLES.slice(0, 3)
          .map(
            (article) => `<article class="card">
              <h3><a href="${article.path}">${article.title}</a></h3>
              <p>${article.description}</p>
            </article>`
          )
          .join('')}
      </div>
      <p class="section-link"><a href="/cikkek">Mind a hat cikk</a></p>
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
    <p class="kicker">Minták</p>
    <h1>Minta kimenetek, nem kitalált referenciák</h1>
    <p class="lede">A keretekben sematikus helyőrzők vannak. Valós projektábrát csak a megbízó hozzájárulásával teszünk ide. Addig a kimenet szerkezetét írjuk le, ügyfélnév és idézett vélemény nélkül.</p>
    <p>Egy felmérés attól lesz összehasonlítható, hogy a tartalomjegyzéke előre olvasható. Az alábbi három példa illusztráció. Nem ajánlat, nem ár, és nem egy konkrét ház adata. Ha a feladat ettől eltér, az ajánlat a tervező listáját követi, nem ezeket a bekezdéseket.</p>
    <h2>1. Pontfelhő</h2>
    <figure class="plate">
      <img src="/images/plate-cloud.svg" width="640" height="420" alt="Sematikus pontfelhő egy helyiség sarkáról. Helyőrző ábra.">
      <figcaption><span>Helyőrző</span> Ide kerülhet egy jóváhagyott pontfelhő-részlet.</figcaption>
    </figure>
    <p>Átadáskor a megbeszélt csereformátumú állomány és egy rövid kísérőszöveg készül: melyik álláspontokból látszik a tér, hol takart a bútor, hol zajos a felület. A pontfelhő a látható felületek lenyomata. Nem tartalmaz falobjektumot, méretláncot és helyiségpecsétet, hacsak a feladat ezek szerkesztését külön nem kéri.</p>
    <h2>2. 2D alaprajz és metszet</h2>
    <figure class="plate">
      <img src="/images/plate-plan.svg" width="640" height="420" alt="Sematikus lakásalaprajz méretvonalakkal. Helyőrző ábra.">
      <figcaption><span>Helyőrző</span> Ide kerülhet egy jóváhagyott alaprajzi kivágat.</figcaption>
    </figure>
    <p>A rajzi minta egy lakás érintett helyiségeire: alaprajz egy rögzített metszési magassággal, nyílások a látható tok szerint, belmagasság a kért helyiségekben, és egy metszet a nappali meg a nedveshelyiség irányában, ha ezt a tervező kérte. A fájl PDF és szerkeszthető rajz, ha az ajánlat így szól. A metszet síkját nem a feldolgozó választja ki utólag.</p>
    <h2>3. Tervezővel egyeztetett dokumentációs csomag</h2>
    <figure class="plate">
      <img src="/images/plate-pack.svg" width="640" height="420" alt="Három sematikus lap: pontfelhő, alaprajz, megjegyzés. Helyőrző ábra.">
      <figcaption><span>Helyőrző</span> A csomag tartalomjegyzéke az ajánlatban születik.</figcaption>
    </figure>
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
    <h1>Árazási logika, nem azonnali díj</h1>
    <p class="lede">Az oldalon nincs árkalkulátor és nincs sávos „ettől a négyzetméteráron” ígéret. A díj egy adott átadási listához tartozik. A lista nélkül a szám félrevezető lenne.</p>
    <p>Két hasonló méretű lakás felmérése nem azonos munka, ha az egyiken egy alaprajz kell, a másikon pedig pontfelhő, két metszet és egyeztetés a tervező irodájával. Ezért az ajánlatkérés nem árat ad vissza, hanem elindítja a tisztázást. Ha az adatok ehhez eleve kevesek, előbb kérdezünk.</p>
    <h2>Mitől függ az ajánlat?</h2>
    <div class="table-wrap">
      <table class="factor-table">
        <thead>
          <tr><th>Szempont</th><th>Hogyan jelenik meg az ajánlatban</th></tr>
        </thead>
        <tbody>
          <tr><td>Alapterület és szintek</td><td>A helyszíni idő és a feldolgozás mennyisége ettől függ. A becsült méret az űrlapon elég a nagyságrendhez.</td></tr>
          <tr><td>Kért kimenet</td><td>A csak pontfelhő, a 2D rajz és az egyeztetett csomag más-más munkát jelent. Mindegyik tétel olvasható az ajánlatban.</td></tr>
          <tr><td>Tervezői egyeztetés</td><td>Ha a tartalmat és a formátumot a tervezővel egyeztetni kell, ez a munka része, nem utólagos meglepetés.</td></tr>
          <tr><td>Hozzáférés</td><td>Lakott lakás, bútorozott iroda, rövid időablak vagy csak részben járható padlás módosítja a helyszíni munkát.</td></tr>
          <tr><td>Kiszállás</td><td>A budapesti és a vidéki megközelítés ideje külön tétel. A település ezért kötelező adat.</td></tr>
          <tr><td>Határidő</td><td>A szokásos feldolgozási rendtől eltérő határidőt csak akkor vállalunk, ha a kapacitás engedi, és ezt külön írjuk.</td></tr>
          <tr><td>Kizárt részek</td><td>Homlokzat, tető, kert, rejtett gépészet vagy statikai vélemény csak külön kérésre, és csak ha a feladatba belefér.</td></tr>
        </tbody>
      </table>
    </div>
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
    <p class="lede">Írjon az űrlapon, vagy hívjon. Az első válasz a feladat tisztázása, nem egy automatikus díj.</p>
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
    <p>A szövegek a szolgáltatás kereteit írják le. Az ajánlat mindig a konkrét feladatra szól, írásban. Az oldalon szereplő sematikus ábrák helyőrzők, nem elvégzett felmérések. A pontosság, a lefedettség és a kizárások a vállalt feladat részei, nem általános ígéretek. Az oldal nem nyújt földhivatali, hatósági záradékolási vagy tervezői felelősségvállalási szolgáltatást.</p>
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
    <p>Átnézzük a megadott adatokat. Ha a tervezői kimenethez vagy a helyszínhez hiányzik valami, visszakérdezünk. Írásos ajánlatot ezután küldünk. Az űrlap nem készített árat, és nem jött létre szerződés.</p>
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
    title: 'Tervezéshez használható meglévő állapotfelmérés | Pontosfelmérés',
    description:
      'Meglévő épület felmérése tervezéshez: pontfelhő, alaprajz és a tervezővel előre egyeztetett dokumentáció. Ajánlatot a feladat ismeretében adunk.',
    h1: 'Tervezéshez használható meglévő állapotfelmérés',
  },
  building: {
    path: '/epulet-felmeres',
    title: 'Épületfelmérés tervezéshez | Pontosfelmérés',
    description:
      'Lakás, ház, iroda és kisebb üzlet épületfelmérése a tervezővel egyeztetett kimenettel. Pontfelhő vagy alaprajz csak akkor, ha a feladat kéri.',
    crumb: 'Épületfelmérés',
  },
  renovation: {
    path: '/felujitas-alapfelmeres',
    title: 'Felújítás előtti alapfelmérés | Pontosfelmérés',
    description:
      'Felújítás és átépítés előtti állapotfelmérés: a meglévő geometria a terv kiinduló adata. Nem statika és nem hatósági záradék.',
    crumb: 'Felújítás előtt',
  },
  designers: {
    path: '/tervezoknek',
    title: 'Felmérés tervezőknek és építészeknek | Pontosfelmérés',
    description:
      'Építészeknek és belsőépítészeknek: a felmérés előtt rögzítjük a fájlt, a terjedelmet és a kizárásokat. Az átadás ehhez a listához igazodik.',
    crumb: 'Tervezőknek',
  },
  samples: {
    path: '/mintak',
    title: 'Minta kimenetek: pontfelhő és alaprajz | Pontosfelmérés',
    description:
      'Milyen egy pontfelhő, egy 2D alaprajz és egy tervezővel egyeztetett dokumentációs csomag. Tartalmi minta, kitalált referencia nélkül.',
    crumb: 'Minták',
  },
  process: {
    path: '/folyamat',
    title: 'Hogyan zajlik az épületfelmérés | Pontosfelmérés',
    description:
      'A terepi felmérés négy lépése: kimenet egyeztetése, helyszíni munka, feldolgozás és átadás a megbeszélt formátumban.',
    crumb: 'Folyamat',
  },
  pricing: {
    path: '/arak',
    title: 'Árazás és ajánlatkérés épületfelméréshez | Pontosfelmérés',
    description:
      'Az épületfelmérés díja a kimenettől, a területtől és a helyszíntől függ. Az oldal nem ad azonnali árat és nem számol automatikusan.',
    crumb: 'Árak',
  },
  faq: {
    path: '/gyik',
    title: 'Gyakori kérdések az épületfelmérésről | Pontosfelmérés',
    description:
      'Válaszok az azonnali árról, a pontosságról, a lakott lakásról, a fájlformátumról és arról, hogy a felmérés nem hatósági záradék.',
    crumb: 'GYIK',
  },
  contact: {
    path: '/kapcsolat',
    title: 'Kapcsolat és ajánlatkérés | Pontosfelmérés',
    description:
      'Kérjen ajánlatot meglévő állapotfelmérésre. Írja meg a települést, az ingatlan típusát és a tervező által kért dokumentációt.',
    crumb: 'Kapcsolat',
  },
  privacy: {
    path: '/adatvedelem',
    title: 'Adatkezelési tájékoztató | Pontosfelmérés',
    description:
      'Hogyan kezeli a pontosfelmeres.hu az ajánlatkérés adatait. Nincs hírlevél és nincs követőkód.',
    crumb: 'Adatvédelem',
  },
  impressum: {
    path: '/impresszum',
    title: 'Impresszum | Pontosfelmérés',
    description:
      'A pontosfelmeres.hu üzemeltetője az ADP-TOP Kft. Cégadatok, elérhetőség és a tárhely feltüntetése.',
    crumb: 'Impresszum',
  },
  articles: {
    path: '/cikkek',
    title: 'Cikkek a meglévő állapotfelmérésről | Pontosfelmérés',
    description:
      'Mikor kell felmérés felújítás előtt, mire való a pontfelhő, az alaprajz és a BIM, és mit kérjen a tervező a helyszín előtt.',
    crumb: 'Tudnivalók',
  },
  thanks: {
    path: '/koszonjuk',
    title: 'Ajánlatkérés rögzítve | Pontosfelmérés',
    description: 'Az ajánlatkérés rögzítve. Átnézzük az adatokat, és írásos ajánlatot a tisztázás után küldünk.',
    crumb: 'Visszaigazolás',
  },
};

module.exports = {
  HOME_FAQ,
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
