# Koepelgevangenis (Haarlem)

Vereenvoudiging van de gerestaureerde rondbouw, opgebouwd uit een doorlopend omwentelingsprofiel, prisma's en schuine vlakken. Geen gestapelde DSM-hoogtelagen. Generator: `scripts/generate-koepel-haarlem.mjs`; voorbeeld voor deze rij: `generate-evoluon.mjs`.

## Bestanden en plaatsing

- `koepel-haarlem.glb`: meters, Y omhoog, één gesloten `building:`-node.
- `koepel-haarlem.json`: RD-oorsprong `[104535.491, 488662.722]`, +X op −12,5° in RD. Hoofdtoegang aan de westzijde.
- `koepel-haarlem-1-1000.stl`: millimeters, Z omhoog, vlakke voet op −0,3 m; één verbonden volume.

Alleen BAG-pand `0392100000039278` wordt vervangen. De afzonderlijke westelijke administratie (`0392100000092976`) en zuidelijke vleugel (`0392100000039281`) blijven PDOK. De actuele BAG/BGT-contour levert het cirkelhart, diameter 62,26 m en de twee uitspringende entreepilasters. Het AHN levert maaiveld NAP +0,47745 m, aankapping, binnenring, doorlopend koepelprofiel en hoogste punt NAP +36,161243 m. Grondbemonstering gebeurt op drie punten aan de zuidkant van de rondbouw; voet en portaal sluiten in kaart en export aan.

## Bouwdelen en vereenvoudigingen

Vier cellagen met zestig geveltravees/lisenen, drie gedragen gevelbanden, buitenmuur, lage aankapping, verhoogde binnenring met twintig ventilatienissen, koepel met dertig hoofdroeven en een vijftienzijdige lichtlantaarn met tentdak en piron. De twee entreepilasters en de westelijke hoofdpoort zijn afzonderlijk benoemde bouwdelen in de generator en samengevoegd voor een stevige print.

Raamvormen, raamhoogtes, westportaal en ventilatiekapjes zijn uit foto's geschat en regelmatig gemaakt; vensters zijn blinde nissen van circa 0,35 m. De dertig dakroeven zijn verbreed tot 0,9 m. De 28 historische daklichten zijn vereenvoudigd tot veertien paneelgroepen zoals de huidige ortho toont; de individuele ruiten zijn weggelaten. Fijne voegen, kozijnroeden en de inmiddels verwijderde oudere dakpijpen zijn weggelaten. Hoogtes van nokken en profielknikken zijn niet afgerond op hoogtelagen. De lantaarn heeft de vijftien zijden uit de monumentbeschrijving.

## Controle (9 oktober 2026)

Generator: `NoError`, één verbonden deel, genus 0, 27.854 driehoeken; STL circa 63,4 × 65,7 × 35,984 mm op 1:1000. Alle vrij dragende dakroeven zijn minstens 0,9 mm breed op printschaal; reliëfs blijven ingebed en er zijn geen vrije horizontale overspanningen.

Catalogus/API-suite gecontroleerd: 289 overige tests geslaagd; na aanscherping van de nieuwe test slaagt ook de gerichte Haarlem-test. Die controleert plaatsing, uitsluitend de rondbouw als vervangpand, behoud van de losse administratie, alle zestig travees, binnenring en vijftienzijdige lantaarn.

Vier GLB-renders op −35°, 55°, 145° en 235° naast de echte PDOK-reconstructie bekeken, met Commons-zijaanzichten en de schuine restauratiefoto van Buro Van Stigt. De PDOK-koepel heeft onregelmatige dakvlakken en mist gevelreliëf; het model voegt de binnenring, dakroeven, lichtgroepen en cellagen toe. Op de kaart zijn positie, oriëntatie, kleur en maaiveldaansluiting bekeken en is de landmarkschakelaar uit/aan gecontroleerd: het oorspronkelijke pand verschijnt en verdwijnt.

Echte `createModelBundle`-export, uitsnede RD `[104435,488560,104635,488760]`, 200 × 200 mm op 1:1000, grondplaat 1 mm, hoogteversterking 1: 638 objecten, 137.448 driehoeken, hoogte 37,2 mm. Volledige 3MF-preview bekeken; de hele rondbouw past ruim in de uitsnede. Aanvullende Manifold-printcontrole met de exportvoorbereiding op vlak maaiveld geeft bij zowel 89° als 45° `NoError`, volume 71.752,274 mm³; geen extra steunvolume bij 45°. Dit is een geometrische controle, geen fysieke proefprint. Renders en tijdelijke export staan buiten beide repo's in de sessiescratchpad.

[Controlekaart](http://127.0.0.1:3037/kaart/52.38361/4.64611/350/1x1/0). Kijk vooral naar de binnenring onder de koepel, de lichtgroepen, westpoort en de voet bij de losse bijgebouwen.

## Bronnen

- PDOK BAG/BGT, AHN DSM/DTM 0,5 m en Actueel_orthoHR, opgehaald 9 oktober 2026. Analysebbox `[104424.24,488554.56,104664.24,488794.56]`; actuele BGT-versie van 18 december 2023.
- [Rijksmonumentenregister 513315](https://monumentenregister.cultureelerfgoed.nl/monumenten/513315): zestig travees, vier cellagen, twintig ventilatieopeningen, vijftienzijdige lantaarn, dertig halfspanten en 28 daklichten.
- [Buro Van Stigt, restauratie De Koepel](https://burovanstigt.nl/de-koepel/): nieuwe toestand, schuine foto uit 2022.
- [Commons: Close-up Koepel Haarlem](https://commons.wikimedia.org/wiki/File:Close-up_Koepel_Haarlem.jpg) en [Haarlem-Koepelgevangenis-06](https://commons.wikimedia.org/wiki/File:Haarlem-Koepelgevangenis-06.jpg): zuid- en zijaanzicht, ook de oorspronkelijke leidingen. Alleen als visuele referentie gebruikt, geen fototextuur overgenomen.
