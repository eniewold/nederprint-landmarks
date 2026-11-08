# Evangelisch-Lutherse Kerk (Nijmegen)

Landmark voor het Lutherse kerkje aan de Prins Hendrikstraat 79 in Nijmegen (Derk Semmelink, 1896; toren 1929), BAG-pand `0268100000002585`. Het pand omvat ook de achtervleugel en de kosterswoning aan de Jacob Canisstraat; die zijn met hun eigen daken opgenomen.

## Bestanden

- `evangelisch-lutherse-kerk-nijmegen.glb`: één node `building:kerk`, meters, Y omhoog.
- `evangelisch-lutherse-kerk-nijmegen.json`: catalogusitem.
- `evangelisch-lutherse-kerk-nijmegen-1-1000.stl`: printbestand op 1:1000 in millimeters, Z omhoog.

Generator: `scripts/generate-evangelisch-lutherse-kerk-nijmegen.mjs`.

## Oorsprong en oriëntatie

Oorsprong RD (188304,18; 428253,09), midden in de kerkzaal op maaiveld (NAP +32,7 m). De X-as loopt langs de gevels van de toren aan de Prins Hendrikstraat naar achteren (60,3 graden in RD, `xAxis` [0,4958; 0,8684]); +Y wijst naar het noordwesten. De voorpartij met toren, portaal en zijkapellen is spiegelsymmetrisch om Y = 1,55.

## Onderdelen

- Zaal op een veelhoek met afgeschuinde voorhoeken en een schilddak uit vlakken: nok +14,75 m, langsvlakken 51 graden, schilden van 1,35 en eigen dakvlakken op de schuine hoeken. Het schild aan de zuidoostkant komt lager uit (goot +7,8 m) dan dat aan de noordwestkant (+10,1 m), zoals in 3D BAG en AHN.
- Toren van 4,3 × 4,3 m tot de goot op +14,5 m, tentdak tot +18,3 m, met portaal en puntgevel aan de straatzijde en een plint over de torenbreedte.
- Twee veelhoekige zijkapellen naast de toren met een steil schilddak (goot +6,9 m, top +9,2 m).
- Achtervleugel achter de zaal met zadeldak (nok +13,3 m, 35 graden); de oostgevel is de scheidingsmuur met het buurpand.
- Kosterswoning met twee bouwlagen en een afgeknot schilddak (goot +7,8 m, plat +10,3 m), met de vooruitspringende rechterhelft.
- Dakkapellen op beide schilden van de zaal en in het dak van de kosterswoning; ingang, torenvensters, galmgaten (drie per zijde) en vensters als blinde spitsboognissen van 0,35 m.

## Geschat en weggelaten

De dakvlakken, goot- en nokhoogtes komen uit 3D BAG LoD2.2 en het AHN-DSM; let op dat 3D BAG het maaiveld op NAP +31,1 m zet, terwijl het AHN-dtm rondom +32,7 m geeft. Het model volgt het AHN. Hoogte van het portaal, de vensters en de dakkapellen zijn geschat uit foto's. Ronde vensterbogen zijn spitsbogen geworden zodat ze zonder steun printen. De paal met windvaan op de toren (AHN tot +21,3 m), de geprofileerde kroonlijsten, de overstekende goot van het tentdak, het houten balkon van de kosterswoning, schoorstenen en de trappen bij de ingang zijn weggelaten (smaller dan 0,9 m of horizontaal uitkragend).

## Controle

De generator maakt één gesloten volume (genus 0) met vlakke voet. Een test controleert plaatsing, mesh en printbaarheid zonder extra steun op 1:1000 (steunverhouding 1,00). Het model is uit vier richtingen naast de 3D BAG-reconstructie gelegd en vergeleken met foto's van de voorgevel en de zijgevel aan de Jacob Canisstraat.

Controleer op [de kaart](http://localhost:3000/kaart/51.84189/5.87052/200/1x1/0) de plaatsing en de aansluiting op het buurpand aan de achterzijde.

## Bronnen

- [Wikipedia: Lutherse kerk (Nijmegen)](https://nl.wikipedia.org/wiki/Lutherse_kerk_(Nijmegen)), [Wikidata Q2225820](https://www.wikidata.org/wiki/Q2225820), [monument 476729](https://monumentenregister.cultureelerfgoed.nl/monumenten/476729), [OSM way 279900610](https://www.openstreetmap.org/way/279900610).
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0268100000002585), BAG-WFS en [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0).
- [Foto's op Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Lutherse_Kerk_(Nijmegen)).
