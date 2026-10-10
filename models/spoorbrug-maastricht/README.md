# Spoorbrug Maastricht (Maastricht)

Het huidige spoorbrugcomplex over de Maas: een westelijke tafelbrug in geheven stand, één boogoverspanning en plaatliggeraanbruggen. De geometrie volgt de actuele BGT-contouren, AHN-dek- en booghoogtes en schuine Commons-foto's.

## Bestanden en plaatsing

- `spoorbrug-maastricht.glb`: meters, Y omhoog, drie gesloten spoorlagen en één constructienode.
- `spoorbrug-maastricht.json`: RD-oorsprong `[176844.5255, 318798.4295]`, +X `[0.94825184, -0.31751922]` naar oostzuidoost; +Y naar noordnoordoost. Eén vervangen BGT-dekplaat.
- `spoorbrug-maastricht-1-1000.stl`: één verbonden model met geïntegreerde printvoet, circa 217,45 × 16,84 × 19,9 mm.
- `scripts/generate-spoorbrug-maastricht.mjs`: vaste broncontouren en benoemde bouwdelen; `--out` wijst de catalogusmap aan.

De geschatte waterbasis NAP +44,15 m is afgestemd op PDOK-water: 89,81573 m ellipsoïdisch, met vier bemonsteringspunten in de Maas. Aan de westkant ligt de PDOK-spooraansluiting circa 0,4–0,5 m onder het AHN-dek; aan de oostkant circa 4,5 m. De huidige AHN-spoorhoogtes zijn behouden. Deze afwijking van het grove PDOK-terrein vraagt aandacht bij kaartreview; de landhoofden lopen tot de waterbasis door.

## Onderdelen en schattingen

Het actuele BGT-dek is 216,45 m lang, inclusief de landhoofden; de afgeronde historische lengte van 200 m is niet als maat gebruikt. Zeven BGT-pijler- en landhoofdcontouren bepalen de onderbouw. De tafelbrug ligt tussen x=-60,8 en -26,8 m; de boog tussen x=-26,8 en 39,15 m. De locaties zijn uit de pijlers afgeleid.

AHN geeft circa NAP +51,8 m voor het vaste spoorvlak, +53,22 m voor de geheven tafelbrug en +64,05 m voor de boogkruin. Drie doorlopende dekvlakken bewaren de echte hoogtesprongen aan de tafelbrug. De boog is één vloeiend polygonprofiel per zijde; geen gestapelde hoogtelagen.

De twee zijliggers steken circa 1,95 m boven het spoor uit. Dekdikte 1,5 m, liggerdiepte 2,1 m, liggerbreedte 1,5 m en het boogprofiel tussen de AHN-meetpunten zijn vereenvoudigingen uit foto's. Brede historische pijlerbases dragen twee versmallende koppen met een zichtbare middendoorgang. Hun opstand, tapering en tussenruimte zijn geschat. Twee bedienhuisjes bij de tafelbrug zijn geschat op 2,4 × 2,4 × 2,3 m; de steun onder deze buiten het dek gelegen huisjes loopt door tot de pijlerbasis.

De hangers worden als twaalf blinde spitsnissen per boogwand weergegeven, dubbelzijdig 0,3 m diep in een 1,5 m wand met 0,9 m kern. Dit is een printaanpassing van de open hangers. De drie spoorlagen zijn telkens de bovenste 0,5 m van het eigen dekvlak, met de oorspronkelijke BGT-attributen `spoorbaan` en `half verhard`. De zijliggers en boogwanden blijven constructie; de wegdekstrook houdt er 2 cm afstand van.

## Print en controle

Alle vier brononderdelen zijn gesloten `NoError`; de losse STL is één verbonden volume. Twee doorlopende wanden met 35° schouders en verbrede eindankers maken de STL zonder losse steun printbaar. De overhangcontrole vindt alleen een numerieke snijsliver kleiner dan 0,000001 mm.

De directe gezamenlijke `shareModelSupport`-/`supportedSolid`-controle op 1:1000 slaagt. Doorsneden tussen de rivierpijlers op 0,5, 2 en 4 mm houden doorlopende wanden van minstens 0,8 mm over. De spoorlagen krijgen geen eigen steun; hun volume verandert minder dan 0,00001%. De float32-volumepartitie na de steunbewerking wijkt circa 0,063% af, binnen de gecontroleerde numerieke tolerantie van 0,1%; de bronpartitie wijkt minder dan 0,000001 m³ af.

Een volledige 300 × 300 m uitsnede is op 1:1000 met `createModelBundle` geëxporteerd en visueel gecontroleerd. Model- en API-tests controleren plaatsing, boogkruin, tafelbrughoogte, spoorhoogtes en BGT-attributen. 12.997 verticale dekstralen vinden nul samenvallende constructievlakken en nul spoorlagen dunner dan 0,49 m.

Vier identieke GLB-/PDOK-camera's en schuine foto's zijn vergeleken. Vanuit west en zuid voegt het model het verhoogde spoor, de afzonderlijke tafelbrug en boog toe; vanuit oost en noord ook de brede pijlers, gekoppelde boogwanden en blinde hangernissen. Kaart en volledige preview tonen rood spoor; de grijze PDOK-dekplaat verdwijnt zonder een gat in de Maas.

## Weggelaten en bronnen

Dunne windverbanden, bovenleiding, leuningen, flenzen, klinknagels, bedientrappen en hijsmechanieken onder 0,9 m zijn weggelaten. Geen rivierbodem, talud of naburige fabrieksgebouwen in het landmarkmodel. De historische dubbele spoorbreedte is alleen in de huidige brede pijlercontouren aanwezig.

- [BGT OGC API](https://api.pdok.nl/lv/bgt/ogc/v1/): actuele overbruggingsdelen en spoorwegdeel, geraadpleegd 11 oktober 2026.
- [AHN DSM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0) en [PDOK ortho](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [Spoorbrug Maastricht](https://nl.wikipedia.org/wiki/Spoorbrug_Maastricht): constructietype en tafelbrug.
- [Tafelbrug, 20140525 Maastricht, Meuse 11.JPG](https://commons.wikimedia.org/wiki/File:20140525_Maastricht,_Meuse_11.JPG), Mark Ahsmann, CC BY-SA 3.0.
- [Onderzijde, 2018-Maastricht, Spoorbrug 3.jpg](https://commons.wikimedia.org/wiki/File:2018-Maastricht,_Spoorbrug_3.jpg), Kleon3, CC BY-SA 4.0.
- [Overzicht vanaf Noorderbrug](https://commons.wikimedia.org/wiki/File:2021_Maastricht,_gezicht_vanaf_Noorderbrug_op_Spoorbrug.jpg), [aanbrug vanaf Romanusweg](https://commons.wikimedia.org/wiki/File:2021_Maastricht,_F_Romanusweg,_Spoorbrug_(1).jpg) en [boog en pijlers](https://commons.wikimedia.org/wiki/File:2021_Maastricht,_F_Romanusweg,_Spoorbrug_(2a)_(cropped).jpg), Kleon3, CC BY-SA 4.0. Foto's en controlebeelden blijven buiten de repository.
