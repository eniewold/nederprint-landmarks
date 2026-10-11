# Prins Clausbrug (Utrecht)

Printmodel van de volledige tuibrug: twee rijbaandekken, afzonderlijke buitenpaden met eigen AHN-profielen, een getordeerde pyloon, negentien tuiparen, vier zware achtertuien, de paperclipbeugel, hoofdliggers, dwarsdragers en BGT-aanbrugpijlers. Het script bouwt doorlopende vlakken, prisma's en lofts; geen gestapelde hoogtelagen.

**De tuiwaaiers en de onderbouw zijn dichtgemaakt met geïntegreerde printvlakken, ook in de GLB.** Daardoor kan de brug op 1:1000 zonder losse slicersteun worden geprint en blijft de gezamenlijke webshopopvulling binnen het WASM-geheugen. Het luchtige karakter van de echte brug gaat hierbij verloren. De printvlakken verbergen delen van de pyloon, draagbeugel en pijlers; beoordeel deze vereenvoudiging nadrukkelijk bij review.

## Bestanden en regenereren

- `prins-clausbrug.glb`: meters, Y omhoog; 24 BGT-wegdelen, dekranden en constructie, samen 26 nodes.
- `prins-clausbrug.json`: plaatsing in RD, vervangen BGT-dekken, waterhoogte, maten, aannames en bronnen.
- `prins-clausbrug-1-1000.stl`: millimeters, Z omhoog; circa 303,9 × 37,3 × 93,4 mm, één gesloten verbonden printvolume.

```sh
node scripts/generate-prins-clausbrug.mjs
node scripts/generate-prins-clausbrug.mjs --out /absolute/lege/catalogusmap --scale 1000
```

Alle contouren en profielmetingen staan vast in het script; regenereren vereist geen netwerk. `--out` is de catalogusmap waaronder de generator de slugmap aanmaakt.

## Plaatsing en bouwdelen

RD-oorsprong `[134419, 453633.5]`, bij de pyloonvoet. De lokale +X-as volgt de lange rechte BGT-dekrand: `xAxis = [0.8697872916, 0.4934268612]`; +Y staat links daarvan. Z = 0 is het kanaalwater, aangenomen NAP −0,4 m. Vier watermonsters bepalen de kaartplaatsing; de gemeten PDOK-waterhoogte van 43,18079 m ellipsoïdisch is de terugvalwaarde. Op land bedekt bestaand terrein de constructievoeten.

De actuele BGT-dekken lopen ongeveer 304 m tussen de landhoofden. Twee rijbaandekken hebben een middenstrook die door dwarsdragers wordt overbrugd. Elk segment tussen twee AHN-profielmetingen is een schuin vlak; een gesloten BGT-prisma snijdt de buitenrand af. De buitenpaden hebben een eigen profiel: bij x = 85 m is de rijbaan NAP +12,089 m en het buitenpad +11,26 m. Aan het oostelijke einde ligt het buitenpad juist hoger dan de rijbaan.

De bovenste 0,5 m is verdeeld over eigen `road:`-nodes met de BGT-functies `rijbaan lokale weg`, `fietspad` en `voetpad` en het fysieke voorkomen. Reststroken langs de dekrand zijn voetpad. Constructie, tuiankers en printvlakken houden hun eigen materiaalklasse; een geprojecteerde rand van 2 cm scheidt ze van de weglaag. De snijstrook loopt 1 m boven het dek door om samenvallende constructieslivers te verwijderen. Gedeelde GLB-coördinaten zijn afgerond op 1 mm op ware grootte, dus 0,001 mm op 1:1000, om de dunne weglaag bij Float32-booleans te behouden.

De pyloon is een continu taps toelopende, 90° getordeerde schacht. De hoogte van 91,4 m komt van UNStudio; de voet is op 2 m boven water aangenomen, zodat de modeltop Z = 93,4 m is. Het AHN ziet de steile top niet volledig: de bovenste circa 15 m, de torsie en de topvorm zijn aangevuld uit schuine foto's. De topdoorsnede is circa 3,36 × 1,04 m.

Negentien schematische tuiparen en vier achtertuien verbinden de mast en de dekken. Verticale loftvlakken van circa 1,3 m dik sluiten de waaiers tot de printvloer. Twee doorlopende onderdekwanden hebben 43°-schouders en een wortel van minstens 1 m breed. Hun bovenzijde sluit aan op beide gemeten dekprofielen en blijft onder de weglaag. De paperclipbeugel heeft een printvoet die onder het dek eindigt. Al deze printvlakken zitten in GLB én STL en zijn onderdeel van het model.

`replacesTerrain` vervangt de twee volledig bedekte BGT-overbruggingsdelen `G0344.0bf07bdaa39143bca810f46a0ba0a9b0` en `G0344.328b60827b6a49f1be1a81b298bfb148`. Kanaalwater, oevers en aansluitende wegen op vaste grond blijven bestaande PDOK-objecten.

## Gemeten, geschat en weggelaten

Gemeten: BGT-dekken, wegcontouren, pijlerposities, hoofdas, afzonderlijke AHN-dekprofielen en PDOK-waterhoogte. De profielen vermijden voertuig- en tuipieken en interpoleren tussen ongestoorde metingen. UNStudio bevestigt de pyloonhoogte; de constructiebeschrijving van C. L. Kamp bevestigt negentien tuiparen, vier achtertuien, de gescheiden rijvloeren en de paperclip.

Geschat: dekplaat van 1,5 m, vier vereenvoudigde liggers, dwarsdragers op 3,6 m steek, pyloonvoet +2 m, masttorsie, topvorm en 3 m terugstand. De papercliparmen zijn vereenvoudigd tot 2 m doorsnede. Tuiposities en aanhechtingen volgen de foto's schematisch; de doorsneden zijn vergroot tot 0,95 m en 1,2 m voor de achtertuien. De waterbasis in NAP is een benadering; de plaatsing gebruikt de gemeten PDOK-hoogte. Alle gesloten printvlakken zijn een bewuste toevoeging ten opzichte van de werkelijkheid.

Weggelaten: dunne leuningen, lichtmasten, verankeringsbeslag, voegen en interne staalplaten vanwege hun doorsnede kleiner dan 0,9 m. Fijnere staalverstijvers zijn vervangen door hoofdliggers en dwarsdragers. De gesloten waaiers en onderbouw nemen de open ruimten van de echte brug weg en verbergen sommige gemodelleerde bouwdelen.

## Controle en analyse van de eerdere fout

Alle nodes en de STL melden `NoError`; de STL heeft één verbonden component. Alle STL-driehoeken zijn getoetst op vrije ondervlakken boven 45°; er is geen vrije overhang met een driehoekhoogte groter dan 0,05 mm. De controle van 3.510 verticale dekstralen vond geen samenvallend constructiebovenvlak en geen weglaag dunner dan 0,49 m.

Twee blijvende tests in de webshop controleren plaatsing, beide dekprofielen, de halve meter weglaag en de gezamenlijke `shareModelSupport`/`supportedSolid`-opvulling op 1:1000. Beide landmarktestsuites slagen met 352 tests. De gezamenlijke controle behoudt alle 26 onderdelen, voegt geen steun toe aan de wegklasse en controleert de volumepartitie. Een extra controle toetst doorlopende wanden van minstens 0,8 mm. De volledige `createModelBundle`-preview en 3MF slagen met het hele model binnen de uitsnede en rode fietspaden.

De eerdere fout is opnieuw geïsoleerd gereproduceerd met het bewaarde model. Tijdens het evalueren van de laatste vereniging van 64 vulvolumes groeit het WASM-geheugen van 2.077.949.952 bytes naar de runtimegrens van 4.294.901.760 bytes. Daarna volgt `RuntimeError: memory access out of bounds`. Er stonden 149.262 tijdelijke WASM-objecten geregistreerd. Ook het opruimen faalt vervolgens, waardoor de normale stacktrace vooral `delete()` laat zien. Dit is geheugenuitputting bij de gezamenlijke printopvulling; de oorspronkelijke losse STL was wel geldig.

Alleen minder driehoeken of eerder vrijgeven bleek onvoldoende: ook die gecontroleerde varianten bereikten de WASM-limiet. Door de ondersteuning als doorlopende bouwvlakken vooraf in het landmark op te nemen, wordt geen complexe verzameling dunne vulplakken onder het open dek opgebouwd. Het definitieve model slaagt in circa 15 seconden met 260.243.456 bytes WASM-geheugen. De algemene exporter is hierbij niet gewijzigd.

Vier schuine renders van GLB, STL en preview zijn vergeleken met dezelfde vier PDOK-camera's en schuine referentiefoto's. Zuidwest en noordwest voegen het pyloonsilhouet en de achterwaaiers toe; zuidoost voegt de hoofdwaaier en verhoogde dekken toe; noordoost voegt de verschillende dekprofielen en aanbrug toe. De dichtgemaakte ruimten zijn duidelijk zichtbaar in de vergelijking. De kaart toont de afzonderlijk gekleurde wegdelen. Controlebeelden, diagnostische logs en exports blijven buiten de repo.

Controle-URL: `http://localhost:3000/kaart/52.07083/5.08778/600/1x1/0?rules=r.f.fietspad.10200`. Controleer de gesloten tuiwaaiers en onderbouw, de pyloontorsie en de aansluiting bij het oostelijke landhoofd; de AHN-rijbaan sluit daar hoger aan dan de vereenvoudigde PDOK-weg.

## Bronnen

- [UNStudio, Prince Claus Bridge](https://www.unstudio.com/projects/further/prince-claus-bridge/), pyloonhoogte en gescheiden verkeersstromen.
- [C. L. Kamp, De Prins Claus Brug te Utrecht](https://bruggenstichting.nl/78-bruggen/bruggen-2005/bruggen-september-2005/462-de-prins-claus-brug-te-utrecht), Bruggenstichting, constructiebeschrijving en schema.
- [Prins Clausbrug](https://nl.wikipedia.org/wiki/Prins_Clausbrug_(Utrecht)).
- [PDOK BGT overbruggingsdeel](https://api.pdok.nl/lv/bgt/ogc/v1/collections/overbruggingsdeel/items), [wegdeel](https://api.pdok.nl/lv/bgt/ogc/v1/collections/wegdeel/items), [AHN DSM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0) en [actuele luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [Commons, Prins Clausbrug](https://commons.wikimedia.org/wiki/Category:Prins_Clausbrug_(Utrecht)), foto's vanuit NO, de oprit en onder het dek, CC BY-SA 3.0.
- [Henk Monster, cable stayed bridge more in detail](https://commons.wikimedia.org/wiki/File:The_Ben_van_Berkel_cable_stayed_bridge_across_the_Amsterdam-Rhine_canal_Utrecht_more_in_detail_-_panoramio.jpg), CC BY 3.0.
- [J. M. Muller, Prins Clausbrug 2019](https://commons.wikimedia.org/wiki/File:Prins_Clausbrug,_Amsterdam-Rijnkanaal,_Utrecht,_2019.jpg), CC BY-SA 4.0.
