# Pontosfelmérés

Magyar nyelvű marketing- és ajánlatkérő oldal a pontosfelmeres.hu domainre. Meglévő épületek terepi felmérését mutatja be, és ajánlatkérést fogad. Az ajánlatot nem számolja ki, szerződést nem köt, fizetést nem kezel.

Az alkalmazás önálló Node.js folyamat. A saját portja **6000**, a saját adatfájlja a `data/leads.sqlite`, a saját admin sütije a `pf6_admin`. Nem használja a site-1, site-7 vagy site-8 portját, munkamenetét, gyorsítótárát vagy feltöltési könyvtárát. Fájlfeltöltés nincs. A site-7 a 7000-es, a site-8 a 8000-es port.

## Követelmények

- Node.js 22.5 vagy újabb (a beépített `node:sqlite` miatt). A fejlesztés Node.js 24-en készült.
- A 6000-es port legyen szabad.
- Éles levélküldéshez SMTP-kiszolgáló. Enélkül az ajánlatkérés akkor is rögzül.

## Első indítás

```bash
cp .env.example .env
```

A `.env` fájlban cserélje le az `ADMIN_TOKEN` értékét. A példa szöveg szándékosan nem fogadható el. Token készítése:

```bash
node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"
```

Állítsa be a figyelt `CONTACT_EMAIL` címet és a `SMTP_*` mezőket. A `SMTP_PASS` csak a `.env` fájlba kerül, nem a verziókezelt példába.

```bash
npm install
npm start
```

Fejlesztés közben, újraindítással fájlváltozáskor:

```bash
npm run dev
```

Az oldal: `http://127.0.0.1:6000/`  
Az admin: `http://127.0.0.1:6000/admin`

Windows PowerShellben a másolás: `Copy-Item .env.example .env`

## Build

Nincs külön frontend-build. Az éles telepítés a függőségek telepítése és a folyamat indítása:

```bash
npm ci --omit=dev
npm start
```

A `NODE_ENV=production` a `.env` fájlban állítható. A statikus fájlok a `public/` könyvtárból mennek, sablonfordítás nincs.

Ellenőrzés telepítés előtt:

```bash
npm test
```

## Docker

A `docker-compose.yml` külön konténert indít, `unless-stopped` újraindítással. A konténeren belül a port 6000, az adat a `pontosfelmeres_data` volume-on van, nem a gépen megosztott feltöltési mappában.

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f
```

A compose felülírja a `PORT` és a `DATA_FILE` értékét, hogy a konténer akkor is a saját volume-jára írjon, ha a `.env` helyi útvonalat tartalmaz. A titkok továbbra is a `.env` fájlból jönnek.

## systemd

A `deploy/pontosfelmeres.service` sablon külön felhasználóval indul, és `Restart=always` miatt újraindul. A példa útvonal `/var/www/site-6_newdew`. Ezt a tényleges könyvtárra kell cserélni.

```bash
sudo useradd --system --home /var/www/site-6_newdew --shell /usr/sbin/nologin pontosfelmeres
sudo chown -R pontosfelmeres:pontosfelmeres /var/www/site-6_newdew
sudo cp deploy/pontosfelmeres.service /etc/systemd/system/pontosfelmeres.service
sudo systemctl daemon-reload
sudo systemctl enable --now pontosfelmeres
```

## Naplók

Az alkalmazás a szabványos kimenetre ír: idő, metódus, útvonal, állapotkód, időtartam. A lead törzsét és a jelszót nem naplózza.

- systemd: `journalctl -u pontosfelmeres -f`
- Docker: `docker compose logs -f` (a json-file driver 5×10 MB-nál rotál)
- közvetlen indítás: a folyamat saját terminálja

Nincs közös naplófájl más site-okkal.

## Reverse proxy

Minta: `deploy/nginx-pontosfelmeres.conf`. A `pontosfelmeres.hu` a `127.0.0.1:6000` címre továbbít. A `www` cím 301-gyel az apexre megy. TLS után a `SITE_URL` legyen `https://pontosfelmeres.hu`.

A `TRUST_PROXY=1` csak akkor kerüljön a `.env` fájlba, ha a 6000-es port kívülről nem érhető el, csak a proxy felől. Különben a továbbított IP-fejléc hamisítható.

Későbbi, másik mappában futó oldalak, amelyeket ez a konfiguráció nem indít: `3dscantobim.hu` → `127.0.0.1:7000`, `hatekony3dfelmeres.hu` → `127.0.0.1:8000`.

Caddy, ha a gépen ez a proxy:

```caddy
pontosfelmeres.hu {
    reverse_proxy 127.0.0.1:6000
}
www.pontosfelmeres.hu {
    redir https://pontosfelmeres.hu{uri} permanent
}
```

## Adat és mentés

Az ajánlatkérések sqlite fájlban vannak. Alaphelyzetben: `data/leads.sqlite`. Másik fájl a `DATA_FILE`, vagy `DATABASE_URL=sqlite:./data/leads.sqlite`. Postgres és más közös adatbázis nem támogatott: az alkalmazás ilyen címmel nem indul.

A lead mezői: beküldés időpontja, forrásdomain, forrás URL, kampány és UTM, név, e-mail, telefon, város, ingatlan típusa, méret, projekt típusa, kért dokumentáció, határidő, megjegyzés, státusz. A tervező és a levelezés állapota is rögzül.

Mentés leállított folyamattal:

```bash
sudo systemctl stop pontosfelmeres
cp data/leads.sqlite /mentes/leads-$(date +%F).sqlite
sudo systemctl start pontosfelmeres
```

Futás közben a `-wal` és `-shm` fájl is a `data/` könyvtárban lehet. Ezeket is ennek a projektnek a könyvtárában kell tartani.

## E-mail

Ha az `SMTP_HOST` üres, a lead rögzül, levél nem megy. Ha ki van töltve, az üzemeltető a `CONTACT_EMAIL` címre kap értesítést, válaszcímként a kérdező címével. A `SMTP_SEND_CUSTOMER_COPY=true` rövid visszaigazolást küld a kérdezőnek is, ár nélkül. A küldés legfeljebb néhány másodpercig vár; hiba esetén a lead megmarad, a státusza az adminban látszik.

## Admin és CSV

A `/admin` jelszava az `ADMIN_TOKEN`. A munkamenet 12 óráig él, csak ebben a folyamatban, httpOnly sütiben. Újraindítás után újra be kell lépni.

A lista szűrhető, a státusz módosítható, a CSV a `/admin/export.csv` címen tölthető. A fájl UTF-8, pontosvesszővel tagolt, a magyar Excelhez. A `=`, `+`, `-` vagy `@` kezdetű cellák elé aposztróf kerül, hogy a táblázat ne futtasson képletet.

## SEO

Minden nyilvános oldal saját title és description szöveget kap, Open Graph és Twitter Card tagekkel. A `sitemap.xml` és a `robots.txt` a `SITE_URL` alapján készül. Az admin és a visszaigazoló oldal nincs a térképen. A főoldalon Organization, ProfessionalService és FAQPage, a cikkeken Article séma van.

## Amit az alkalmazás szándékosan nem tud

- Nincs árkalkulátor és nincs közzétett négyzetméterár.
- Nincs fizetés, számla és automatikus szerződés.
- Nincs fájlfeltöltés.
- Nincs mérőkód, hírlevél és közös gyorsítótár.
- Nincs településenkénti tömeges oldal.

## Éles közzététel előtt

- Valódi, figyelt e-mail cím és SMTP.
- Egyedi admin jelszó és, ha kell, külön `SESSION_SECRET`.
- `HOSTING_PROVIDER`, `HOSTING_ADDRESS`, `HOSTING_EMAIL` az impresszumban.
- `SITE_URL` a végleges https cím.
- A tárhely és az adatkezelési szöveg átnézése, ha a levelező szolgáltató az EGT-n kívül dolgozik.
