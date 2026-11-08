# Hervormde kerk (Neerijnen)

Landmark voor de hervormde kerk aan de Van Pallandtweg in Neerijnen (gemeente West Betuwe), rijksmonument 30371, BAG-pand `0304100000004453`. Het is een gepleisterde neogotische kruiskerk van stadsarchitect A.M.A. Gulden uit 1865, met een slanke westtoren van twee geledingen. De BAG noemt 1750 als bouwjaar, maar register en Reliwiki geven 1865; de kerk verving een kerk uit 1692.

## Bestanden

- `hervormde-gemeente-waardenburg-neerijnen.glb`: één node `building:kerk`, meters, Y omhoog.
- `hervormde-gemeente-waardenburg-neerijnen.json`: catalogusitem.
- `hervormde-gemeente-waardenburg-neerijnen-1-1000.stl`: printbestand op 1:1000 in mm.

Generator: `scripts/generate-hervormde-gemeente-waardenburg-neerijnen.mjs`.

## Oorsprong en oriëntatie

De oorsprong ligt op RD (147552, 427024), op de as van het schip ter hoogte van het dwarsschip. +X loopt langs de nok naar het oosten (`xAxis` [0,9266; 0,3761], 22,1 graden boven RD-oost, gemeten langs de BAG-gevels) en +Y naar de noordzijde. Het maaiveld ligt op NAP +4,6 m (AHN-DTM rond de kerk).

## Onderdelen

- Schip (23 × 10,35 m) en dwarsschip (10,3 × 16,3 m) met zadeldaken van 45 graden en een gelijke nok op 13,95 m (NAP +18,55 m). De kilgoten van de kruising volgen uit de doorsnijding van de daken.
- Lage oostbouw met een dwarse nok op 8,6 m en topgevels naar noord en zuid.
- Platte aanbouwen van 3,1 m: de consistorie aan de noordzijde en een portaal aan de zuidzijde.
- Toren: onderbouw van 4,2 × 4,3 m tot 15,8 m, klokkenverdieping van 3 × 3 m tot 21,2 m met een wimberg op elke zijde, en een achtzijdige naaldspits tot 30 m (top 0,9 m breed).
- Pinakels van 0,9 m op de hoeken van schip, dwarsschip, oostbouw en toren, en op de toppen van de topgevels.
- Borstwering langs de goten van schip en dwarsschip.
- Spitsboogvensters, deuren, galmgaten en ronde vensters (rozet, uurwerk) als blinde nissen van 0,35 m.

## Geschat en weggelaten

De goot- en nokhoogtes en de dakhelling komen uit het AHN-DSM; de 3DBAG-reconstructie van de toren is onbruikbaar (te laag en hoekig). De torengeleding en de spitshoogte zijn geschat uit frontale RCE-foto's, met de hoogste AHN-pixel (NAP +33,9 m) als ijkpunt. Het aantal en de maten van de vensters zijn uit foto's geschat. De borstwering langs de goten en rond de toren is in het echt opengewerkt. Hier is ze een dichte strook, en de torenbalustrade is weggelaten. Weggelaten zijn ook de wimbergen boven de vensters, de kruisen en windvaan (kleiner dan 0,9 m), de lisenen en het losse schuurtje ten noordoosten van de kerk (geen deel van het pand).

## Controle

De generator maakt één gesloten volume (genus 0) met een vlakke voet. De test plaatst het model op een uitsnede van 200 × 200 m en controleert of het zonder extra steun op 1:1000 te printen is. Software-renders uit vier richtingen zijn vergeleken met de 3DBAG-LoD2.2-reconstructie en met RCE- en Commons-foto's van de west-, noord- en zuidoostzijde.

## Bronnen

- [Rijksmonumentenregister 30371](https://monumentenregister.cultureelerfgoed.nl/monumenten/30371)
- [Reliwiki](https://reliwiki.nl/index.php?curid=13110) en [Wikidata Q17437114](https://www.wikidata.org/wiki/Q17437114)
- [Foto's op Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Neerijnen)
- [3DBAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0304100000004453), BAG-WFS en [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0)
- [OSM way 273714185](https://www.openstreetmap.org/way/273714185)
