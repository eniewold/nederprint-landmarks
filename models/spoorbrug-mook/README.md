# Spoorbrug Mook (Mook)

Enkelsporige Maasbrug met twee rechte Callender-Hamiltonvelden, één trapeziumvormig Warrenveld en vier vlakke betonnen aanbruggen. De afzonderlijke fietsbrug De Maasover naast de spoorbrug valt buiten dit model.

## Bestanden en plaatsing

- `spoorbrug-mook.glb`: meters, Y omhoog; twee `road:spoorbaan`-nodes met oorspronkelijke BGT-attributen en één gesloten constructienode.
- `spoorbrug-mook.json`: RD-oorsprong `[188385.7485, 418629.5835]`, +X `[0.60325989, 0.79754468]` naar noordoost, +Y naar noordwest; één te vervangen BGT-dekplaat.
- `spoorbrug-mook-1-1000.stl`: één verbonden printvolume met geïntegreerde voet, circa 366,24 × 22,62 × 18,84 mm.
- `scripts/generate-spoorbrug-mook.mjs`: vaste broncontouren en bouwdelen; `--out` als catalogusmap.

De geschatte waterbasis NAP +8,18 m volgt een AHN-waterpatch en sluit aan op de zuidwestelijke PDOK-spooraansluiting. De PDOK-waterterugval is 51,75481 m ellipsoïdisch; vier meetpunten liggen naast de rivieroverspanning. Aan de noordoostelijke aansluiting ligt het PDOK-spoor circa 0,7 m onder de AHN-hoogte, die in het model behouden is.

## Maten, onderdelen en schattingen

Het volledige actuele BGT-dek loopt van x=-181,18 tot +184,06 m: 365,24 m inclusief landhoofden. De vaak vermelde 353 m is een afgeronde historische constructiemaat en is niet gebruikt om de actuele contour te schalen. De brede BGT-pijlers zijn behouden. De drie vakwerkvelden liggen tussen de pijlerharten x=-72,3, 1,6, 75,6 en 149,7 m: circa 74 m per veld. Drie vlakke aanbrugvelden liggen ten zuidwesten en één ten noordoosten.

AHN toont een spoorvlak rond NAP +18,9 m en bovenliggers rond +27,02 m. Doorlopende dekvlakken volgen de gemeten kleine eindhellingen. De eerste twee vakwerkvelden hebben een rechte bovenrand en ruitenverband; het derde heeft schuine eindstijlen, een vlakke bovenrand en V-liggers. Deze vlakken zijn uit polygonprofielen gebouwd, zonder hoogtelagen.

De bronfoto's bepalen de vakwerktypen en de onderbouw. Dekplaat 1,5 m, plaatliggerdiepte 2,1 m, vereenvoudigde pijleropstand en het ontbrekende noordoostelijke landhoofd op x=183 m zijn geschat. Pijlers blijven schematische prisma's binnen hun gemeten BGT-contour. Staafdiktes zijn aangepast aan 1:1000: twee 1,5 m vakwerkwanden hebben dubbelzijdig 0,3 m diepe blinde ruiten of driehoeken en een 0,9 m kern. Zes portalen hebben een spitse zelfdragende doorgang in plaats van de echte vlakke dakbalk.

De twee spoorlagen zijn de bovenste 0,5 m van hun BGT-wegdeel: half verhard bij het zuidwestelijke landhoofd en gesloten verharding op de eigenlijke brug. Geen fictieve fiets- of voetpadattributen. De vakwerkstaanders blijven constructie, met 2 cm vrijhouding in de wegdekstrook.

## Print en controle

Alle brononderdelen zijn gesloten `NoError`; de STL is één verbonden volume. Twee doorlopende wanden met 43° schouders en verbrede eindankers geven een printvoet zonder losse steun. De overhangcontrole vindt alleen een numerieke snijsliver van 0,000032 mm.

De directe gezamenlijke `shareModelSupport`-/`supportedSolid`-controle op 1:1000 slaagt. Rivierdoorsneden op 0,5, 2 en 4 mm behouden doorlopende wanden van minstens 0,8 mm; de spoorlagen krijgen geen eigen steun. Een volledige 500 × 500 m uitsnede is met `createModelBundle` op 1:1000 geëxporteerd en bekeken. Model- en API-tests controleren plaatsing, vakwerkhoogte, spoorhoogte en BGT-attributen. 9.965 dekstralen vinden nul samenvallende constructievlakken en nul spoorlagen dunner dan 0,49 m; de bronvolumepartitie wijkt minder dan 0,00001 m³ af.

De renders vanuit zuid, oost, noord en west zijn met identieke PDOK-camera's vergeleken en naast schuine bronfoto's bekeken. Alle kanten voegen verhoogd spoor, drie afzonderlijke vakwerkvelden en brede pijlers toe; de zijaanzichten tonen tevens het verschil tussen ruitenverband en V-liggers. Kaart en volledige preview tonen rood spoor; de grijze spoorbrugplaat wordt verborgen terwijl de afzonderlijke fietsbrug en de Maas behouden blijven.

## Weggelaten en bronnen

Open vakwerk is voor printbaarheid vervangen door blinde nissen. Dunne windverbanden, bovenleiding, leuningen, flenzen, klinknagels en inspectietrappen onder 0,9 m ontbreken. Geen talud of rivierbodem in de GLB. De fietsbrug De Maasover is een afzonderlijk object op circa 20 m afstand en is niet vervangen; de huidige foto's en de ontwerpersbron bevestigen deze scheiding.

- [BGT OGC API](https://api.pdok.nl/lv/bgt/ogc/v1/), actuele overbruggingsdelen en wegdelen, geraadpleegd 11 oktober 2026.
- [AHN DSM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0) en [PDOK ortho](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [Spoorbrug Mook](https://nl.wikipedia.org/wiki/Spoorbrug_Mook), constructietypen en drie vakwerkvelden.
- [Ontwerper fietsbrug Cuijk–Mook](https://www.karresenbrands.com/nl/projecten/bicycle-bridge-cuijk-mook), ligging van de afzonderlijke fietsbrug.
- [Spoorbrug Mook 5.jpg](https://commons.wikimedia.org/wiki/File:Spoorbrug_Mook_5.jpg), [6.jpg](https://commons.wikimedia.org/wiki/File:Spoorbrug_Mook_6.jpg) en [8.jpg](https://commons.wikimedia.org/wiki/File:Spoorbrug_Mook_8.jpg), Bennie91, CC BY-SA 4.0: Warrenveld, ruitenverband en onderzijde.
- [Noordoostzijde](https://commons.wikimedia.org/wiki/File:Mook_Spoorbrug_and_De_Maasover_seen_from_the_northeast.jpg), [vanaf De Maasover](https://commons.wikimedia.org/wiki/File:Mook_Spoorbrug_seen_from_De_Maasover.jpg) en [vanaf Rivierkazemat-Zuid](https://commons.wikimedia.org/wiki/File:Katwijk_NB_Spoorbrug_Mook_and_De_Maasover_seen_from_the_Rivierkazemat-Zuid.jpg), Ymblanter, CC BY-SA 4.0. Referentiefoto's en controlebeelden staan buiten de repository.
