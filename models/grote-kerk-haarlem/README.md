# Grote of Sint-Bavokerk (Haarlem)

De Grote of Sint-Bavokerk aan de Grote Markt is een laatmiddeleeuwse kruisbasiliek in Brabantse gotiek (1370-1520): een hoog schip en koor onder één zadeldak, zijbeuken en een kooromgang onder lessenaarsdaken, een transept met topgevels en hoektorentjes, kapellen langs schip en koor, en op de viering de houten, met lood beklede vieringtoren van ruim 78 m (1520). Rijksmonument 19264.

## Bestanden

- `grote-kerk-haarlem.glb`: gesloten model in meters voor de kaart, één node `building:grote-kerk-haarlem`.
- `grote-kerk-haarlem.json`: catalogusgegevens en bronverwijzingen.
- `grote-kerk-haarlem-1-1000.stl`: printmodel in millimeters op schaal 1:1000 (119 × 59 × 79 mm).
- Generator: `scripts/generate-grote-kerk-haarlem.mjs`.

## Ligging en model

De oorsprong ligt onder de viering op RD (103933; 488399,2), de lokale +X-as loopt van de westgevel naar het koor met richting (0,99926; 0,03839), RD-richting 2,2 graden. Het maaiveld is circa NAP +1,5 m (3DBAG +1,41 m) en de vlakke modelvoet ligt 0,5 m daaronder. Het maaiveld wordt op vier punten rondom bemonsterd (Grote Markt, de straat ten noorden van het transept, het Klokhuisplein en de Oude Groenmarkt). Het model vervangt BAG-pand 0392100000065734; de Vishal tegen de noordgevel, de huisjes aan de Oude Groenmarkt en de buurpanden zijn eigen panden en blijven als PDOK-reconstructie staan. Het model meet inclusief steunberen en aanbouwen circa 118,5 bij 58,9 m en reikt 78,5 m boven het maaiveld.

Alle muren, goten, nokken en hellingen komen uit de 3DBAG (LoD2.2-dakvlakken) en de BAG-contour; de opstand, de steunberen, de nissen, de hoektorentjes en de geledingen van de vieringtoren zijn naar foto's geschat. Hoogtes in NAP:

- Schip en koor onder één zadeldak van 56 graden: goot +28,9 m (schip, 19,4 m breed) en +30 m (koor, 18 m breed), nok +43,2 m. De koorsluiting is driezijdig (halve zeshoek, straal 9 m) en afgeschild met vlakken van 58 graden.
- Zijbeuken van het schip: lessenaarsdak van 45 graden van +13,8 m aan de buitenmuur naar de hoge muur. Zijbeuken van het koor en de kooromgang: 48 graden van +14,3 m. De buitenmuur van de kooromgang is een halve achttienhoek (negen zijden van 20 graden, straal 17,4 m) met een steunbeer op elke hoek; het dak heeft vijf vlakke dakvlakken met hoekkepers, zoals 3DBAG en AHN ze zien.
- Transept: muren op x = -5 en 7,3 m, nok op x = 1,8 (+43,3 m), helling 62 graden; het oostelijke dakvlak van het zuidtransept loopt naast het koor door tot +21,5 m. Grote vensternis met roosvenster in beide topgevels, hoektorentjes tot +33 m met spitsen, traptorens in de binnenhoeken (+34,9 en +25,5 m).
- Kapellen: twee kapellen aan de noordkant van het koor onder schilddaken (nok +21,2 m, noordgoot +9,2 m), een derde met dwars zadeldak (+17,4 m); twee kapellen aan de zuidkant van het koor (+19,5 m) en twee langs de zuidkant van het schip (+22,6 en +15,4 m), alle met dwarse zadeldaken en vensternissen in de topgevels.
- Aanbouwen: lage lessenaar tegen het zuidtransept (+10,5 m), lage bouwdelen tussen en naast de zuidkapellen (+5 tot +8,5 m), het zuidportaal met steile topgevel (+12 m), de 69,6 graden gedraaide aanbouw aan de zuidoostkant (nok +12,8 m, goot +7,5 m, schild aan het zuideinde) met een laag tussenlid naar de kooromgang (+11,5 m) en de lage kapel tegen het zuidoostelijke omgangsvlak (+17 m).
- Westgevel: topgevel met groot venster en portaalnis, twee achtkante traptorens (straal 1,6 m) tot +35,6 m met spitsen tot +39,5 m.
- Steunberen (1 m breed) op de zijbeuken, de kooromgang en de kapelfronten; op de hoge muren van schip, koor en koorsluiting per travee een steunbeer met pinakel (+27 tot +30 m). Zeven traveeën in schip en koor; spitsboognissen (0,35 m diep) in zijbeuken, lichtbeuk, koorsluiting en kooromgang.
- Vieringtoren: vierkante voet van 8,4 m met uurwerken tot +48,5 m en hoekpinakels, vier achtkante geledingen (straal 3,9 naar 1,3 m) met galmgaten tot +69 m, spits tot +80 m (topje verbreed tot 0,45 m voor het printen).

Weggelaten (dunner dan 0,9 m of niet uit open bronnen af te leiden): maaswerk, de open bogen en de kroon van de lantaarn (als dichte geledingen gemodelleerd), pinakels op de topgevels, de wijzers en het kruis, kleine dakkapellen en de schoorstenen op de aanbouwen, de kleine knik van 0,5 m tussen de traveeën van de zijbeukdaken.

## Controle

De generator controleert `NoError`, een vlakke voet, één gesloten manifold en genus 0, en meldt het naar beneden gerichte oppervlak steiler dan 45 graden (alleen de bovenhelften van de ronde nissen, 5,6 m²). De catalogustest in de webshop controleert plaatsing, BAG-vervanging en het volume en de doorsneden na overhangopvulling op 1:1000. Het model is vanuit acht hoeken gerenderd en vergeleken met de luchtfoto en de foto's. Controleer op de kaart vooral de koorsluiting met de kooromgang, de kapellen aan weerszijden, de aansluiting van de Vishal en de huisjes aan de zuidkant, en de vieringtoren.

## Bronnen

- [3DBAG pand 0392100000065734](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0392100000065734): dakvlakken (goten, nokken, hellingen, kapellen, torentjes), maaiveld.
- PDOK BAG (contour: muren, steunberen, kapellen) en [PDOK luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0) (Actueel_orthoHR): plattegrond en dakvormen.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogtes van de vieringtoren (omhullende per hoogte, eerder model).
- [Rijksmonumentenregister 19264](https://monumentenregister.cultureelerfgoed.nl/monumenten/19264) en [Wikipedia](https://nl.wikipedia.org/wiki/Grote_of_Sint-Bavokerk): bouwgeschiedenis, vieringtoren ruim 78 m.
- [Wikimedia Commons, Grote Kerk, Haarlem](https://commons.wikimedia.org/wiki/Category:Grote_Kerk,_Haarlem): opstand, hoektorentjes, torengeledingen (onder andere `Grote-Kerk-Haarlem.jpg` en luchtfoto's uit het Noord-Hollands Archief, NL-HlmNHA 54004437 en 54016758).
