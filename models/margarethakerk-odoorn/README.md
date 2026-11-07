# Margarethakerk (Odoorn)

Hervormde kerk aan de Valtherweg 1 in Odoorn, gewijd aan Sint-Margaretha. De twaalfde- of dertiende-eeuwse kerk werd in 1856 te klein en afgebroken; alleen het smalle, rechthoekige koor van omstreeks 1200 bleef staan. Dat koor is tot circa 3,75 m opgetrokken uit behakte granieten zwerfkeien met baksteen erboven en dient nu als consistorie. Het nieuwe schip, een zaalkerk van vijf traveeën met rondboogvensters en lisenen, en de gepleisterde geveltoren met achtkante lantaarn zijn van 1856-1857 (architect W. van Ernst). Na de brand van 25 november 1897 is de kerk op de oude muren herbouwd en op 28 augustus 1899 heropend. Rijksmonument 31221. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 1681100000002431 (schip, toren en koor zijn één pand). Geen buurpand raakt de kerk; het losse pand 1681100000030396 ten zuidoosten blijft staan.
- STL op 1:1000: circa 32,7 × 13,1 × 29,4 mm.
- Genereren: `node scripts/generate-margarethakerk-odoorn.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (253362,75; 541406,95), lat/lon 52,850898 / 6,847428, in het midden van het schip op maaiveld (NAP +24,9 m). +X loopt langs de nok van de toren naar het koor, onder 12,9 graden in RD (`xAxis` [0,97476; 0,22325]); +Y wijst naar de noordgevel. De lange gevels van schip en koor lopen in de BAG-contour op 2 cm na evenwijdig onder die hoek, en de nok ligt er in de 3D BAG en het AHN-DSM evenwijdig aan. `groundHeight` 66,31 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de kerk (het pad voor de oostdeur van het koor); aan de andere zijden ligt het maaiveld 0,2 tot 0,5 m hoger. `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Schip** (BAG 24,5 × 12,4 m): zadeldak met de nok op +13,65 m boven de as en een helling van 0,945 (43 graden) aan beide zijden (mediaanprofiel van het AHN-DSM, 3D BAG 0,92 tot 0,95), goten +7,78 m. Aan de oostkant een wolfeind: de oostgevel loopt door tot +10,8 m en daarboven ligt een steil schild (1,48, 3D BAG en AHN) boven de koorkap. De westgevel is een rechte topgevel waar de toren in staat.
- **Kroonlijst** rondom op goothoogte, 0,35 m uitstekend met een schuine onderkant (41 graden); het dak loopt erover door.
- **Lisenen**: de vier lisenen per lange gevel (0,55 m breed, 0,21 m diep) en de hoekpilasters uit de BAG-contour, tot in de kroonlijst.
- **Waterlijst** onder de vensters op +2,85 m, rondom.
- **Vensters en deuren**: per lange gevel vier hoge rondboogvensters (1,65 m breed, van +2,95 tot +6,7 m) en in de middentravee een deur met een korter venster erboven; de deuren hebben een witte omlijsting met kroonlijstje als portaal. In de westgevel twee hoge blinde rondboognissen naast de toren.
- **Toren** (BAG-risaliet 3,58 × 3,58 m, 0,62 m voor de westgevel): plint, banden op +5,5 en +9,1 m, westdeur met bovenlicht, twee vensters boven elkaar in de westgevel, oculi op +14,35 m, galmgaten (+15,4 tot +18,0 m) en ronde nissen onder de kroonlijst aan alle vier de zijden, kroonlijst met plat dak op +20,2 m.
- **Lantaarn**: achtkant van 2,3 m breed tot +22,0 m met acht rondboogopeningen (als nissen), kroonlijst van 3,0 m breed tot +22,9 m.
- **Spits**: achtkante leien spits met een ingezwenkte voet (2,0 m tot 1,5 m op +23,8 m) en een punt op +29,0 m.
- **Koor** (BAG 7,0 × 7,9 m): tentdak met de top op +10,3 m (AHN 10,2, 3D BAG 10,4) en goten op +6,6 m, een overstek van 0,3 m met een schuine onderkant, spitsboogvensters in de zuid- en noordwand, de hoge spitsboogdeur in de oostwand en daarboven de witte dakkapel met zadeldakje (nok +8,2 m) op het oostschild.

## Geschat

- De hoogtes van de torendetails (banden, deur, vensters, oculi, galmgaten, kroonlijst op +20,2 m), de lantaarn (+22,0 en +22,9 m) en het profiel en de top van de spits (+29,0 m) zijn gemeten op de westfoto RCE 20372063 met een schaal uit de breedte van de toren (BAG 3,58 m) en gecontroleerd tegen het AHN (plat torendak met leuning 20,3 tot 21,6 m, piek van de spits 28,8 m).
- Vensterbreedtes en -hoogtes, de deuren en portalen, de waterlijst en de kroonlijst zijn geschat uit de zuidfoto (Odoorn NH kerk 2008) en de noordfoto RCE 20372055; de noordgevel is gelijk aan de zuidgevel gemaakt.
- Het tentdak van het koor is een zuivere piramide boven het midden van de BAG-rechthoek. De plaats en maat van de dakkapel (1,5 m breed) komen uit de luchtfoto, het AHN en RCE 20372058; de vensters en de deur van het koor uit RCE 20372058 en 20372060.

## Weggelaten of vereenvoudigd

- Vensters, deuren, galmgaten en lantaarnopeningen zijn blinde nissen met een spitse top (58 graden) in plaats van een ronde boog; de oculi zijn ruitvormige nissen. Roedeverdeling, galmborden en het bovenlicht zijn weggelaten.
- De smeedijzeren leuning rond het torendak (open hekwerk), de bol, het kruis en de windhaan op de spits, de wijzerplaat, de muurankers, de consoles onder de kroonlijst, het pinakeltje op de top van het koordak, de regenpijpen en de dunne rookpijp aan de noordoosthoek van het schip (kleiner dan 0,9 m of zonder reliëf).
- De natuursteenstructuur van het koor en de horizontale voegen in het pleisterwerk van de toren.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder het PDOK-pand en zonder opvulling (zelfde volume als zonder steun). Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Margarethakerk (Odoorn)](https://nl.wikipedia.org/wiki/Margarethakerk_(Odoorn))
- [Reliwiki: Odoorn, Valtherweg 1 - Margarethakerk](https://reliwiki.nl/index.php/Odoorn,_Valtherweg_1_-_Margarethakerk)
- [Rijksmonumentenregister 31221](https://monumentenregister.cultureelerfgoed.nl/monumenten/31221)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Odoorn) (Odoorn NH kerk 2008; Odoorn 191; RCE 20372055, 20372058, 20372059, 20372060, 20372062, 20372063)
- BAG pand 1681100000002431 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1681100000002431) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
