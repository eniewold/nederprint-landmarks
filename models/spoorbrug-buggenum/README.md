# Spoorbrug Buggenum (Buggenum)

Twee parallelle spoorbruggen over de Maas, met elk vier gebogen vakwerkvelden, portalen en de drie rivierpijlers. Het model volgt de actuele BGT-dekcontouren en de AHN-hoogtes.

## Bestanden en plaatsing

- `spoorbrug-buggenum.glb`: meters, Y omhoog; vier afzonderlijke `road:spoorbaan`-nodes en één gesloten constructienode.
- `spoorbrug-buggenum.json`: RD-oorsprong `[196617.8, 359621.8]`, hoofdas `[0.7199425, -0.69403371]` naar zuidoost, +Y naar noordoost; twee te vervangen BGT-dekvlakken.
- `spoorbrug-buggenum-1-1000.stl`: één verbonden printmodel met geïntegreerde doorlopende voet, circa 289,6 × 23,1 × 19,7 mm.
- `scripts/generate-spoorbrug-buggenum.mjs`: vaste broncontouren en benoemde bouwdelen, `--out` als catalogusmap.

De waterbasis is geschat op NAP +14,65 m, met PDOK-waterterugval 59,21031 m ellipsoïdisch en bemonsteringspunten naast het noordwestelijke rivierdeel. De noordwestelijke PDOK-spooraansluiting ligt circa 0,6 m lager dan het AHN-spoor; de zuidoostelijke aansluiting komt vrijwel overeen.

## Onderdelen en schattingen

De twee actuele BGT-dekpolygonen lopen van x=-144,39 tot 144,25 m, inclusief beide landhoofden. De BGT-pijlers en landhoofden zijn volledig overgenomen, ook de uitstekende neuzen. De veldgrenzen worden uit hun ligging afgeleid: x=-134, -67, -0,2, 66,4 en 134 m. Dit geeft circa 66,8 m tussen steunpunten; de vaak gepubliceerde 4 × 62 m en 248 m zijn niet als schaalmaat gebruikt, omdat ze afwijken van de huidige BGT-contouren en pijlers.

AHN-wegvlakken liggen rond NAP +25,8 m; de vier vakwerkkruinen bereiken circa NAP +34,4 m. Doorlopende boogvlakken verbinden deze hoogtes. De schuine eindstijlen gaan over in een flauwe bovenrand; geen DSM-hoogtelagen. De dekplaat van 1,5 m, onderliggers van 2,1 m, pijleropstand, twaalf vereenvoudigde vakwerkvelden per overspanning en staafmaten zijn schattingen uit foto's.

Vier vakwerkwanden staan naast de twee afzonderlijke sporen. Voor 1:1000 zijn ze 1,5 m dik met dubbelzijdige blinde driehoeken van 0,3 m diep; de kern blijft 0,9 m. De portalen hebben een spitse opening met zelfdragende schuine bovenkanten, als printvereenvoudiging van het historische geknikte portaal. Er zijn geen vrije horizontale dwarsbalken boven het spoor. De sporen zijn 0,5 m gesloten bovenlagen met de oorspronkelijke BGT-attributen: gesloten verharding op de brug, open verharding op de landhoofden. De vakwerkwanden blijven constructie, met 2 cm vrijhouding in de wegdekstrook.

## Print en controle

De losse STL heeft twee doorlopende wanden met 43° schouders en verbrede eindankers. Alle brononderdelen zijn gesloten `NoError`; één verbonden STL, geen vrije overhang groter dan de numerieke snijsliver van 0,000001 mm.

Directe gezamenlijke `shareModelSupport`-/`supportedSolid`-controle op 1:1000 slaagt; rivierdoorsneden op 0,5, 2 en 4 mm tonen doorlopende wanden van minstens 0,8 mm. De vier spoorlagen krijgen geen eigen steun. Een volledige 500 × 500 m uitsnede is met `createModelBundle` op 1:1000 geëxporteerd en bekeken. De model-/API-tests controleren de plaatsing, kruinhoogte, spoorhoogte en BGT-attributen. 4.364 dekstralen: nul samenvallende constructievlakken en nul spoorlagen dunner dan 0,49 m. Volumepartitieverschil minder dan 0,000001 m³.

Van west, zuid, oost en noord is het model met dezelfde PDOK-camera's vergeleken. Het voegt vanuit alle kanten verhoogd spoor, vier boogvelden, dubbele vakwerkwanden, spitse portalen en de pijlers toe. De moderne overzichtsfoto en schuine NS-archieffoto's van de definitieve brug bevestigen het silhouet en de portaaldetails. Kaart en hele preview zijn bekeken met rood spoor; de oorspronkelijke grijze PDOK-dekplaat wordt verborgen zonder het water of de eilanden te verwijderen.

## Weggelaten

Open vakwerk is vervangen door blinde driehoeken voor 1:1000. Dunne dakwindverbanden, flenzen, klinknagels, bovenleiding, hekwerken en inspectiewagenonderdelen onder 0,9 m zijn weggelaten. De tijdelijk aanwezige noodbrug op archieffoto's is niet opgenomen. Geen rivierbodem, talud of eiland in de GLB. Pijlertapering en steenreliëf zijn niet opgemeten en blijven schematische BGT-prisma's.

## Bronnen

- [BGT OGC API](https://api.pdok.nl/lv/bgt/ogc/v1/), actuele versies van overbruggingsdeel en wegdeel, geraadpleegd 11 oktober 2026.
- [AHN DSM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0) en [PDOK ortho](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [Spoorbrug Buggenum](https://nl.wikipedia.org/wiki/Spoorbrug_Buggenum): constructietype en geschiedenis; bronmaten wijken af van de actuele BGT.
- [Commons: Maasbrug Buggenum.JPG](https://commons.wikimedia.org/wiki/File:Maasbrug_Buggenum.JPG), Roger Veringmeier, CC BY 3.0, moderne overzichtsfoto.
- [Commons, spoorbrug bij Buggenum](https://commons.wikimedia.org/wiki/Category:Spoorbrug_bij_Buggenum): HUA-154938, HUA-154939 en HUA-154941, Nederlandse Spoorwegen / Het Utrechts Archief, CC0, circa 1949–1955. De archieffoto's dienen voor portaal- en vakwerkvormen, de huidige ligging en hoogtes komen uit BGT/AHN. Geen referentiefoto's in de repository.
