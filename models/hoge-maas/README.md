# De Hoge Maas (Rotterdam)

Vereenvoudigd, printbaar model van woontoren De Hoge Maas aan het Charloisse Hoofd in Charlois (2001, Benthem Crouwel Architecten), op de zuidoever van de Nieuwe Maas tegenover het Lloydkwartier. De toren heeft 24 woonlagen op een kruisvormige plattegrond, een "Latijns kruis met ongelijke armen": de brede arm loopt door tot het dak, de smalle dwarsarm stopt vier lagen lager. Daarboven hangen aan beide kanten drie lagen balkons aan schoren. De koppen hebben glazen gevels met balkonstapels op de hoeken, de zijgevels zijn donkere platen met kleine vensters. De toren staat op een sokkel met een half verdiepte ovale parkeergarage; aan de rivierkant ligt een glazen restaurantpaviljoen in een boog om de voet.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `hoge-maas.glb` | Model in meters, Y omhoog, één node: `building:hoge-maas-toren` |
| `hoge-maas.json` | Catalogusitem |
| `hoge-maas-1-1000.stl` | Los te printen op 1:1000 (31 × 36 × 76 mm), Z omhoog |

## Oorsprong en oriëntatie

De RD-oorsprong `[91550.51, 434754.45]` ligt op de kruising van de twee armen. De X-as loopt langs de brede arm naar de rivierkop (48,7° vanaf RD-oost, naar het noordoosten), de Y-as langs de smalle arm naar het noordwesten. Lokaal z = 0 is het dek van de sokkel op NAP +5,5 m (AHN-DTM 5,4–5,5); de straat aan de kade ligt op +3,9 m. `groundHeight` is 49,0 m (ellipsoïdisch, terugval) en `groundOffsetMetres` −0,15. De BAG-contour is de hele ovale sokkel (62 × 57 m). Daarom staan in `groundSamplePoints` vijf punten op het dek rond de toren, zodat het model niet naar de straat zakt.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Brede arm | 29,6 × 16,0 m | +74,9 m | 3D BAG-dakvlak (74,89–74,97), AHN-DSM, randen uit DSM en 3D BAG |
| Dakrand brede arm | 0,9 m breed | +76,3 m | AHN-DSM (76,2–76,4) |
| Dakopbouw | 10,2 × 9,1 m | +80,4 m | 3D BAG (80,23–80,52), AHN-DSM |
| Smalle arm | 8,3 m breed, 35 m lang, schuine koppen (0,9 m verloop) | +64,1 m | 3D BAG (63,96–64,28), AHN-DSM, plattegrond 1:500 |
| Balkons boven de smalle arm (lagen 21–23) | 8,3 m breed, 3,0 m uit de gevel, per laag een driehoekige uitsparing met schoor onder 45° | +64,1 tot +72,15 m | 3D BAG (72,02–72,15), gevel 1:500 (3,2 m), foto's |
| Hoekbalkons rivierkop | 2,7 × 2,6 m per hoek, 0,9 m buiten de zijgevel | 1e laag tot +72,15 m | 3D BAG (72,0–72,1), plattegrond, foto's |
| Hoekbalkons smalle arm (zuidwestkant van beide koppen) | 2,7 × 3,2 m, 0,9 m buiten de zijgevel | 1e laag tot +61,15 m | 3D BAG (61,11–61,24), plattegrond, foto's |
| Erker zuidwestkop | 6,0 × 1,3 m | +50,15 m | plattegrond 1:500; hoogte geschat |
| Restaurantpaviljoen | boog met straal 16,3 m aan de rivierkant | +8,75 m | 3D BAG (8,63–8,82), AHN-DSM, ortho |

Verdiepingen: begane grond 3,4 m, daarboven 24 lagen van 2,75 m. Daarmee vallen de gemeten daken op laaggrenzen: +61,15 (19e laag), +64,1 (20e), +72,15 (23e) en +74,9 (24e). Gevelreliëf: per laag vensters als blinde nissen van 0,35 m met een plafond onder 45°. Op de donkere zijgevels zijn het vensters van 1,0 m op 2,7 m, op de glazen koppen, de erker en de begane grond ruiten van 1,2 m op 2,1 m. De hoekbalkons hebben per laag een open balkon van 0,9 m diep dat om de hoek loopt, met een kraag onder 45° onder het uitsteeksel.

## Geschat en weggelaten

- Naam: het projectblad en de hoogbouwlijst noemen de toren "De Hoge Maas" (lijst: "Hoge Maas", 72 m, 24 lagen).
- Verdiepingshoogte, vensterraster en vensterbreedtes zijn geschat (projectblad, foto's).
- De uitsteek van de balkons boven de smalle arm (3,0 m), de uitsteek van de hoekbalkons (0,9 m) en hun maten in de plattegrond zijn geschat uit de gevel 1:500, de 3D BAG en foto's.
- De erker aan de zuidwestkop staat op de typische plattegrond. Zijn hoogte (+50,15 m, 15e laag) is geschat uit schaarse DSM-punten (p99 45–50 m). De zuidwestkop zelf is in het AHN4 slecht gemeten; daar gelden de 3D BAG-maten (AHN5).
- De koppen van de brede arm zijn recht gehouden: de plattegrond tekent een knik van circa 0,6 m (kleiner dan 0,9 m).
- Weggelaten: de twee antennemasten op de dakopbouw en de gevelonderhoudsgiek (dunner dan 0,9 m), balkonhekken en schoren als losse staven (kleiner dan 0,9 m; de schoren zitten als 45°-vlak in de uitsparing), en de sokkel met de half verdiepte garage, de trappen en het dek. Die liggen in het maaiveld (AHN-DTM 5,4–5,5) en zouden het PDOK-terrein dubbelen.

## Controle

`node scripts/generate-hoge-maas.mjs` geeft `NoError`, genus 0 en één gesloten deel. In de webshop controleert de test de daken, de dakrand, de dakopbouw, de smalle arm, de balkons erboven, de hoekbalkons, het paviljoen en de erker. Daarnaast test hij dat de balkons boven de smalle arm en de hoekbalkons na de printcorrectie op 45° open blijven, dat het volume minder dan 1 % groeit en dat het model op het maaiveld wordt geplaatst. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en foto's van alle kanten gelegd.

## Bronnen

- PDOK BAG, pand `0599100000616618` (bouwjaar 2001); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- 3D BAG `NL.IMBAG.Pand.0599100000616618` (LoD2.2, puntwolk AHN5 2022).
- [Lijst van hoogste gebouwen van Rotterdam](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Rotterdam).
- [Projectblad Hoge Maas, Rotterdam Woont](https://rotterdamwoont.nl/app/uploads/2018/01/5.2001.1-projectblad-Hoge-Maas-2.pdf) (plattegrond en gevel 1:500, 24 lagen, 72 m).
- Foto's op Wikimedia Commons (niet meegeleverd): [Category:De Hoge Maas (Rotterdam)](https://commons.wikimedia.org/wiki/Category:De_Hoge_Maas_(Rotterdam)).
