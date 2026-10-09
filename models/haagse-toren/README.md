# De Haagse Toren (Strijkijzer) (Den Haag)

L-vormige woontoren met twee ronde glazen hoeken, twee glazen serres en een driehoekige kroon. Benoemde prisma's, convexe bouwdelen en planvergelijkingen; geen gestapelde DSM-lagen. Per-rij voorbeeld `generate-evoluon.mjs` geheel gelezen. Reproductie: `node scripts/generate-haagse-toren.mjs`.

## Bestanden en plaatsing

- `haagse-toren.glb`: meters, Y omhoog, één gesloten `building:`-node.
- `haagse-toren.json`: RD `[82121.46,454232.43]`, +X −10,47° in RD langs de zuidelijke gevel; +Y langs de westelijke gevel naar de noordelijke kop.
- `haagse-toren-1-1000.stl`: millimeters, Z omhoog, circa 37,21 × 41,90 × 133,20 mm, vlakke voet.

Vervangt uitsluitend BAG `0518100000225439`; The Y en andere buurpanden blijven staan. Rechte gevelrichtingen en ronde voet komen uit BAG, getoetst op BGT. De luchtfoto toont de kroon scheef buiten de voet door perspectief: die verplaatsing is niet overgenomen. Maaiveld rond NAP +0,9 m; drie expliciete straatpunten, voet −1,2 m om ook de lagere straten te verankeren.

## Maten, schattingen en printvereenvoudiging

De bovenbouw heeft de L-vorm uit de architectbeschrijving en foto's. BAG/3D BAG en AHN geven het terras op NAP +123,73 m, dakvlakken rond +127,805 m, kroon +130,40 m en hoekpunten +132,90 m. Dit past bij de gepubliceerde hoogte van circa 132 m boven straat. Losse AHN-uitschieters tot +140 m zijn niet als bouwhoogte gebruikt. De tweede serre eindigt volgens 3D BAG op +94,86 m; eerste serre tot +51,80 m en onderste grenzen +33,46/+76,48 m, publieke bovenlagen vanaf +115,6 m zijn deels uit foto's geschat.

Gevelritme is regelmatig gemaakt: 38 woonlagen op ongeveer 3 m steek, negen en acht vensterbaaien op de twee vlakke buitengevels, vensternissen 0,35 m diep. De ronde glashoeken krijgen horizontale voegen en verticale stijlen als blind reliëf. Binnengevelvensters achter serres en hun schuine onderzijde zijn weggelaten om interne holtes te vermijden. Entrees zijn blinde nissen. Reclame, interieur, dunne balkonhekken, metalen paneelprofielen en antennes ontbreken.

De echte serres en top overspannen vrij tussen twee vleugels. Op 1:1000 lopen hun onderzijden vanuit de vleugels onder meer dan 50° schuin omhoog. Daardoor zijn de openingen kleiner en driehoekiger dan werkelijk; deze invulling behoort tot het printmodel en is geen los steunmateriaal. De open vakwerkkroon is sterk vereenvoudigd tot een dikke, gedragen rand met spitse doorgangen en brede pijlers. Boven elke doorgang loopt de opening meer dan 50° naar een punt zodat de dakrand gedragen blijft. Hoeksectoren blijven massiever. De open driehoekige dakruimte blijft zichtbaar. Kroonbreedte, doorgangen, staalritme en glasvoegen zijn uit foto's geschat; dit is geen exacte staalconstructie.

## Controle (9 oktober 2026)

Generator `NoError`, één verbonden deel, genus 31 door de echte kroondoorgangen, 36.228 driehoeken, circa 95.653,5 m³. Geen losse onderdelen of ingesloten negatieve volumes. Catalogus-, API- en volledige-exportcontrole na de laatste wijziging: 293 tests geslaagd. De nieuwe test controleert beide serres, ronde kop, kroon, 38 vensterrijen en het vervangpand in een uitsnede.

Vier volledige GLB-renders naast PDOK op −35°, 55°, 145° en 235° vergeleken met schuine Commons-foto's vanaf plein, Hollands Spoor en Rijswijkseweg. −35°/235° voegen de regelmatige vensters, glasvoegen en open kroon toe aan PDOK's vlakke buitengevels; 55°/145° tonen de twee serres, L-ruimte en hun printbare onderzijden. PDOK geeft de buitencontour maar vult de open gevelzijde en reconstrueert de kroon onregelmatig. De kaart bevestigt richting, kleur, maaiveld en het uit/aan verdwijnen van het oorspronkelijke PDOK-pand.

Werkelijke `createModelBundle`-preview-export op 1:1000, RD `[82051,454162,82191,454302]`, 140 × 140 mm, grondplaat 1 mm, hoogteversterking 1; het hele landmark valt in de uitsnede. 251 objecten, 347.470 driehoeken en 134,4 mm totale hoogte, met terrein en buren visueel bekeken in de 3MF-preview. Overhangcontrole na exportvoorbereiding: bij 89° en 45° beide `NoError`, 95.694,513 mm³; geen extra steunvolume bij 45°. De volledige controle duurde circa 129 s: de vele kroondoorgangen maken de export merkbaar zwaarder. Geometrisch gecontroleerd, geen fysieke proefprint. Bronbestanden en controlebeelden blijven buiten de repo's.

[Controlekaart](http://127.0.0.1:3037/kaart/52.07139/4.32417/350/1x1/0): controleer de twee serres, de massievere printbare kroon en de aansluiting op straat naast The Y.

## Bronnen

- PDOK BAG `0518100000225439`, BGT, AHN DSM/DTM 0,5 m en Actueel_orthoHR; 9 oktober 2026.
- [3D BAG, TU Delft/3D geoinformatie](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000225439), CC BY 4.0: dakhoogtes en serreankers, regelmatig herbouwd, bron ook bij generatorconstanten.
- [AAARCHITECTEN](https://aaarchitecten.nl/projecten/het-strijkijzer-den-haag/): driehoekige locatie, vleugels, serre, publieke top en hoogte 132 m; [Boele & van Eesteren](https://www.boele.nl/nl/projecten/het-strijkijzer): gebouwvorm en bouwcontext.
- Commons: [Strijkijzer 1](https://commons.wikimedia.org/wiki/File:Den_Haag_Het_Strijkijzer_1.jpg), [5](https://commons.wikimedia.org/wiki/File:Den_Haag_Het_Strijkijzer_5.jpg), [7](https://commons.wikimedia.org/wiki/File:Den_Haag_Het_Strijkijzer_7.jpg) en [Aussichtsterrasse 1](https://commons.wikimedia.org/wiki/File:Den_Haag_Het_Strijkijzer_Aussichtsterrasse_1.jpg), Zairon (2015); [vanaf HS](https://commons.wikimedia.org/wiki/File:Het_Strijkijzer_vanaf_HS.jpg), Michiel1972 (2007); [The Hague 2015](https://commons.wikimedia.org/wiki/File:Het_Strijkijzer_The_Hague_2015.JPG), Steven Lek. Visuele referenties, geen fototexturen.
