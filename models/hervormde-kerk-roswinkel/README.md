# Hervormde Kerk (Roswinkel)

Eenbeukige bakstenen zaalkerk aan de Stad in Roswinkel (gemeente Emmen). Het schip is van 1759 (een voorganger stond er waarschijnlijk al in de veertiende eeuw), de westtoren van 1853; daarvoor hing de klok in een houten klokkenstoel naast de kerk. In de toren hangt een klok uit 1362 en aan de zuidzijde van de toren zit een verticale zonnewijzer. Rijksmonument 14963. Het schip heeft een driezijdige sluiting onder een zadeldak met pannen dat over de sluiting als wolfdak doorloopt; de toren draagt een witte houten achtkante lantaarn met rondbogen en een achtkante leien naaldspits. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 0114100000223876 (kerk en toren zijn één pand). Het dichtstbijzijnde buurpand ligt ruim 30 m verder en blijft staan.
- STL op 1:1000: circa 22,5 × 9,4 × 22,2 mm.
- Genereren: `node scripts/generate-hervormde-kerk-roswinkel.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (266617,77; 540399,98), lat/lon 52,839281 / 7,043786, midden tussen de zijgevels en halverwege de rechte zijgevels van het schip, op het laagste maaiveld rond de voet (oostkant, NAP +13,45 m). +X loopt langs de nok van de toren (west) naar de sluiting (oost), onder 16,0 graden in RD (`xAxis` [0,96126; 0,27564]); +Y wijst naar het noordnoordwesten. De zijgevels van de BAG-contour staan op 16,0 en -164,0 graden en de nok ligt er in de 3D BAG en het AHN evenwijdig aan. De BAG-contour ligt circa 0,25 m ten noorden van het AHN (nok in AHN en 3D BAG op y = -0,25 tot -0,3); het model volgt de BAG. `groundHeight` 55,17 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` (zuidoostkant bij de sluiting); het maaiveld loopt van west naar oost circa 0,45 m af, zodat de voet aan de westkant in het terrein zakt. `groundOffsetMetres` −0,1, onderkant 0,4 m onder het laagste maaiveld.

## Onderdelen

- **Schip**: 8,30 m breed, rechte zijgevels 16,42 m, driezijdige sluiting met een oostvlak van 3,66 m en schuine vlakken van 3,3 m, uit de BAG-contour, symmetrisch gemaakt. Plint van 0,15 m met een schuine bovenkant.
- **Dak**: zadeldak met nok +10,1 m (3D BAG NAP +23,60, AHN +23,4 tot +23,55), helling 1,165 (49 graden; 3D BAG 1,15 en 1,18), goot +5,27 op de muurlijn. Over de sluiting drie dakvlakken naar één nokpunt boven de aanzet van de sluiting: oostvlak 64 graden, schuine vlakken 59 graden (3D BAG 63 en 57). Dakoverstek van 0,35 m met bakgoot (+4,7) op een kraag van 49 graden; aan de westgevel een windveer van 0,15 m.
- **Lisenen**: vijf traveeën van 3,28 m; lisenen van 0,6 m breed, onderin 0,45 m en boven een versnijding op +1,2 tot +1,45 m nog 0,25 m voor de muur, tot onder de kraag; ook op de vier hoeken van de sluiting.
- **Vensters**: per zijgevel een klein venster in de westelijke travee (0,8 m) en vier hoge rondboogvensters (1,3 m, van +1,4 tot +4,2 m); in elk schuin vlak van de sluiting een breder venster (1,5 m). Het oostvlak is dicht.
- **Toren**: 3,02 × 3,2 m voor de westgevel (BAG), onderbouw 0,1 m breder tot een band op +5,4 m, schacht tot +10,55 m, kroonlijst 0,25 m uit tot +11,05 m (AHN NAP +24,5) met een lage kap. Deur met bovenlicht in de westgevel, in west-, zuid- en noordgevel een rondboogvormig galmgat (+6,0 tot +8,0) en een oculus (+9,1, als ruitvormige nis).
- **Lantaarn en spits**: achtkante voet van 2,3 m tot +11,5, achtkant van 2,1 m met een rondboog per zijde tot +13,9, kroonlijst van 2,5 m tot +14,45 (AHN +14,25 tot +14,95), uitgezwenkte voet en achtkante naaldspits tot +21,8 m.

## Geschat

- De maten van toren, lantaarn en spits boven de kroonlijst zijn uit de foto's geschat en geschaald op het AHN (kroonlijst +11,05, lantaarn +14,3 tot +14,95). De spitstop van +21,8 m ligt boven het hoogste AHN-punt (+21,25 m, een punt naast de top) en komt uit de verhouding op de foto's.
- Plaats en maten van vensters, galmgaten, oculi, deur, band, lisenen en plint zijn uit de foto's geschat. Dat de noordgevel dezelfde vensterindeling heeft als de zuidgevel en het oostvlak van de sluiting dicht is, is aangenomen (de noordoostfoto toont alleen het schuine vlak en de oostelijke travee).
- Het nokpunt van de sluiting (u = 8,2, boven de aanzet) is een middenwaarde tussen 3D BAG (8,3 tot 8,5) en AHN.

## Weggelaten of vereenvoudigd

- Vensters, deur, galmgaten en lantaarnbogen zijn blinde nissen met een spitse top van 58 graden in plaats van rondbogen, voor print zonder steun; de open lantaarn met zuiltjes is dicht met nissen, de ronde oculi zijn ruitvormige nissen. Het maaswerk van de vensters, de galmborden en de ontlastingsbogen boven de vensters zijn niet gemodelleerd.
- De zonnewijzer, het windvaantje en kruis op de spits, regenpijpen, muurankers en het huisnummerbord zijn kleiner dan 0,9 m of vlak in de gevel.
- Het hekwerk en de bomen rond de kerk horen niet bij het pand.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder het PDOK-pand en zonder ondersteuningsobject. Renders van vier kanten zijn vergeleken met de PDOK-reconstructie (een blok met wolfdak en een vlakke torenkolom tot circa +13 m zonder lantaarn en spits) en de foto's.

## Bronnen

- [Wikipedia: Kerk van Roswinkel](https://nl.wikipedia.org/wiki/Kerk_van_Roswinkel)
- [Rijksmonumentenregister 14963](https://monumentenregister.cultureelerfgoed.nl/monumenten/14963)
- [OpenStreetMap way 273532334](https://www.openstreetmap.org/way/273532334)
- Foto's Wikimedia Commons: Kerk Roswinkel.jpg; Exterieur - Roswinkel - 20191005 - RCE.jpg; Exterieur overzicht noordoostgevel - Roswinkel - 20323208 - RCE.jpg
- BAG pand 0114100000223876 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0114100000223876) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
