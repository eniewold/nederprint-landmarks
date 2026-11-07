# Kerkje aan de Zee (Urk)

Het oudste kerkgebouw van Urk, aan de rand van het oude eiland boven het IJsselmeer en midden op het kerkhof. De kerk werd in 1786 gebouwd door ingenieur J.S. Creutz, op de plek van een oudere kerk. Het is een zaalkerk van baksteen onder een zadeldak tussen twee topgevels, met lisenen (onversneden steunberen) en rondboogvensters. De ingang in de noordgevel heeft een zandstenen omlijsting met vier wapens en een opschrift over de herbouw. De westtoren kreeg in 1896 een achtkante lantaarn met een naaldspits, en in 1954 de huidige uivormige bekroning naar ontwerp van Philip Bolt. De kerk is in 1988-1989 gerestaureerd en is rijksmonument 35882. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters. Het model vervangt BAG-pand 0184100000002638: schip, toren en aanbouw zijn samen één pand. Geen buurpand raakt de kerk; het dichtstbijzijnde pand staat op circa 20 m. De Bethelkerk (pand 0184100000002606) is een ander pand.
- STL op 1:1000: circa 21,1 × 10,9 × 21,8 mm.
- Genereren: `node scripts/generate-kerkje-aan-de-zee-urk.mjs --components`.

## Oorsprong en oriëntatie

De oorsprong ligt op RD (168950; 519447), lat/lon 52,662310 / 5,593398, bij het hart van het schip; de as van het schip ligt 0,30 m noordelijker. z = 0 is het maaiveld aan de noordkant (NAP +9,0 m). +X loopt langs de nok van de toren naar de oostgevel, onder −2,9 graden in RD (`xAxis` [0,99872; −0,05059]); +Y wijst naar de noordzijde. In dat stelsel lopen alle BAG-gevels van schip en toren binnen 2 cm evenwijdig of haaks.

`groundHeight` 51,39 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints`, aan de noordkant (straat). Aan de zuid- en westkant (kerkhof) ligt het maaiveld tot 0,45 m hoger. `groundOffsetMetres` is −0,1, de onderkant ligt 0,4 m onder het maaiveld.

## Onderdelen

- **Schip**: 15,7 × 10,1 m (BAG). Het zadeldak heeft zijn nok op +10,4 m en een helling van 0,90 (42 graden) aan beide zijden. Dat komt uit de 3D BAG-dakvlakken (b = +0,91 en −0,88, nok NAP +19,39) en klopt met het AHN-DSM. Aan de gevels ligt de goot op +5,87 m, met een gootlijst die 0,35 m uitsteekt en een schuine onderkant heeft.
- **Topgevels** oost en west: 0,45 m dik en 0,3 m boven het dakvlak (AHN aan de oostgevel 0,4 tot 0,5 m boven het dak). Op de vier hoeken staan schouderstukken tot +6,5 m. De schoorsteen op de top van de oostgevel loopt tot +11,25 m.
- **Lisenen**: de uitsprongen uit de BAG, zes per langsgevel en vier in de oostgevel, 0,28 tot 0,3 m diep. Ze lopen tot +5,3 m met een schuine afdekking.
- **Vensters**: rondboogvensters van 1,36 m breed, van +1,35 m tot +4,5 m. In de zuidgevel staan er drie, in de noordgevel twee aan weerszijden van de ingang. De oostgevel heeft twee vensters met een blinde boog ertussen en een oculus in de top.
- **Noordingang**: een deur van 1,5 m in een zandstenen omlijsting van 2,3 m breed tot +3,3 m, met de wapensteen erboven tot +4,1 m.
- **Aanbouw** ten noorden van de toren (BAG en 3D BAG): 2,6 × 1,75 m onder een lessenaarsdak naar het noorden. De goot ligt op +3,2 m, tegen de toren op +4,4 m. De westkant heeft een schild en de noordgevel een deur.
- **Toren**: een kern van 4,25 × 5,0 m met hoekpilasters die 0,3 m uitsteken, zoals de BAG ze tekent. Het baksteen loopt tot +8,75 m. In de westgevel zit een rondboogvenster met een venster eronder, in de zuid- en noordgevel een blinde boog. Daarboven komt het witte hoofdgestel: een fries tot +9,45 m met een onderkant van 48 graden en een kroonlijst tot +9,85 m.
- **Balustrade**: een dichte borstwering van 0,9 m dik tot +10,85 m (3D BAG en AHN: NAP +19,9 tot 20,0). Op de hoeken staan postamenten van 1,0 m met een piramidevormige afdekking tot +11,65 m.
- **Lantaarn en bekroning**: de achtkante lantaarn is 2,9 m breed over de vlakken. De acht bogen zijn nissen van 0,8 m met een spitse top. De kroonlijst steekt 0,3 m uit, tot +14,75 m. Daarboven volgen een laag dak naar een hals, de achtkante ui (2,05 m breed op +16,2 m, top op +17,75 m), de bol tot +18,85 m en de spil tot +21,4 m.

## Geschat

- De hoogtes van de toren komen uit de noordfoto (RCE 20274363). Die foto is frontaal en geschaald op de lisenen en vensters van de noordgevel, waarvan de maten uit de BAG komen. Daarnaast is de zuidwestfoto (RCE 20274368) gebruikt: baksteen +8,75, hoofdgestel +9,85, balustrade +10,85 m. De bovenkant van de balustrade klopt met de 3D BAG en het AHN.
- Lantaarn, ui, bol en spil zijn geschat uit de verhoudingen op de zuidwestfoto en de foto van de toren uit het noordwesten (RCE 20410322). Ze zijn gecontroleerd tegen het AHN: rond de kroonlijst van de lantaarn NAP 23,5 tot 25, de top van de ui NAP 26,6 tot 27,8 en de bol NAP 28,8.
- De vensters, de deur met omlijsting en wapensteen, de schouderstukken, de schoorsteen en de oculus komen uit de frontale noord- en oostfoto (RCE 20274363 en 20274367).
- Bij de hoekpilasters van de toren volgt het model de BAG, ook waar die aan de zuid- en noordzijde niet helemaal symmetrisch is.

## Weggelaten of vereenvoudigd

- De balusters zijn een dichte borstwering geworden. Ze zijn te fijn voor 1:1000 en open zouden ze een leuning zijn.
- De bollen op de postamenten (kleiner dan 0,9 m) zijn als piramidekapjes gemodelleerd.
- De open bogen van de lantaarn zijn blinde nissen met een spitse top. De roeden en de ronde vensterbogen zijn spits gemaakt (58 graden) voor print zonder steun.
- De spil is verbreed tot 0,9 m en houdt op +21,4 m op. De dunne makelaar en de windvaan erboven (tot circa +24 m) zijn weggelaten.
- Weggelaten omdat ze kleiner zijn dan 0,9 m of geen reliëf hebben: de kleine rechthoekige vensters in de smalle traveeën bij de toren, het venster en de schoorsteentjes van de aanbouw, de rustica van de hoekpilasters, de ontlastingsbogen boven de vensters, de regenpijpen, het hekwerk en de grafstenen.

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden. Het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan de catalogusvelden, hoekpunten, doorsneden en de controle op steun onder 45 graden; er komt geen opvulling bij.

Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model. Het PDOK-pand ontbreekt erin, en er is geen opvulling: het volume is gelijk aan dat zonder steun. Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's. PDOK heeft het schip met zadeldak maar zonder topgevels, lisenen, vensters en gootlijst, en de toren als een blok tot circa 11 m zonder lantaarn en ui.

## Bronnen

- [Wikipedia: Kerkje aan de Zee (Urk)](https://nl.wikipedia.org/wiki/Kerkje_aan_de_Zee_(Urk))
- [Rijksmonumentenregister 35882](https://monumentenregister.cultureelerfgoed.nl/monumenten/35882)
- [Wikidata Q2181670](https://www.wikidata.org/wiki/Q2181670)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Kerkje_aan_zee_(Urk)) (RCE 20274361, 20274363, 20274366, 20274367, 20274368, 20274369, 20410322)
- BAG pand 0184100000002638 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0184100000002638) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
