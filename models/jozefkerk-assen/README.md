# Jozefkerk (Assen)

Neoclassicistische waterstaatskerk aan het Kerkplein (Kerkplein 1, rijksmonument 8411), ontworpen door C.J. Spaan, hoofdingenieur van de Waterstaat, gebouwd 1845-1848 en op 30 april 1848 ingewijd; tot 1964 heette ze de Grote Kerk. De toren brandde in 1910 na een blikseminslag grotendeels af en is in 1911 herbouwd. Restauraties in 1979-1982 en vanaf augustus 2021; in 2002 kwam het jaartal MDCCCXLVIII in het fronton. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 0106100000000497. Dat pand omvat behalve de kerk ook het bijgebouw (consistorie) tegen de noordgevel, een lage garage/tussenbouw en het voorhuis aan de Kerkstraat; die zijn daarom meegemodelleerd.
- STL op 1:1000: circa 35,7 × 37,4 × 32,0 mm.
- Genereren: `node scripts/generate-jozefkerk-assen.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (233744,467; 556808,563), lat/lon 52,992488 / 6,559971, in het midden van de zaal, op maaiveld (NAP +10,6 m). +X loopt langs de lange gevels van west naar oost onder -1,7 graden in RD (`xAxis` [0,99956; -0,02967]), gemeten aan de evenwijdige BAG-gevels en de nok van het schilddak; +Y wijst naar het noorden. De voorgevel met het portiek kijkt naar -Y (het Kerkplein). `groundHeight` 51,82 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` (voor het voorhuis aan de Kerkstraat); het terrein loopt van west (Collardslaan, 52,49) naar oost ongeveer 0,65 m af, zodat de sokkel aan de westkant iets in het terrein staat. `groundOffsetMetres` −0,1, onderkant 0,4 m onder maaiveld.

## Onderdelen

- **Zaal**: 32,7 × 19,3 m (BAG), schilddak met helling 0,47 (25 graden) aan alle vier zijden, goot +14,3, nok +18,8 van x −6,7 tot 6,7 (3D BAG LoD2.2, AHN-DSM 18,8-19,0). Grijze plint tot +0,9, gepleisterde sokkel tot +3,1 met afzaat, bakstenen pilasters van 0,86 m die 0,22 m uit de gevel staan (posities uit de BAG-contour, ook om de hoeken), architraaf +10,1..10,9, tweede band +12,1..12,5 en kroonlijst +13,7..14,45 met 0,8 m overstek, alle op een kraag van 47 graden.
- **Vensters**: hoge rondboogvensters (1,6 m breed, +3,6 tot +9,9) als blinde nissen: drie aan weerszijden van het risaliet, in de noordgevel drie in de westhelft en één in de oosthoek, op de oostgevel in de middelste drie traveeën en op de westgevel in de tweede en vierde travee (zoals op de RCE-foto's).
- **Middenrisaliet**: 14,0 m breed en 3,57 m voor de gevel (BAG), gepleisterd, hoek- en antenpilasters, hoofdgestel tot +11,9 met kroonlijst, fronton met helling 0,46 tot +15,26 (3D BAG) en schuine kroonlijsten, inspringend portiek van 6,5 m met twee zuilen (0,9 m) tussen de anten, drie deuren, fries erboven en een venster met frontonnetje. Trap van vijf treden. Op de zijwanden een rondboogvenster en een oculus.
- **Toren** (hout, 1911) achter het fronton, hart x 0, y −10,87 (AHN): onderbouw 4,4 m in het vierkant met een venster op elke zijde en kroonlijst tot +20,95, dichte balustrade tot +21,6, uurwerkverdieping van 3,1 m met een galmgat/uurwerk in een boog op elke zijde, kroonlijst en vier frontonnetjes tot +26,25, ronde lantaarn (Ø 2,1 m) met zes nissen tussen de zuiltjes, kroonlijst en koepel tot +30,0 (hoogste AHN-punt NAP +40,6), windvaan als naald tot +31,6.
- **Bijgebouw** tegen de noordgevel: twee bouwlagen, schilddak met goot +7,2 en nok +9,8 (helling 0,65, 3D BAG), witte lijst, vensters en deur in de westgevel naar de binnenplaats, vensters boven de garage en in de noordgevel.
- **Garage/tussenbouw**: plat tot +3,3 met een schuine oostgevel aan de Kerkstraat en drie deuren.
- **Voorhuis** aan de Kerkstraat: goot +9,3 met lijst, zadeldak (helling 0,8, nok +11,7) dat aan de straat afgewolfd is en naar achteren op +10,9 plat afloopt (3D BAG), twee assen hoge vensters in de straatgevel en vensters in de zijgevel.

## Geschat

- Hoogtes van sokkel, vensters, banden en kroonlijst zijn van de RCE-foto's (20412936, 20412939, 20412940) geschaald op de goothoogte uit de 3D BAG en het AHN.
- De toren: breedtes uit de frontale foto 20412940 en het AHN-DSM, hoogtes van onderbouw, kroonlijst, balustrade, uurwerkverdieping en frontonnetjes uit de foto's geschaald tussen de frontontop (+15,3) en de koepeltop (+30,0, AHN); de windvaan (+31,6) is geschat.
- Diepte van het portiek (1,2 m), de trap en de maten van deuren en vensters in risaliet, bijgebouw en voorhuis zijn uit foto's geschat. Waar de foto's niets laten zien, zijn de vensters in de noordgevel van het bijgebouw en de zijgevel van het voorhuis aangenomen.

## Weggelaten of vereenvoudigd

- Rondbogen zijn spitse blinde nissen (58 graden) en rechthoekige vensters nissen met een schuin plafond, voor print zonder steun; de lantaarn, de galmgaten en de balustrade zijn dicht.
- Het blokvormige pleisterwerk (rustica) van sokkel en risaliet, de tandlijst, het stucwerk boven de deuren, kapitelen en basementen van de zuilen, de wijzerplaten, de balusters, de vlaggenmast, regenpijpen en dakgoten (alle kleiner dan 0,9 m of alleen kleur).

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder het PDOK-pand en zonder ondersteuningsobject (modelvolume gelijk met en zonder steun). Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Jozefkerk (Assen)](https://nl.wikipedia.org/wiki/Jozefkerk_(Assen))
- [Rijksmonumentenregister 8411](https://monumentenregister.cultureelerfgoed.nl/monumenten/8411)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Josephkerk,_Assen) (RCE 20412934 tot 20412954, tekening 1846 20026094; "Jozefkerk-Assen-May-2024"; "Assen, de Jozefkerk RM8411 foto8")
- BAG pand 0106100000000497 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0106100000000497) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
