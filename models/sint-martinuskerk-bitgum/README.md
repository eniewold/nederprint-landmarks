# Sint-Martinuskerk (Bitgum)

Hervormde kerk aan de Buorren in Bitgum (Beetgum, gemeente Waadhoeke), vroeger gewijd aan Sint-Martinus. De kerk staat op een terprest met een verhoogd kerkhof. Het schip werd in 1669-1672 gebouwd op de fundamenten van de middeleeuwse kerk, die in 1669 was afgebroken, op initiatief van de familie Thoe Schwartzenberg en Hohenlansberg (gedenksteen en twee poortjes uit 1669 in de zuidgevel). De zestiende-eeuwse toren met zijn rijen blinde nissen bleef staan; in 1862 kreeg hij in plaats van het zadeldak de huidige ingesnoerde spits. Restauratie 1972-1980; sinds 2013 eigendom van de Stifting Tsjerken Bitgum en Ingelum. Rijksmonument 28571. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 0083100000001948 (schip, koor en consistorie) en 0083100000001963 (toren). Geen ander pand raakt de kerk; het losse pand 0083100000001933 ten westen blijft staan.
- STL op 1:1000: circa 36,3 × 13,7 × 33,9 mm.
- Genereren: `node scripts/generate-sint-martinuskerk-bitgum.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (175024,0; 583459,95), lat/lon 53,237351 / 5,687110, op de as van het schip, halverwege tussen de westgevel en het begin van het koor, op maaiveld (NAP +5,9 m). +X loopt langs de nok van de toren naar het koor, onder 2,24 graden in RD (`xAxis` [0,99924; 0,03909]); +Y wijst naar de noordgevel. De lange gevels lopen in de BAG-contour op 0,01 graad na evenwijdig onder die hoek en de nok ligt in het AHN-DSM op de as (v = 0 ± 0,1 m over de hele lengte). `groundHeight` 47,36 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de kerk (het pad west van de toren); de terp loopt naar het zuiden en noorden op tot 0,7 m hoger, daar staat de voet in het terrein. `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Schip met koor** (BAG 25,4 × 8,78 m plus een vijfzijdige sluiting tot 4,2 m achter het schip; de sluiting is symmetrisch gemaakt): steil leien dak met de nok op +13,3 m (AHN 13,25 tot 13,35) en een helling van 1,52 (56,7 graden; mediaanprofiel van het AHN-DSM, zuid 1,51 en noord 1,52). Onderaan een flauwere opschieter (helling 0,42) tot de goot op +7,3 m, 0,46 m buiten de gevel (AHN 7,37). Elk vlak van de koorsluiting heeft dezelfde twee hellingen, zodat het koordak als een halve piramide op de nok aansluit (AHN langs de as 1,45 tot 1,52 per meter). De westgevel is een topgevel achter de toren.
- **Gootlijst** rondom (niet langs de westgevel) met een schuine onderkant van 55 graden onder de dakvoet, en een **plint** van 0,08 m tot +0,6 m.
- **Steunberen**: 0,9 m breed en 0,75 m diep, met een schuine bovenkant van +3,5 m aan de voorkant tot +6,2 m tegen de gevel; vier in de zuidgevel (waarvan één bij het koor) en drie in de noordgevel.
- **Vensters en poortjes**: zes rondboogvensters in de zuidgevel en één aan de westkant van de noordgevel (1,4 m breed, van +3,3 tot +6,4 m), en de twee poortjes van 1669 in de zuidgevel: omlijsting van 2,0 m breed met pilasters en fronton tot +4,35 m, 0,25 m uit de gevel, met de deur als nis. De koorsluiting is blind, zoals op de foto's.
- **Toren** (BAG 6,58 × 6,54 m): plint tot +1,16 m, westdeur in een spitsboognis met een venstertje erboven, versnijding op +8,6 m (0,14 m terug), twee rijen van vier hoge blinde nissen per zijde (+10,2 tot +13,5 m en +14,0 tot +16,45 m; de onderste rij niet aan de oostkant, achter het dak van het schip), een band op +17,0 m, de klokkenverdieping met vijf bogen per zijde waarvan de middelste drie als diepere galmgaten, en de kroonlijst tot +19,8 m (0,35 m overstek, onderkant 58 graden).
- **Spits**: ingesnoerde leien spits van 1862 met een vierkante voet op de kroonlijst, ingezwenkt tot een achtkant van 3,3 m breed op +21,6 m en een naald tot +33,5 m.
- **Consistorie** ten noorden van de toren (BAG 7,85 × 5,04 m tegen de toren en de noordgevel van het schip): zadeldak met de nok langs het schip op +7,0 m en een helling van 1,25 (AHN noordzijde), goot +3,85 m met 0,3 m overstek aan de noordkant, schoorsteen tegen de oostgevel tot +8,5 m (AHN 8,2 tot 8,6), twee vensters in de westgevel en een deur in de oostgevel.
- **Afdak** tegen de noordgevel tussen de twee steunberen (6,8 × 2,3 m, lessenaarsdak van +3,5 naar +3,05 m; AHN 3,1 tot 3,5).

## Geschat

- De torendetails (plint, deur, versnijding op +8,6 m, de rijen blinde nissen, de band en de klokkenverdieping) zijn gemeten op de foto's RCE 20029903 (toren) en 20029912 (westgevel) met een schaal uit de torenbreedte en de kroonlijsthoogte uit het AHN (19,6 tot 20,0 m langs de randen).
- Het profiel van de spits (vierkante voet, achtkant van 3,3 m op +21,6 m, top op +33,5 m) komt uit de zuidfoto (Beetgum, kerk foto2 2010-04-17) met de goot van het schip en de kroonlijst van de toren als schaal, en het AHN (21,0 tot 21,5 m op 1 m binnen de rand, piek 33,8 m naast de windvaan op 39,5 m).
- Plaats en maat van vensters, poortjes en steunberen zijn geschat uit de zuidfoto en de foto's RCE 20029907, 20029908, 20029909 en 20029910; de steunberen aan de noordkant volgen RCE 20029910.
- De consistorie (nok, goot, vensters, deur, schoorsteen) uit het AHN en RCE 20029910 en 20029912; de nok ligt op het midden van de BAG-contour (het AHN legt hem 0,4 m noordelijker, net als de torenranden).

## Weggelaten of vereenvoudigd

- Vensters, deuren en galmgaten zijn blinde nissen met een spitse top (58 graden) in plaats van een ronde boog; de rechte vensters en de deur van de consistorie hebben een steile latei (50 graden). Roedeverdeling, galmborden en het houten beschot in de topgevel van de consistorie zijn weggelaten.
- Het afdak tegen de noordgevel is een dicht blok; in het echt is het een open afdak op palen.
- De bol, het kruis en de windhaan op de spits en de makelaar op het koordak, de wijzerplaat (1896), de gedenksteen, de muurankers, de regenpijpen en de trap voor de westdeur (kleiner dan 0,9 m of zonder reliëf).
- De terp en de keermuur van het kerkhof horen bij het PDOK-terrein.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder de PDOK-panden en zonder opvulling. Renders van vier kanten zijn vergeleken met de PDOK-reconstructie (die de toren als blok tot circa 25 m en zonder spits toont) en de foto's.

## Bronnen

- [Wikipedia: Sint-Martinuskerk (Beetgum)](https://nl.wikipedia.org/wiki/Sint-Martinuskerk_(Beetgum)) en [Sint-Martinustsjerke (Bitgum)](https://fy.wikipedia.org/wiki/Sint-Martinustsjerke_(Bitgum))
- [Rijksmonumentenregister 28571](https://monumentenregister.cultureelerfgoed.nl/monumenten/28571)
- [Wikidata Q1856364](https://www.wikidata.org/wiki/Q1856364)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Martinuskerk,_Bitgum) (2023 Bitgum, Sint-Martinustsjerke; Beetgum, kerk foto2 2010-04-17; RCE 20029903, 20029905, 20029907, 20029908, 20029909, 20029910, 20029912, 20029916, 20377598)
- BAG pand 0083100000001948 en 0083100000001963
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
