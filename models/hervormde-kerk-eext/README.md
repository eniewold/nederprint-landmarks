# Hervormde Kerk (Eext)

Eenbeukige bakstenen zaalkerk aan de Kloosterstraat in Eext (gemeente Aa en Hunze), gebouwd in 1841 als waterstaatskerk in opdracht van de Staten van Drenthe, toen Eext een zelfstandige kerkelijke gemeente werd (daarvoor hoorde het bij Anloo). Rijksmonument 398783. De zaal heeft een driezijdige sluiting onder een schilddak met pannen, een rechte voorgevel met een wit ingangsportaal met fronton (jaartal 1841) en op de nok achter de voorgevel een opengewerkte dakruiter met naaldspits. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 1680100000001054 (de kerk is één pand). Het buurpand 1680100000001053 (1958) staat 2,8 m los van de kerk en blijft staan.
- STL op 1:1000: circa 19,0 × 9,8 × 18,6 mm.
- Genereren: `node scripts/generate-hervormde-kerk-eext.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (245488,98; 559888,24), lat/lon 53,018313 / 6,735699, midden tussen de zijgevels en 8,1 m achter de voorgevel, op maaiveld (NAP +17,0 m). +X loopt langs de nok van de voorgevel (noordoost) naar de sluiting (zuidwest), onder -147,25 graden in RD (`xAxis` [-0,84104; -0,54097]); +Y wijst naar het zuidoosten. De zijgevels van de BAG-contour staan op -147,4 en 33,1 graden en de nok ligt er in de 3D BAG en het AHN evenwijdig aan. De BAG-contour ligt circa 0,4 m naast het AHN (de nok ligt in het AHN en de 3D BAG op y = +0,4); het model volgt de BAG. `groundHeight` 58,10 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` (zuidoostkant bij de sluiting); het maaiveld rond de kerk varieert maar 0,2 m. `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Zaal**: 9,22 m breed, voorgevel tot de aanzet van de sluiting 14,2 m, driezijdige sluiting (halve zeshoek, vlakken 4,6 m) uit de BAG-contour, symmetrisch gemaakt. Plint van 0,15 m met een schuine bovenkant, lisenen (0,8 m, 0,2 m voor de muur) op de hoeken van de voorgevel en bij de aanzet van de sluiting.
- **Schilddak**: nok +10,85 m (3D BAG +10,9, AHN +10,75 tot +10,9), zijvlakken met helling 1,19 (50 graden, 3D BAG 1,18 en 1,20), goot +5,36 op de muurlijn. De drie dakvlakken van de sluiting lopen naar één nokpunt 4,2 m voor de achtergevel (3D BAG en AHN), met helling 1,30 tot 1,33. Dakoverstek van 0,3 m met boeiboord (+4,7) op een kraag van 49 graden langs de zijgevels en de sluiting; de voorgevel heeft geen overstek.
- **Voorgevel**: rechte topgevel met een gevelrand 0,25 m boven de dakvlakken, een ruitvormige nis voor de wijzerplaat (+9,3 m) en het witte ingangsportaal: 2,6 m breed en 0,3 m voor de gevel, kroonlijst op +4,15 m, fronton tot +5,05 m, deur als nis met spitse top.
- **Vensters**: drie rondboogvensters per zijgevel en een breder venster in elk schuin vlak van de sluiting; het achtervlak van de sluiting is blind (foto's).
- **Dakruiter**: kast van 2,1 m op de nok direct achter de voorgevel, kroonlijst (+11,65 m, 2,6 m breed), klokkenverdieping van 1,8 m met een rondboog per zijde tot +13,2 m, kroonlijst (+13,65 m, 2,3 m breed) en een achtkante naaldspits tot +18,2 m.

## Geschat

- De maten van de dakruiter (kast, kroonlijsten, klokkenverdieping, spitsvoet 1,5 m) zijn uit de foto's geschat, geschaald op de nokhoogte; de spitstop van +18,2 m ligt boven het hoogste AHN-punt (+17,3 m op de spits, een punt tussen de rasterpunten) en komt uit de verhouding op de foto's. Positie (hart 1,1 m achter de voorgevel) uit het 3D BAG-blok en het AHN.
- Plaats en maten van vensters, portaal, fronton, wijzerplaat, lisenen en plint zijn uit de foto's geschat (vensters 1,3 m breed, in de sluiting 1,7 m, borstwering 1,2 m).
- Het nokpunt van de sluiting (4,2 m voor de achtergevel) is een middenwaarde tussen 3D BAG (u = 5,4 tot 6,1) en AHN (de nok zakt vanaf u = 6,3).

## Weggelaten of vereenvoudigd

- Vensters, deur en klokgaten zijn blinde nissen met een spitse top van 58 graden in plaats van rondbogen, voor print zonder steun; het maaswerk van de vensters, de open klokkenverdieping (dicht met nissen) en de pilasters van het portaal (één dicht blok) zijn vereenvoudigd.
- De bol, het kruis en de windhaan op de spits, de piron op het nokpunt van de sluiting, de kleine schoorsteen en het dakraampje op het noordwestelijke dakvlak, regenpijpen, muurankers en het jaartal zijn kleiner dan 0,9 m.
- Het hekwerk rond de kerk hoort niet bij het pand.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 100 × 100 m bevat het model, zonder het PDOK-pand en zonder ondersteuningsobject. Renders van vier kanten zijn vergeleken met de PDOK-reconstructie (een blok met een schilddak zonder dakruiter) en de foto's.

## Bronnen

- [Wikipedia: Hervormde kerk (Eext)](https://nl.wikipedia.org/wiki/Hervormde_kerk_(Eext))
- [Rijksmonumentenregister 398783](https://monumentenregister.cultureelerfgoed.nl/monumenten/398783)
- [Wikidata Q17448942](https://www.wikidata.org/wiki/Q17448942)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Hervormde_Kerk_(Eext)) (Eext, kerk foto1 2009-04-25; RCE 20067878, 20067879, 20322722)
- BAG pand 1680100000001054 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1680100000001054) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
