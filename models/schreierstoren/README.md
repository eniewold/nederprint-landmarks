# Schreierstoren — Amsterdam

D-vormige toren met vlakke stadszijde, veelhoekige bovenbouw, achtzijdig tentdak, dakkapel, schilddak van de aanbouw, buitentrap en laag terrasgebouw. Eén gesloten, verbonden volume. Het model vervangt het volledige BAG-pand `0363100012182530`.

## Bronnen en maatvoering

- PDOK BAG/BGT, EPSG:28992; openbare geodata, geraadpleegd 11 oktober 2026. Cirkelpassing op de ronde BAG-contour: RD [121976,9943; 487726,1361], straal 5,9516 m; lokale +X [0,93049724; −0,36629891]. Vlakke stadswand x=−2,954 m. Volledige voetafdruk circa 10,49 × 22,72 m.
- PDOK AHN DSM/DTM 0,5 m en [3D BAG LoD2.2](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012182530): maaiveld NAP +2,5 m, goot +14,385 m, dakpunt +22,037 m, bekroning +22,67 m, aanbouwnok +12,825 m en terras +4,80 m. De hoogte van de kap is uit dakpunten gemeten, niet uit een bekende totale torenhoogte afgeleid.
- [Gemeente Amsterdam](https://www.amsterdam.nl/nieuws/achtergrond/stenen-schreierstoren/) en [Arcam](https://arcam.nl/architectuur-gids/schreierstoren/): bouwvorm, ronde waterzijde en vlakke stadszijde, achtzijdige opbouw.
- Schuine bronfoto's: [Schreiers2](https://commons.wikimedia.org/wiki/File:Schreiers2.jpg) en [Schreiers3](https://commons.wikimedia.org/wiki/File:Schreiers3.jpg), bureau Monumenten & Archeologie, Attribution; [stadszijde](https://commons.wikimedia.org/wiki/File:Amsterdam_-_Oudezijds_Kolk_-_Geldersekade_-_View_SE_on_Schreierstoren_1487.jpg), Txllxt TxllxT, CC BY-SA 4.0; [2024](https://commons.wikimedia.org/wiki/File:2024_Schreierstoren_gf57.jpg), Gillfoto, CC BY-SA 4.0. Alleen geraadpleegd, geen foto opgenomen in de repository.

Vensterhoogtes en -dieptes, boogfries, dakkapel, buitentrap en balustrade zijn uit de foto's geschat. Vensters zijn blinde nissen van circa 0,35 m diep. De echte spijlen van de terrasbalustrade zijn tot een gesloten rand van 0,9 m vereenvoudigd. Gevelstenen, teksten, roeden en het dunne scheepje van de windvaan zijn op 1:1000 weggelaten; de punt is 0,92 m breed gemaakt. Het dak bestaat uit vlakke kapvlakken, de gevels uit prisma's en een dragende kraag; er zijn geen AHN-hoogtelagen gestapeld.

## Plaatsing en print

z=0 is de straatzijde. De verborgen voet loopt tot z=−2,4 m om ook bij het lagere waterterrein aan te sluiten; catalogus-offset −0,3 m. Drie grondmonsters staan op de straatzijde. De echte PDOK-metingen waren 45,486, 45,375 en 45,810 in het interne hoogtestelsel; de laagste bepaalt de plaatsing. Het terras raakt ook het terrein dat circa 2,4 m lager ligt. De direct aangrenzende PDOK-daken vertoonden in de vier aanzichten geen torenartefact van meer dan 2 m; geen andere panden worden vervangen.

GLB in meters, STL in millimeters op 1:1000, circa 10,5 × 22,7 × 22,6 mm inclusief verborgen voet. Ondersteuningscontrole op 45° voegde minder dan 1% volume toe voor kleine nissen en dakranden. In de webshop wordt deze printbare overhang automatisch gevuld. De STL heeft een vlakke onderkant en blinde, ondiepe nissen; geen loshangende dakdelen of losse balustrades.

## Controle

- Generator: `node scripts/generate-schreierstoren.mjs`; GLB, JSON en STL worden reproduceerbaar geschreven.
- Test in de webshop: `tests/landmark-models.test.ts`, test "keeps Schreierstoren's D footprint…". Toetst maatvoering, kap/aanbouw/terras, één gesloten lichaam, gedeelde 45°-ondersteuning en RD-plaatsing.
- Visueel vier hoeken (−35°, 55°, 145°, 235°) naast dezelfde PDOK-reconstructie en schuine foto’s bekeken. Kaart gecontroleerd met landmarkschakelaar uit en aan: het oorspronkelijke pand komt terug en verdwijnt.
- Volledige preview én 3MF-export van 80 × 80 m op exact 1:1000, 45° overhang; hele model binnen de uitsnede, aansluiting op maaiveld gecontroleerd. Controlebeelden en export blijven buiten de repo.
- [Controlekaart](http://localhost:3000/kaart/52.3764118/4.9022445/130/1x1/111.4875?theme=thema-polder-8&base=road&size=80&z=1): controleer vooral de vlakke stadszijde, de dakpunt en de aansluiting van het lage terras aan het water.
