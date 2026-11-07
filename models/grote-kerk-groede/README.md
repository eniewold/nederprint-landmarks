# Grote Kerk (Groede)

Protestantse kerk aan de Markt in Groede (gemeente Sluis), rijksmonument 31516: een driebeukige hallenkerk met een driezijdig gesloten koor, een noordkoor en een westtoren met haakse steunberen, achtkante bovenbouw en naaldspits. De oudste delen gaan terug tot de 13e eeuw, de toren tot de 14e eeuw; schip en noordbeuk zijn 15e-eeuws, de rechtgesloten zuidbeuk is van circa 1500. Na de overstromingen van 1583-1613 werd het koor in 1619 hersteld en volgde herstel in 1632-1634; in 1868 werd de kerk gepleisterd, in 1950 (toren, na een blikseminslag) en 1970 (kerk) weer ontpleisterd, en in 2010 gerestaureerd. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 1714100000729751 (kerk en toren zijn één pand).
- STL op 1:1000: circa 38,4 × 25,0 × 44,8 mm.
- Genereren: `node scripts/generate-grote-kerk-groede.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (24118,00; 378374,50), lat/lon 51,379365 / 3,507127, midden in de kerk op maaiveld (NAP +2,7 m). +X loopt langs de drie nokken van de toren naar het koor, onder -2,5 graden in RD (`xAxis` [0,99905; -0,04362]); +Y wijst naar de noordbeuk. Gevels en steunberen lopen in de BAG-contour evenwijdig aan die as, de nokken liggen er in het AHN-DSM en de 3D BAG op. `groundHeight` 46,88 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de kerk (zuidzijde); `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Drie beuken onder drie evenwijdige zadeldaken**, alle dakvlakken helling 1,5 (56 graden) volgens AHN en 3D BAG: noordbeuk 8,75 m breed met nok +14,4 m, middenschip 8,05 m met nok +14,4 m, zuidbeuk 6,8 m met nok +13,5 m; goten +7,6 (noord) tot +8,4 m (zuid). Noord- en zuidbeuk hebben een topgevel in het westen en een schild boven de rechte oostgevel (3D BAG: nokeinden u = 9,1 en 10,3).
- **Koor**: iets breder dan het schip (8,75 m), driezijdige sluiting tot u = 19,1 m (BAG) met dakvlakken naar het nokeinde op u = 15,7 m (3D BAG), diagonale steunberen op de vier hoeken en een hoog spitsboogvenster in elke zijde.
- **Steunberen** op de BAG-uitsprongen: vier langs de noordgevel, vier langs de zuidgevel, op de hoeken en midden in de oostgevel van de noordbeuk, met een schuine afdekking onder de goot. Plint van 1,9 m rondom.
- **Vensters en deuren** (blinde nissen): drie spitsboogvensters en een breder vierde in de noordgevel met de spitsboogdeur bij het noordkoor; in de zuidgevel een deur, twee hoge vensters en twee vensters boven elkaar in de oostelijke travee; twee grote vensters in de westgevel van de noordbeuk en één in die van de zuidbeuk, met een luikje in beide topgevels; twee vensters in de oostgevel van de noordbeuk; schuifvensters en deur in de oostgevel van de zuidbeuk.
- **Toren**: vierkante onderbouw 7,0 × 7,4 m (BAG) tot +14,9 m met op de twee vrije westhoeken haakse steunberen (naar het westen en naar noord/zuid, BAG) in twee versnijdingen; spitsboogdeur en venster in het westen, blinde spitsboog met twee lancetten op noord en zuid. Schuine overgang naar de achtkante bovenbouw (6,6 m) met acht galmgaten, kraag van 48 graden onder de omgang (8,2 m) op +23,5 m met dichte borstwering tot +24,5 m, leien spits met licht uitlopende voet tot de lantaarn (2,4 m, +33,0 tot +36,3 m, met kroonlijst) en de naald tot +44,4 m (hoogste AHN-punt, NAP +47,1 m).

## Geschat

- De hoogtes van de toren (overgang naar de achtkant +14,9/+16,0, kraag +22,4, omgang +23,5, lantaarn +33,0 tot +36,3) en de breedtes van achtkant, omgang, spitsvoet en lantaarn zijn uit de verhoudingen op de RCE-foto's van west- en zuidzijde geschat, geschaald op de nokken en de AHN-top. Het AHN-DSM rond de toren is uitgesmeerd (een plateau van 11 × 11 m op +26 tot +38 m) en alleen voor de top gebruikt; de 3D BAG heeft de toren als plat blok.
- Vensterbreedtes en -hoogtes, de steunbeerhoogtes (+5,6 tot +7,4) en de deuren zijn uit foto's geschat. De oostgevel van de toren ligt binnen de kerk en is aangenomen op u = -10,1 m.

## Weggelaten of vereenvoudigd

- De open balustrade van de omgang is een dichte borstwering van 0,9 m; de open lantaarn is dicht met nissen; rondbogen en traceringen zijn spitse blinde nissen (58 graden) voor print zonder steun.
- Windhaan en kruis op de naald, de makelaars op de schilden, de wijzerplaten, de boogfries onder de kraag, regenpijpen en de dakgoten (kleiner dan 0,9 m).
- De schoorstenen op de westgevel en oostgevel van de zuidbeuk staan op oude RCE-foto's maar niet op de recente foto's en zijn weggelaten.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder het PDOK-pand en zonder ondersteuningsobject. Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Grote Kerk (Groede)](https://nl.wikipedia.org/wiki/Grote_Kerk_(Groede))
- [Rijksmonumentenregister 31516](https://monumentenregister.cultureelerfgoed.nl/monumenten/31516)
- [Reliwiki: Groede, Markt 1 - Grote Kerk](https://www.reliwiki.nl/index.php/Groede,_Markt_1_-_Grote_Kerk)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Grote_Kerk_(Groede)) (RCE 20400999, 20352870, 20400997, 20400989, 20398145, 20398186, 20398188; "Grote Kerk (Groede) (4)")
- BAG pand 1714100000729751 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1714100000729751) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
