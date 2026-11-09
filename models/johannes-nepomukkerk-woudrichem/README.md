# Johannes Nepomukkerk (Woudrichem)

Neoclassicistische zaalkerk uit 1838 met zadeldak, lager achtergebouw en koepeldakruiter aan Vissersdijk 15, rijksmonument 39587.

## Bestanden

- `johannes-nepomukkerk-woudrichem.glb` en `.json`: kaartmodel in meters, inclusief BAG-vervanging.
- `johannes-nepomukkerk-woudrichem-1-100.stl` en `-1-1000.stl`: losse print in millimeters.
- Generator: `scripts/generate-johannes-nepomukkerk-woudrichem.mjs`.

## Ligging en vorm

Oorsprong RD [128645.095, 425462.715] ligt midden op de zuidelijke straatgevel; de lokale X-as [0.8532, -0.5216] loopt langs de voorgevel. Maaiveld is circa NAP +3,14 m. Vervangen BAG-pand: 0874100000001296. BAG en AHN5 geven het grondvlak, de helling en de nokhoogte (circa NAP +16,0 m), de achterbouw en de hoogte van de dakruiter (circa NAP +22,1 m). De 3D BAG laat onregelmatigheden bij het torentje zien; foto's tonen de eigenlijke achthoekige lantaarn met koepel.

Het model bestaat uit de kerkzaal met zadeldak, voorfronton, steunberen langs beide gevels, lagere achterbouw met zijvleugels en de achtzijdige dakruiter. Blind uitgevoerde uitsparingen duiden de deuropening, grote frontnis, zijvensters en galmgaten aan. De foto bepaalde de regelmaat en verdeling; nisafmetingen en exacte lantaarnvorm zijn geschat. Beeld, kruis, kozijnen en dunne detaillering zijn kleiner dan 0,9 m en daarom weggelaten; de galmgaten zijn voor 1:1000 gesloten nissen.

## Controle

De generator controleert een gesloten enkelvoudig volume; de gerichte test controleert catalogus, plaatsing en printbaarheid met 45 graden zonder betekenisvolle aanvulling. Er zijn volledige preview-exports met en zonder landmark en een vergelijking van vier richtingen met de PDOK-reconstructie en foto's gemaakt. De kaart moet nog in de hoofdsessie worden gecontroleerd.

## Bronnen

- [3D BAG, pand 0874100000001296](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0874100000001296), voetafdruk en dakvlakken.
- [AHN](https://www.ahn.nl/dataroom), AHN5 DSM voor hoogte.
- [Rijksmonumentenregister 39587](https://monumentenregister.cultureelerfgoed.nl/monumenten/39587), naam en bouwbeschrijving.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Kerk_van_Johannes_Nepomuk_(Woudrichem)), voorgevel en zij- en achteraanzicht.
