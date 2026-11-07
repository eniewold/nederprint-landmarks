# Grote Kerk (Gorinchem)

Protestantse kerk aan de Groenmarkt met de laatgotische Grote of Sint-Janstoren. De toren werd rond 1450 gebouwd aan de westzijde van een gotische hallenkerk; de spits was in 1517 klaar. Door verzakking tijdens de bouw staat hij ruim anderhalve meter uit het lood. De middeleeuwse kerk werd in 1844 gesloten en gesloopt; Isaäc Warnsinck ontwierp de huidige driebeukige kerk in rondboogstijl (1849–1851, uitgevoerd door A.N. Godefroy), tegen de toren aan. Kerk (rijksmonument 381885) en toren (rijksmonument 16634) vormen samen één BAG-pand. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters. Het model vervangt BAG-pand 0512100000038532: kerk, tussenlid en toren. Geen buurpand raakt de kerk.
- STL op 1:1000: circa 70,2 × 31,1 × 59,7 mm.
- Genereren: `node scripts/generate-grote-kerk-gorinchem.mjs --components`.

## Oorsprong en oriëntatie

De oorsprong ligt op RD (126460,88; 426854,41), lat/lon 51,829561 / 4,973188, midden in het kerkgebouw (het midden van de BAG-rechthoek van de kerk). +X loopt langs de nok van de toren naar het oostportaal, onder 1,0 graad in RD (`xAxis` [0,999848; 0,017452]); +Y wijst naar de noordzijde. De lange gevels in de BAG-contour lopen evenwijdig aan die as.

z = 0 ligt op het laagste maaiveld rond de voet, aan de westkant van de toren (Krijtstraat, NAP +1,88 m). Naar het oosten en noorden loopt het maaiveld tot NAP +2,5 m op. `groundHeight` 45,46 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond kerk en toren. `groundOffsetMetres` is −0,1; de onderkant ligt 0,4 m onder z = 0.

## Onderdelen

- **Middenschip met lichtbeuk**: 16 m breed (lichtbeukmuren op v = ±8,0 volgens het AHN). Het zadeldak loopt van toren tot oostgevel met de nok op +24,92 m en de goot op +21,8 m, een helling van 21 graden. De kroonlijst staat op een kraag van 45 graden (voor het rondboogfries). Elke travee heeft een lichtbeukvenster, met lisenen ertussen die op het lessenaarsdak staan.
- **Zijbeuken**: 7,2 m breed (BAG-gevels op v = ±15,17) onder lessenaarsdaken. Die lopen van +11,55 m aan de buitenmuur naar circa +14,4 m tegen de lichtbeuk (AHN). De kroonlijst staat op een kraag en steekt 0,2 m boven het dak uit. Er zijn zeven traveeën met lisenen en grote rondboogvensters. In de middelste travee zitten aan beide kanten een oculus en de zij-ingang. De natuurstenen plint loopt tot +3,0 m.
- **Oost- en westgevel**: een topgevel met verhoogde rand en topstuk boven het middenschip, en halve topgevels langs de lessenaarsdaken. Er zijn hoeklisenen tot +12,3 m, lisenen op de hoeken van het middenschip tot +23,0 m, en een kroonlijst over de hele gevel. In de oostgevel zitten een roosvenster (een ronde, afgeschuinde verhoging met een middenschijf) en vensters in de zijbeukgevels.
- **Oostportaal**: 3,0 m diep en 7,0 m breed (BAG), met een fronton waarvan de nok op +10,9 m langs de as loopt (AHN), een verhoogde frontonrand en hoeklisenen. Er zijn een deur, een oculus en zijdeuren.
- **Tussenlid (consistorie)**: dit deel heeft twee bouwlagen tussen toren en kerk. De nok ligt op +23,8 m langs de as en de goot op +22,3 m (AHN). Het heeft een kroonlijst, twee hoge vensters boven en vier smalle vensters onder per zijde.
- **Toren**: de romp is 11,2 × 11,7 m (BAG). Elke hoek heeft twee steunberen van 1,55 m breed, behalve de noordoosthoek, waar het traptorentje staat. Die steunberen springen per geleding terug (1,7, 1,1 en 0,55 m diep) met schuine bovenkanten. Er zijn drie geledingen met elk twee spitsboognissen per gevel; de galmgaten in de bovenste geleding zijn dieper. De plint loopt tot +6,5 m, de waterlijst ligt op +19,5 m en de omgang op +31,5 m. Wijzerplaten zitten midden boven de galmgaten, en in de westgevel zit een deur. Daarboven komen de borstwering (+45,1 tot +46,3 m), drie hoekpinakels tot +48,7 m en een achtkante leien spits met een geknikte voet tot +59,3 m (het hoogste AHN-punt). Het achtkante traptorentje (2,8 m) steekt een verdieping boven de borstwering uit, met een kraag en een spitsje tot +51,0 m (AHN +50,1 m op 0,5 m).
- **Scheefstand**: in het AHN-DSM ligt het midden van de bovenste geleding op (−38,1; −1,85) en dat van de voet op (−37,5; −0,5). Het model geeft dat weer als een lineaire afschuiving van de hele toren: 0,0126 m per m naar het westen en 0,0295 m per m naar het zuiden (op de borstwering 0,57 en 1,33 m, in de spitstop 0,75 en 1,75 m). Daar komen de terugsprongen van de geledingen bij: 0,15 en 0,33 m op de oost- en westgevel, 0,6 en 1,25 m op de noord- en zuidgevel. Daarmee komt de bovenste geleding op de AHN-maat van circa 10,5 × 9,2 m.

## Geschat

- **Vensters**: breedtes, hoogtes en dorpels van de vensters, oculi, deuren, het roosvenster (straal 2,3 m) en de wijzerplaten (straal 1,0 m) zijn geschat uit de foto's van de RCE en Commons.
- **Toren**: de hoogtes van de torengeledingen (+6,5, +19,5 en +31,5 m) zijn geschat uit de verhoudingen op frontale foto's, geschaald op de borstwering in het AHN. Ook de diepte en terugsprongen van de steunberen zijn uit foto's geschat. De verdeling van de versmalling over terugsprong en scheefstand is een aanname; alleen het midden en de maat van de bovenste geleding zijn gemeten.
- **Traptorentje**: het torentje staat op de plek van de verhoging in het AHN en van de uitsprong in de BAG-contour aan de noordkant. Hoe hoog de schacht boven de borstwering uitsteekt (tot +47,6 m) en het spitsje zijn geschat uit foto's.
- **Westgevel**: deze gevel is achter de toren en het tussenlid nauwelijks gefotografeerd. Hij is gelijk aan de oostgevel gemaakt, zonder portaal, vensters en roosvenster.

## Weggelaten of vereenvoudigd

- **Vensters en friezen**: vensters, deuren en galmgaten zijn blinde nissen met een spitse top van 58 graden (in het echt rondboog en spitsboog met maaswerk), oculi zijn ruiten. Het roosvenster en de wijzerplaten zijn afgeschuinde verhogingen, zodat ze zonder steun printen. De rondboogfriezen onder de kroonlijsten zijn de schuine kraag. Gietijzeren waterlijsten en lantaarns aan het portaal zijn kleiner dan 0,9 m.
- **Toren**: het opengewerkte maaswerk van de omgang en de borstwering is dicht gemodelleerd als band en muur. De fijne pinakels en hogels op de steunberen (kleiner dan 0,9 m) zijn weggelaten. Het kruis met de windvaan op de spits valt binnen de top van +59,3 m.
- **Daken**: de zonnepanelen en de twee kleine ventilatiekappen op het dak van het middenschip zijn weggelaten.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan de catalogusvelden, hoekpunten en doorsneden, plus de 45-gradensteuncontrole: de export voegt niets toe. Op een raster van 1 m ligt 82 % van het dakoppervlak binnen 1 m van het AHN-DSM (mediaan 0,12 m); de afwijkingen liggen op de randen van toren en spits. Een export op 1:1000 met steun v2 van een uitsnede van 90 × 90 m bevat het model, zonder het PDOK-pand en zonder ondersteuningsobject (volume gelijk aan de export zonder steun). Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Grote Kerk (Gorinchem)](https://nl.wikipedia.org/wiki/Grote_Kerk_(Gorinchem))
- Rijksmonumentenregister: [381885 (kerk)](https://monumentenregister.cultureelerfgoed.nl/monumenten/381885) en [16634 (toren)](https://monumentenregister.cultureelerfgoed.nl/monumenten/16634)
- Foto's op Wikimedia Commons: [Grote Kerk, Gorinchem](https://commons.wikimedia.org/wiki/Category:Grote_Kerk,_Gorinchem) en [Grote Toren (Gorinchem)](https://commons.wikimedia.org/wiki/Category:Grote_Toren_(Gorinchem)) (RCE 20299979, 20268339, 20080445, 20276775, 20268336, 20415511, 20080406; P1170835, P1170836, P1170840, P1170848; rijksmonument 381885 en 16634 20120311; IMG 3578 2018)
- BAG-pand 0512100000038532 (voetafdruk)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
