# Sint-Jan-de-Doperkerk (Schiedam)

Rooms-katholieke kerk aan de Lange Haven 72, in de volksmond de Havenkerk, gewijd aan Johannes de Doper. De Haagse architect Adrianus Tollus bouwde haar in 1822-1824 als neoclassicistische driebeukige hallenkerk: een bakstenen zaal onder een gebroken schilddak, aan de haven een gevel van natuursteen met een Dorisch zuilenportiek en fronton, en op de voorkant van het dak een houten toren. Rijksmonument 33223. De kerk ging in 1967 dicht voor de katholieke eredienst, was van 1976 tot 2008 in gebruik bij de Johan Maasbach Wereldzending en is in 2011-2012 uitwendig gerestaureerd. Het BAG-bouwjaar 1919 (ook in de opdracht) is niet het bouwjaar. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 0606100000013902 (kerk, koorbouw, het woonhuis en de aanbouwen aan de zuidoostzijde en de lage aanbouw aan de noordwestzijde zijn één pand). De buurpanden achter en naast de kerk staan in PDOK op hun AHN-hoogte en blijven staan.
- STL op 1:1000: circa 50,6 × 35,8 × 40,8 mm.
- Genereren: `node scripts/generate-sint-jan-de-doperkerk-schiedam.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (86924,11; 436768,0), lat/lon 51,915232 / 4,397732, op de as van de zaal halverwege voor- en achtergevel, op het kademaaiveld (NAP +0,9 m). +X loopt langs de nok van de haven (zuidwest) naar de koorbouw (noordoost), onder 43,5 graden in RD (`xAxis` [0,72537; 0,68835]); +Y wijst naar het noordwesten. De langsgevels in de BAG-contour lopen onder 43,3 en 43,8 graden. `groundHeight` 44,50 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` (de kade voor de kerk en de steeg aan de noordwestzijde); de steeg loopt naar achteren 1,2 m op. `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Zaal**: 41,0 × 24,5 m (BAG), bakstenen gevels met lisenen van 1,1 m om de 5,65 m (de inspringingen in de BAG-contour) en in elke travee een hoog venster; kroonlijst met schuine onderkant.
- **Gebroken schilddak** (3D BAG en AHN): onderste schilden onder 54 graden van de goot (NAP +15,5) tot de knik (+22,6), bovenste schilden van circa 26 graden tot de nok (+26,25). Twee dakkapellen per zijde op het onderste schild, op de plekken van de pieken in het AHN.
- **Voorgevel**: natuurstenen front over de hele breedte met hoofdgestel en attiek (+17,4), gerustikeerde hoeken als brede lisenen en een hoog venster in elk zijvak.
- **Portiek** (BAG 11,1 × 3,7 m): stylobaat met trede, vier Dorische zuilen van 1,24 m met kapiteel en plint, antepilasters tegen de gevel, hoofdgestel met kroonlijst, fronton met timpaan (voet +16,6, top +19,1) en een zadeldak dat in het schilddak doorloopt. Achter de zuilen de deur en twee vensters in de gevel.
- **Dakruiter**: leien onderbouw van 5,8 m breed met schuine afdekking, klokkenverdieping van 5,0 m met hoekpilasters en twee galmgaten per zijde, kroonlijst, klokvormige kap van vierkant naar achtkant, achtkante lantaarn, koepeltje en makelaar tot +41,3 (3D BAG: hoogste punt +41,3; AHN +39,9 op de koepel).
- **Koorbouw** aan de achterzijde (BAG 12,2 × 5,2 m): schilddak met dezelfde helling als de onderste schilden (3D BAG 1,40) tot een vlakke top op +22,5 met een piramidevormige lichtkap (AHN +24,0, wit op de luchtfoto). Vensters in de zij- en achtergevel.
- **Aanbouwen in hetzelfde pand**: aan de zuidoostzijde een woonhuis met zadeldak langs de kerk (nok +11,35, goten +9,0) en een halsgevel naar de haven, een kantoor met plat dak (+8,5) naast de voorgevel en een lage sacristie (+5,8) langs de hele zuidoostgevel met een lichtkap onder zadeldak (+7,6); aan de noordwestzijde een lage aanbouw met plat dak (+5,2).

## Geschat

- De hoogtes van zuilen (kapiteel tot +12,5, hoofdgestel tot +16,7), hoofdgestel en attiek zijn uit de verhoudingen op de frontale foto's geschat en geschaald op het fronton (3D BAG) en de attiek (AHN). De positie en dikte van de zuilen en de breedte van de vensters komen uit de foto's.
- De dakruiter: de hoogte van de leien onderbouw (+29,0) en de klokkenverdieping (tot +33,3) volgt uit de foto's en de toppen in het AHN; de kap, lantaarn (2,5 m) en het koepeltje komen uit foto's van onderaf.
- De dakkapellen (1,4 m breed) zijn op de AHN-pieken gezet; hun vorm komt uit de foto's van de zuidoostzijde. Aan de noordwestzijde zijn ze symmetrisch aangenomen.
- De halsgevel van het woonhuis en de vensters erin zijn geschat naar de foto's van de kade.

## Weggelaten of vereenvoudigd

- Vensters en deuren zijn blinde nissen met een spitse top (58 graden) in plaats van een rondboog, voor print zonder steun; de lantaarn van de dakruiter is in werkelijkheid open met zuiltjes en een balustrade en is dicht gemodelleerd met vier nissen.
- Het plafond van het portiek loopt onder 49 graden naar de gevel af in plaats van vlak, zodat het open portiek zonder steun print; de zijkanten van het portiek zijn open.
- Het maaswerk in de vensters, de wijzerplaten, het kruis op de makelaar (dunner dan 0,9 m; de makelaar is een spits van 0,9 m), de triglyfen en het reliëf in het timpaan, de hekken voor de kerk, regenpijpen en schoorstenen kleiner dan 0,9 m.
- Een korte dalgoot tussen de twee delen van het woonhuis is een plat tussenstuk (+9,4).

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 4 (de vier vrijstaande zuilen). In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder het PDOK-pand en zonder ondersteuningsobject (volume gelijk aan de export zonder steun). Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Sint-Jan-de-Doperkerk (Schiedam)](https://nl.wikipedia.org/wiki/Sint-Jan-de-Doperkerk_(Schiedam))
- [Rijksmonumentenregister 33223](https://monumentenregister.cultureelerfgoed.nl/monumenten/33223)
- [OpenStreetMap way 274172367](https://www.openstreetmap.org/way/274172367)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Jan-de-Doperkerk_(Schiedam)) (33223 Johannes de Doperkerk, Johannes de Doperkerk Schiedam (01), Schiedam - Lange Haven 72, Schiedam Havenkerk, DSCF3808; RCE 20369631, 20196844, 20196845, 20196559, 20378699)
- BAG pand 0606100000013902 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0606100000013902) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
