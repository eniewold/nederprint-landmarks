# Stadhuis — Delft

Volledig stadhuis rond Het Steen: drie schilddakvleugels, lager overkapt binnenhof, lage achterbouw en traptoren, vierkante klokkengeleding met tentdak en vier klokfrontons, Marktfronton, twee zijtopgevels, dakkapellen, vier schoorstenen, balustrade, pilasters en entreetrap. Eén verbonden gesloten volume, opgebouwd uit gevelprisma's, dakvlakken en bouwdelen.

## Bronnen en maten

- PDOK BAG/BGT `0503100000014169`, openbare geodata EPSG:28992, 11 oktober 2026: oorsprong RD [84372,0517; 447509,6131], +X [0,86776545; 0,49697396] naar de Markt. De oorspronkelijke backlogcoördinaat lag circa 37 m westelijk van het pand en is voor de controlekaart gecorrigeerd. De hele BAG-contour wordt vervangen.
- PDOK AHN DSM/DTM 0,5 m en [3D BAG LoD2.2](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0503100000014169): maaiveld circa NAP +1,3 m; goot +12,65 m; vleugelnokken +19,5 m; schoorstenen/zijtoppen +22,52/+22,53 m; torenkraag +25,12 m; torengoot +33,85 m; dakpunt +41,15 m. Schoorstenen staan lokaal bij x=−2,1/7,8 en y=±8,3, gemeten in DSM. De hoogte +41,85 m van de verdikte bekroning is uit foto's geschat. De oorspronkelijke DSM/LoD2-dakranden bepalen de kap, niet een totale hoogte die gelijkmatig wordt verdeeld.
- [RCE monument 11901](https://monumentenregister.cultureelerfgoed.nl/monumenten/11901) en [In Delft](https://www.indelft.nl/nl/locaties/1181195682/stadhuis-oranje-route): vierkante middeleeuwse toren, drie spitsboognissen per zijde, omliggend renaissancistisch stadhuis, fronton, trapgevels en dakbalustrade.
- Schuine foto [zijgevel](https://commons.wikimedia.org/wiki/File:Delft_-_ayuntamiento_-_vista_lateral.jpg), Hispalois, CC BY-SA 4.0; [hoog dakoverzicht](https://commons.wikimedia.org/wiki/File:Delft_(Nederland)_Stadhuis_by_the_tower_11_August_2012_-_panoramio.jpg), Lamberto Zannotti, CC BY-SA 3.0; [voorgevel](https://commons.wikimedia.org/wiki/File:Delft_CityHall_017_5356.jpg), Ludvig14, CC BY-SA 4.0; [schuin overzicht](https://commons.wikimedia.org/wiki/File:2010-05-15-delft-by-RalfR-08.jpg), Ralf Roletschek, GFDL 1.2. Foto's uitsluitend geraadpleegd; geen afbeeldingen in deze repo.

Daknokrichtingen, maatstelsel, footprint en genoemde hoogtes zijn gemeten. Nissen en vensters, frontonprofielen, dakkapelbreedtes, schoorsteendoorsneden, balustrade, balkon en treden zijn uit foto's geschat en vereenvoudigd voor 1:1000. De dakbalustrade is een gesloten rand van minstens 0,9 m breed; vensters zijn ondiepe blinde nissen. Schelpen, wapens, tekst, beelden, raamroeden en dunne windvaanornamenten zijn onder de printgrens weggelaten. De klokfrontons en ronde wijzerplaatnissen blijven herkenbaar. Geen gestapelde AHN-hoogtelagen.

## Plaatsing, print en controle

z=0 op NAP +1,3 m; verborgen voet z=−0,6 m, catalogus-offset −0,3 m. Grondmonsters liggen op de Markt [17,−9], [20,0], [17,9], voorbij de entreetrap. De echte PDOK-hoogtes waren intern 44,695, 44,734 en 44,653; de laagste bepaalt de datum. De voet zit voldoende in het omliggende terrein. De aangrenzende PDOK-daken vertonen in de vier vergelijkingen geen torenartefact van meer dan 2 m; geen extra pandvervangingen.

- Reproduceren: `node scripts/generate-stadhuis-delft.mjs`. GLB in meters; STL in millimeters op 1:1000, circa 32,1 × 27,0 × 41,2 mm inclusief voet. Gesloten manifold, één verbonden lichaam. Geen losse balustrades, dakvlakken of klokfrontons.
- De 45°-ondersteuningscontrole voegde 0,11% volume toe; de webshop vult kleine uitstekende randjes automatisch printbaar aan. Volledige preview en 3MF-export op exact 1:1000 gemaakt van 80 × 80 m, inclusief hele model en terrein.
- Vier schuine aanzichten −35°, 55°, 145°, 235° naast dezelfde PDOK-reconstructie en bovenstaande foto's beoordeeld. Kaart met modellen uit/aan: oorspronkelijk pand verschijnt en verdwijnt. Positie, oriëntatie en maaiveldvoet gecontroleerd.
- Webshoptest in `tests/landmark-models.test.ts`: "keeps Delft town hall's three roof wings…" toetst daken, toren, klokfrontons, treden, verbondenheid, geslotenheid, 45°-overhang en RD-plaatsing.
- [Controlekaart](http://localhost:3000/kaart/52.0114494/4.3584339/210/1x1/60.2?theme=thema-polder-8&base=road&size=80&z=1): controleer het Marktfronton, de schilddakvleugels en de klokfrontons van Het Steen.

Controlebeelden en de volledige export staan buiten de repository.
