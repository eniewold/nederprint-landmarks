# Hotel New York — Rotterdam

Voormalig hoofdkantoor van de Holland-Amerika Lijn, Koninginnenhoofd 1. Model op 1:1000, opgebouwd uit het volledige BAG-grondplan, afzonderlijke gevel-/magazijnprisma's, dakvlakken, erkers, topgevels en twee achtkantige torenschachten met vierzijdig gewelfde kappen. Geen gestapelde hoogtelagen.

## Bronnen en maatvoering

- BAG `0599100000642881`, actuele BGT-panden en PDOK-luchtfoto; AHN DSM/DTM 0,5 m, geraadpleegd 9 oktober 2026. Alleen dit volledige pand wordt vervangen. Het naastgelegen Montevideo, World Port Center en kleine terreinbouwsels blijven staan.
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000642881), TU Delft/3D geoinformatie, CC BY 4.0: hoofdvlakken NAP 22,3–23,4 m, noordelijke nok 27,3 m en kapankers 38,8 m. De twee diepe lichtkokers staan op de orthofoto en hebben AHN-bodems rond 12 en 9,8 m.
- [RCE monument 513872](https://monumentenregister.cultureelerfgoed.nl/monumenten/513872): drie bouwlagen, vier bouwfasen, afgeschuinde fronthoeken, drie driezijdige erkers met topgevels en twee torens met vierzijdige koperen daken. [Eigen geschiedenis hotel](https://hotelnewyork.nl/over-hotel-new-york/geschiedenis-hotel-new-york/) noemt 38 m inclusief bekroning; dit model volgt de gemeten dakkappen en laat de masten weg.
- Schuine foto's: [noordoost, Ymblanter, 2024](https://commons.wikimedia.org/wiki/File:Rotterdam_Hotel_New_York_seen_from_the_northeast.jpg), [zuidwest, Ymblanter](https://commons.wikimedia.org/wiki/File:Rotterdam_Landverhuizersplein_and_Hotel_New_York_seen_from_the_southwest.jpg), [voorzijde DSCF3888](https://commons.wikimedia.org/wiki/File:Hotel_New_York_(Rotterdam)_DSCF3888.jpg) en [achterzijde DSCF4012](https://commons.wikimedia.org/wiki/File:Achterkant_Hotel_New_York_(Rotterdam)_DSCF4012.jpg). Foto's als vormreferentie, niet in het model verwerkt.

Oorsprong RD `[92885,435458]`, lokale x-as 38,5°. Maaiveld NAP 3,45 m uit AHN, onderkant 0,4 m onder dat maaiveld. Modelmaat 59,66 × 42,74 × 35,75 m, op 1:1000 evenveel millimeters.

## Geschat en vereenvoudigd

Kapwelving en afplatting van de vier zijden, klokdiameter, vensterreeks, ingangshoogtes, erkerconsoles en topgeveldetails zijn uit foto's geschat. De kappen zijn één doorlopende gesloten huid; de ronde wijzerplaten zijn blinde nissen. Kleine dakhellingen zijn vlak gemaakt. De drie erkers krijgen schuine, dragende consoles. Beeldhouwwerk, tekst, fijne balkonhekjes, vlaggenmasten, windvaan en dakinstallaties zijn weggelaten. Sommige vensters zijn minder diep doordat de BAG-gevel een lichte knik heeft; controleer het herkenbare gevelritme op de kaart.

## Controle voor rapportage

- `node scripts/generate-hotel-new-york.mjs`: GLB, JSON en STL op 1:1000; `NoError`, één verbonden onderdeel, genus 5, 8.004 driehoeken, 39.793,2 m³. De doorlopende schachten en de kap blijven verbonden met de hoofdvorm.
- Vier renders op −35°, 55°, 145° en 235°, elk naast dezelfde PDOK-reconstructie, vergeleken met bovenstaande schuine foto's. Grondplan, beide torenposities, lichtkokers en dakhoogtes sluiten aan; gebogen kappen en gevels vervangen de kale facetten van PDOK. Westelijke erkers en zichtbare kloknissen zijn na de eerste renders gecorrigeerd.
- [Controle-URL](http://127.0.0.1:3037/kaart/51.90408/4.48428/350/1x1/0): correcte ligging en rotatie, aansluiting op straat, beide lichtkokers en behoud van de hoogbouw ernaast gecontroleerd.
- Echte preview-export via de webshop, RD `[92805,435378,92965,435538]`: 160 × 160 mm op 1:1000, basis 1 mm, z-factor 1, geen bomen, 45° overhanginstelling, 123 objecten/60.840 driehoeken/3 printonderdelen; complete hotelvorm binnen de uitsnede. Omringende hoogbouw bepaalt de totale exporthoogte van 144,2 mm.
- Voorbereiding met en zonder 45° overhanginvulling geeft hetzelfde volume 41.527,2393 mm³ voor het hotel; beide `NoError`. Geen los toegevoegde steunen nodig.
- `tests/landmark-models.test.ts` controleert complete vervanging, lokale contour, beide kaphoogtes/welving, lichtkokerbodems, erkers en magazijn. Catalogus/API-tests plus lokale exportcontrole: 294 geslaagd.

Renderbeelden, brongegevens en `preview.3mf` staan in de afzonderlijke werkomgeving onder `hotel-new-york/`. Ze horen niet bij de catalogusassets.

## Genereren

`node scripts/generate-hotel-new-york.mjs` (standaard 1:1000), of `--scale 1000 --out models`. Controleer op de kaart de twee klokkentorens, de drie erkers/topgevels en de aansluiting van de achtergevel op de hoogbouw.
