# Watertoren Poeldijk (Poeldijk)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-poeldijk.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: het frame is een afgeknotte piramide waar per vak twee doorgangen met een spitse top doorheen zijn gesneden, het pomphuisje een prisma met een deurnis en het reservoir een vierkant blok op het platform.

De watertoren hoort bij tuinderij "Kaas en Brood" in Poeldijk (Westland) en dient als besproeiingsinstallatie voor de kassen (Wikipedia). Bouwjaar, hoogte en inhoud zijn onbekend; op het reservoir staat "Tuinderij Kaas en Brood, sedert 1895". Een taps stalen vakwerkframe van vier hoekstijlen met kruisende trekstangen en een ring draagt een vierkant stalen reservoir; onder in het frame staat een houten pomphuisje met een plat dak en een deur naar het erf. De toren staat er nog: het AHN en de luchtfoto's van 2022, 2024 en 2026 tonen het reservoir, en de BAG kent hem sinds 2025 als pand.

Het model vervangt BAG-pand 1783100000810342 (bouwjaar 2025): een vierkant van 2,15 m met randen op 47 graden, de voetafdruk van het reservoir. PDOK maakt er een blok van 7,07 m hoog van. De kas (pand 1783100000021037) ligt 3,3 m noordwestelijk, evenwijdig aan de toren, en blijft als PDOK-pand staan.

## Bestanden

- `watertoren-poeldijk.glb`: één node, `building:watertoren-frame-pomphuisje-en-reservoir`.
- `watertoren-poeldijk.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen pand.
- `watertoren-poeldijk-1-1000.stl`: het model op 1:1000 (4,7 × 4,7 × 7,3 mm).

## Oorsprong en oriëntatie

RD-oorsprong [74436.66, 449131.73] (52,024673 N, 4,213360 O): het hart van BAG-pand 1783100000810342, op het erf (AHN-DTM NAP +0,35). Het vlakke reservoirdeksel in het AHN-DSM 0,5 m (NAP +7,4 à +7,5, zwaartepunt (74436,75; 449131,25)) valt daar binnen een halve meter op. De coördinaat op Wikipedia ligt 7,7 m oostelijker, in de sloot.

De lokale X-as staat 47 graden linksom van RD-oost (`xAxis` [0.68200, 0.73135]), evenwijdig aan de BAG-randen van de toren (47,1 graden) en de kas (46,8 graden). +Y wijst naar de kas (noordwest), -Y naar het erf (zuidoost), waar de deur van het pomphuisje zit en vanwaar de foto is genomen.

`groundSamplePoints` liggen op 3 m in de vier asrichtingen, net buiten de voet van het frame. `groundHeight` 43,92 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten: +X 43,969, -X 43,941, +Y 43,921 aan de kaskant en -Y 44,003 op het erf, gemeten op 2026-11-07. Onder het hart ligt het PDOK-terrein op 43,886. `groundOffsetMetres` is −0,1.

## Onderdelen

Maten boven het maaiveld (NAP +0,35).

- Frame: een afgeknotte piramide van 4,6 m in het vierkant op het maaiveld tot 2,4 m onder het reservoir op 5,8 m, met vier hoekstijlen van 0,9 m (10,7 graden uit het lood). Beide vakken zijn open: per vak lopen twee doorgangen dwars door het frame, met zijden langs de binnenkant van de stijlen en een top onder 50 graden (kruisgewelf). Het onderste vak loopt van het maaiveld tot 3,0 m, met de top op 3,99 m; het bovenste van 4,25 tot 5,0 m, met de top op 5,54 m. Daartussen blijft de ring (3,99 tot 4,25 m), en daarboven het platform. Onder het maaiveld blijft een drempel van 0,3 m in het terrein.
- Pomphuisje: 2,86 m in het vierkant in het onderste vak, plat dak op 2,4 m, met een deurnis van 0,9 m breed en 0,3 m diep tot 1,95 m in de gevel naar het erf (-Y). Het plafond van de nis loopt onder 49 graden.
- Reservoir: 2,15 m in het vierkant (BAG), van 5,8 tot 7,05 m, op het platform van 2,4 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Poeldijk)): besproeiingsinstallatie van de kassen van tuinderij Kaas en Brood; bouwjaar, hoogte en inhoud onbekend.
- Foto op [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Poeldijk_-_watertoren_tuinderij_Kaas_en_Brood.jpg) (Quistnix, 13 februari 2009, vanaf het erf in het zuidoosten, frontaal op een zijde van het frame). Het is de enige foto op Commons. Daaruit komen het frame met vier stijlen, trekstangen en een ring, het reservoir met opschrift, het pomphuisje met deur en plat dak, de ladder en de vlaggenmast.
- PDOK BAG-WFS (2026-11-07): pand 1783100000810342, bouwjaar 2025, 2,15 × 2,15 m op 47 graden; de kas 1783100000021037 met een rand op 46,8 graden.
- PDOK-gebouwtegels (2026-11-07): het pand als blok van ellipsoïde 44,0 tot 51,07.
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-07): reservoirdeksel NAP +7,4 à +7,5, erf NAP +0,3 à +0,4.
- PDOK-luchtfoto's (Actueel_orthoHR, 2022, 2024 en 2026): het reservoir als licht vierkant met de randen evenwijdig aan de kas, en de voet van het frame als vierkant van circa 4,8 m.

## Geschat en weggelaten

Geschat:

- De hoogte (7,05 m) komt uit het AHN en het PDOK-blok; de breedte van het reservoir uit de BAG. De rest komt uit de ene foto, geschaald op de hoogte uit het AHN: het reservoir is 1,25 m hoog, het frame onderaan twee keer zo breed als bovenaan (4,6 en 2,4 m, op de luchtfoto circa 4,8 m), de ring op circa 4,0 m en het pomphuisje 2,4 m hoog (deur van circa 2 m als maat).
- Het pomphuisje is in het echt circa 2,4 m breed. Hier is het 2,86 m, zodat het het onderste vak tussen de stijlen vult en er geen spleten van een paar decimeter blijven. Of het pomphuisje er nog staat, is niet te zien: het reservoir dekt het af in het AHN en op de luchtfoto's.
- De stijlen zijn in het echt hoekprofielen van circa 0,15 m en hier 0,9 m, zodat ze op 1:1000 printbaar zijn. De vakken worden daardoor smaller, en de ring en het platform zijn dichte platen.

Weggelaten (dunner dan 0,9 m): de kruisende trekstangen in de vakken, de vlaggenmast (circa 9,4 m hoog, aan de noordoostzijde van het reservoir), de ladder, de leuning van het platform, het opschrift op het reservoir en het hek rond de toren. De kas, het woonhuis en het erf staan als PDOK-reconstructie op de kaart.

## Controle

Eén gesloten NoError-node, één component, genus 6 (de twee kruisende doorgangen in elk van de twee vakken). In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (uitsnede van 80 m, steunmethode v2, 45 graden) bevat het model zonder ondersteuningsobject en zonder het PDOK-blok van pand 1783100000810342; de kas blijft staan. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/52.02467/4.21336/200/1x1/0
