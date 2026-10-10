# Rijnbrug bij Heteren (Heteren)

Vereenvoudigd landmark van de volledige A50-brug over de Nederrijn, inclusief de gebogen noordelijke aanbrug. De huidige BGT-dekcontour is leidend; de backloglocatie ligt op de noordelijke aanbrug en is niet het rivierhart.

## Bestanden en regenereren

- `rijnbrug-heteren.glb`: meters, Y omhoog, twaalf eigen `road:`-nodes met actuele BGT-attributen en één gesloten `building:`-node voor kokers, pijlers en niet als wegdeel geregistreerde dekranden.
- `rijnbrug-heteren.json`: RD-plaatsing, waterbemonstering, terreinvervanging en brondocumentatie.
- `rijnbrug-heteren-1-1000.stl`: volledige brug met geïntegreerde printvoet; circa 985,1 × 131,8 × 17,39 mm. Geen losse slicersteun nodig.
- `../../scripts/generate-rijnbrug-heteren.mjs`: opgeslagen contouren en benoemde bouwdelen, geen netwerk nodig bij regenereren. `node scripts/generate-rijnbrug-heteren.mjs`; `--scale 1000`; `--out <lege modelroot>` schrijft daarin `rijnbrug-heteren/`.

## Plaatsing en gemeten vormen

Oorsprong RD `[181190, 441820]`; +X naar het noorden langs de hoofdoverspanning, `xAxis [0.2549854662, 0.9669448857]` (de exacte genormaliseerde vector staat in de JSON). Lokale +Y staat linksom op +X. Z=0 is de gekozen waterbasis, ellipsoïdisch 49,56273 m uit de PDOK-waterreconstructie. `groundSamplePoints` liggen naast het dek in de werkelijke rivieroverspanning. Alleen BGT-dek `L0002.dcefac4395a04be091b10ab049db608e` wordt vervangen; geen BAG-panden.

Het dek volgt de volledige huidige BGT-polygoon: lokaal X circa −485,47 tot +498,69 m. Twee kokerliggers volgen deze bocht. Het continue lengteprofiel komt uit AHN-DSM 0,5 m: medianen van 41 punten over de rijbanen per 20 m, met regelmatige interpolatie tussen meetstations om voertuigen en lokale ruis uit het profiel te houden. Gemeten wegdek NAP circa 20,38–24,89 m. Het dek is een vervormd gesloten prisma; de kokers zijn doorsnedelofts met vloeiende verdiepingen boven de rivierpijlers, geen gestapelde hoogtelagen.

Twaalf actuele BGT-wegdelen met `relatieve_hoogteligging ≥ 1` leveren de twaalf 0,5 m wegvolumes met functie `rijbaan autosnelweg`. BGT toont hier geen verhoogd fietspad of voetpad. Niet als weg geregistreerde middenstrook en randen blijven constructie; daar wordt geen voetpadfunctie bij verzonnen. De wegvolumes worden uit de constructie verwijderd met een snijstrook van 0,5 m onder tot 1 m boven het dek, zodat geen constructievlak zonder dikte op wegdekhoogte overblijft.

## Geschat

- Waterbasis NAP +7,5 m: afgestemd op de onafhankelijke PDOK-weghoogte bij beide landhoofden; dit is geen peilmeting. Zuidelijke aansluiting wijkt circa 0,05 m af, de noordelijke tot circa 0,45 m. De actuele waterstand kan veranderen.
- Dekdikte 1,5 m; kokerdiepte 2,1 m op de aanbruggen en 2,4–5,5 m rond de rivierpijlers, afgeleid van schuine foto's. Inwendige holten zijn dicht.
- De noordelijke grote rivierpijler komt uit BGT rond X −223,5 m. De zuidelijke grote pijler ontbreekt als bruikbare BGT-contour en ligt geschat bij X −343,5 m: hoofdveld circa 120,7 m. De overige expliciet geschatte pijlers liggen bij X −102,8, +235, +295, +355, +415 en +475 m, met circa 4,6 m lengtedikte; bestaande BGT-pijlers en landhoofden hebben hun eigen contour.
- BGT-onderbouw is vanaf de vlakke waterbasis doorgetrokken; terrein snijdt de onderkant in de kaart en export af. Opleggingen zijn met de kokers samengevoegd.

## Weggelaten en printversie

Leuningstijlen, lantaarnpalen, geleiderails, losse oplegrubbers, verkeersborden en portalen bestaan uit vrije delen ruim onder 0,9 m dikte; ze zijn niet geschikt als afzonderlijke delen op 1:1000. Voertuigen, schepen en tijdelijke objecten horen niet bij het landmark. Het portaal wordt ook niet als dicht massief scherm nagebouwd. Baksteenvoegen in de grote pijlers zijn kleiner dan de printresolutie. Wegen en terrein onder het dek blijven PDOK.

De STL heeft twee doorlopende geïntegreerde wanden met 43° schouders onder de kokers. Bij beide landhoofden loopt de printvoet over circa 45 m tot de vloer door en is de scherpe rand 0,5 m verbreed. Dit zijn printvoorzieningen; de GLB toont de constructieve kokers en pijlers. De volledige STL is één verbonden gesloten solid.

## Controle

Alle brononderdelen en de STL geven Manifold `NoError`; bronvolume is verdeeld over wegen en constructie met 0,0522 m³ numerieke afwijking, minder dan één miljoenste. 7.750 verticale dekstralen geven minstens 0,49753 m afstand tussen het hoogste wegvlak en de constructie. De onafhankelijke STL-controle vindt geen vrije overhang boven 45° met een driehoekhoogte boven 0,05 mm op 1:1000; de grootste numerieke snijsliver uit de generator is 0,000235 mm.

Een tijdelijke test controleert `shareModelSupport` en `supportedSolid` op ware printschaal 1:1000: de steun blijft bij de constructie, en horizontale doorsneden op 0,5, 2 en 4 mm geven twee doorlopende wanden over een 50 mm venster tussen de rivierpijlers, elk minstens 0,8 mm breed. Kleine Float32-wegvolumes kunnen bij de export tot 6% volume verliezen, gemiddeld minder dan 0,03 mm van de 0,5 mm wegdikte; ze krijgen geen constructiesteun toegewezen. Dit is een exportprecisiebeperking, geen bronoverlap.

`createModelBundle` is met een hele uitsnede van 650 × 1300 m en matrixschaal 1:1000 gecontroleerd; alle dertien landmarknodes vallen binnen de preview en 3MF. De vaste modeltest controleert omvang, AHN-hoogten, BGT-attributen, scheiding van weg en constructie, en RD-plaatsing. Model- en API-tests zijn groen. Vier schuine GLB-renders zijn vergeleken met identieke camera's van PDOK en de hieronder genoemde schuine foto's. De GLB voegt vanuit alle vier de kanten verhoogde kokers, rivierhaunches en pijlers toe. Kaartcontrole met rode snelwegkleur bevestigt de afzonderlijke BGT-wegdelen. Controlebeelden en exports staan buiten de repository.

Controle-URL: `http://localhost:3000/kaart/51.96439/5.76728/1800/1x1/0?rules=r.f.rijbaan%20autosnelweg.10200`. Controleer vooral de geschatte ontbrekende pijlers en de aansluiting op het noordelijke landhoofd.

## Bronnen

- [PDOK BGT overbruggingsdeel](https://api.pdok.nl/lv/bgt/ogc/v1/collections/overbruggingsdeel/items), [wegdeel](https://api.pdok.nl/lv/bgt/ogc/v1/collections/wegdeel/items): actuele contouren en attributen, geraadpleegd 11 oktober 2026.
- [AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), `dsm_05m`: wegprofiel; [PDOK actuele luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0): ligging, bocht en onderbouw waar zichtbaar.
- [PDOK 3D Basisvoorziening](https://www.pdok.nl/3d-basisvoorziening): onafhankelijke reconstructie en water-/aansluithoogten.
- [Rijnbrug bij Heteren](https://nl.wikipedia.org/wiki/Rijnbrug_bij_Heteren): context, lengte 973,65 m en hoofdveld 120,7 m (eigen huidige BGT-contour blijft leidend).
- [Brug in de A50 over de Nederrijn bij Heteren](https://commons.wikimedia.org/wiki/File:Brug_in_de_A50_over_de_Nederrijn_bij_Heteren.jpg), Wil Leeuwis, CC BY-SA 4.0: zijaanzicht.
- [The A50 concrete archbridge from the seventies near Heteren](https://commons.wikimedia.org/wiki/File:The_A50_concrete_archbridge_from_the_%22seventies%22_near_Heteren_-_panoramio.jpg), Henk Monster, CC BY 3.0: kokeronderzijde en rivierpijlers.
- [A50 motorway arch bridge over the Rhine near Heteren](https://commons.wikimedia.org/wiki/File:A50_motorway_arch_bridge_over_the_Rhine_near_Heteren_-_panoramio.jpg), Henk Monster, CC BY 3.0: tegenovergestelde schuine onderzijde.
