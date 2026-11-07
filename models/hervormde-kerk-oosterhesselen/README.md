# Hervormde Kerk (Oosterhesselen)

Gotische kerk met vrijstaande toren aan de Geserweg 2 in Oosterhesselen (gemeente Coevorden). De kerk ontstond rond 1400 als dochterkerk van Zweeloo; de twee oostelijke traveeën en de driezijdige sluiting zijn het 15e-eeuwse koor, dat oorspronkelijk hoger was dan het schip. Na schade bij het beleg van Coevorden (1592) kreeg de kerk in 1628 een nieuwe westmuur en werd het schip tot de hoogte van het koor opgetrokken; in 1862 werd ze gepleisterd. De toren uit de late 15e eeuw hoorde eerst aan de kerk vast en staat nu los; hij behoort tot de Drentse torenfamilie met spitsboognissen en een tentdak. Rijksmonumenten 31632 (kerk) en 31633 (toren). Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: twee nodes, `building:kerk` en `building:toren`, in meters; vervangt BAG-panden 0109100000007011 (kerk) en 0109100000011992 (toren). Andere panden liggen meer dan 20 m verderop.
- STL op 1:1000: circa 35,5 × 12,6 × 22,5 mm; kerk en toren zijn losse stukken, daarom ook een STL met grondplaat.
- Genereren: `node scripts/generate-hervormde-kerk-oosterhesselen.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (244712,496; 530904,385), lat/lon 52,758039 / 6,716180, midden tussen de zijgevels van de kerk en 10,28 m achter de westgevel, op het laagste maaiveld (NAP +16,75 m, bij de toren; rond de kerk ligt het maaiveld op NAP +17,1). +X loopt langs de nok van de westgevel naar het koor, onder 2,5 graden in RD (`xAxis` [0,99905; 0,04362]); +Y wijst naar het noorden. De zijgevels van de BAG-contour staan op 2,5 graden en de nok ligt er in de 3D BAG en het AHN evenwijdig aan. De toren staat met zijn hart op (-21,155; 0,075) en is 1,16 graden verder gedraaid (BAG 3,66 graden). `groundHeight` 58,53 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` (ten westen van de toren); rond de toren ligt het PDOK-terrein 0,2 tot 0,4 m hoger, rond de kerk 0,35 tot 0,65 m en op het pad voor de westgevel 0,9 m. Plint, deur en nissen zijn daarop gelegd. `groundOffsetMetres` −0,1, onderkant 0,4 m onder het laagste maaiveld.

## Onderdelen

- **Kerk**: zaal van 10,35 m breed uit de BAG-contour (zonder steunberen), westgevel tot de aanzet van de sluiting 17,4 m, sluiting met twee schuine zijden van 45 graden en een oostzijde van 4,3 m. Grijze plint tot +1,0 m met een schuine bovenkant.
- **Dak**: zadeldak van 45 graden met de nok op +13,93 m (NAP +30,68; 3D BAG 30,68, AHN 30,6 tot 30,7) en de goot op +8,76 m op de muurlijn. Boven de westgevel een wolfseind vanaf +12,05 m (NAP +28,8) met helling 1,15 (3D BAG). De drie dakvlakken van de sluiting lopen naar één nokpunt op 3,5 m voor de oostzijde (3D BAG), met helling 1,47 (oost) en 1,29 (schuin), gelijk aan de 3D BAG. Dakoverstek van 0,3 m met boeiboord op een kraag van 49 graden langs de zijgevels en de sluiting.
- **Westgevel**: topgevel met een gevelrand 0,3 m boven de dakvlakken, een vlakke top onder het wolfseind en gebogen schouders boven de hoeken; deur in een spitsboognis, een spitsboogvenster erboven en een klein venster in de top.
- **Steunberen**: twee per zijgevel tussen de traveeën (BAG), schuin op de hoeken van de westgevel, bij de aanzet van de sluiting en op de hoeken van de oostzijde; 0,9 m breed en 1,05 m diep, met een versnijding op +3,3 m en een schuine afdekking tot +7,0 m.
- **Vensters**: één spitsboogvenster per travee in beide zijgevels (drie per kant) en één in elk schuin vlak van de sluiting; het middenvenster van de sluiting is dichtgezet en staat er als ondiepe nis.
- **Toren**: 5,9 m in het vierkant (BAG 5,85 × 5,9), drie geledingen met een schuine versnijding op +5,8 en +12,3 m, plint, deur en venster in de westzijde, een hoge spitsboognis op elke zijde van de middelste geleding, galmgaten in spitsboognissen in de bovenste, kraag van 49 graden onder een overstek van 0,3 m en een tentdak met helling 2,18 van de goot (+15,55 m, AHN NAP +32,3) tot de top op +22,15 m (NAP +38,9; 3D BAG 39,0, AHN 38,7 tot 39,3).

## Geschat

- De hoogtes van de versnijdingen van de toren, de nissen, galmgaten, deur en venster zijn geschat uit de foto (RM 31633 Kerktoren Oosterhesselen), geschaald op de goothoogte uit het AHN.
- Plaats en maten van de kerkvensters (1,5 m breed, borstwering +2,4 m, aanzet +6,0 m), de vensters en deur in de westgevel, de schouders van de topgevel en de hoogte van de steunberen (+7,0 m, versnijding +3,3 m) komen uit de foto's.
- De nok is in het model horizontaal en recht; het AHN geeft 0,1 m verloop langs de nok.

## Weggelaten of vereenvoudigd

- Vensters, deuren en galmgaten zijn blinde nissen met een spitse top van 58 graden, voor print zonder steun; maaswerk en galmborden zijn weggelaten, de westelijke deurnis en het venster erboven zijn als twee aparte nissen gemaakt.
- Het kruis op de westgevel, de windwijzer met kruis op de torenspits, de kleine schoorsteen op de nok, regenpijpen en lantaarns zijn kleiner dan 0,9 m.
- Het hekwerk en de toegangspoort met de gemetselde pijlers horen niet bij de panden.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; kerk en toren zijn elk één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede waar kerk en toren in vallen bevat het model zonder de PDOK-panden. Renders van vier kanten zijn vergeleken met de PDOK-reconstructie (een blok met zadeldak en afgeschuinde koorhoeken, en een gladde torenschacht met puntdak, beide zonder nissen, plint of overstek) en de foto's.

## Bronnen

- [Wikipedia: Kerk van Oosterhesselen](https://nl.wikipedia.org/wiki/Kerk_van_Oosterhesselen)
- [Rijksmonumentenregister 31632](https://monumentenregister.cultureelerfgoed.nl/monumenten/31632) en [31633](https://monumentenregister.cultureelerfgoed.nl/monumenten/31633)
- [Wikidata Q17438578](https://www.wikidata.org/wiki/Q17438578), [OpenStreetMap way 279331888](https://www.openstreetmap.org/way/279331888)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Hervormde_Kerk,_Oosterhesselen) (Protestantse Kerk 2016 001, 003, 005, 007, 009; RM 31633 Kerktoren Oosterhesselen; kerk en toren foto6 2011-04-02; RCE 20135988, 20135989, 20322210)
- BAG panden 0109100000007011 en 0109100000011992 en de [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0109100000007011) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
