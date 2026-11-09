# Steentjeskerk (Eindhoven)

Driebeukige basilicale kerk in Kunradersteen van Hubert van Groenendael (Sint-Antonius van Paduakerk, Strijp, 1917-1919, rijksmonument 518710). Ze heeft een vierkante westtoren met tentdak aan de noordzijde van de voorgevel, een voorportaal met lessenaarsdak, een doopkapel met tentdak aan de zuidzijde en een halfronde apsis met een koperen halfkegeldak in het oosten. Het model vervangt BAG-pand 0772100000288003. De pastorie ten zuidwesten (pand 0772100001013755) blijft PDOK.

## Bestanden en plaatsing

- `steentjeskerk-eindhoven.glb`: gesloten model in meters met node `building:kerk`.
- `steentjeskerk-eindhoven.json`: RD-oorsprong (160631,88, 383381,29) op de nok van het middenschip, X-as `[0.99572, 0.09237]` (nokrichting 5,3 graden, naar de apsis), maaiveldreferentie NAP +17,143 m (3DBAG).
- `steentjeskerk-eindhoven-1-100.stl` en `steentjeskerk-eindhoven-1-1000.stl`: afdrukmodellen.
- `scripts/generate-steentjeskerk-eindhoven.mjs`: reproduceert het model uit bouwdelen en dakvlakken.

## Onderdelen

- Middenschip (muren op 6,75 m van de as) met zadeldak: nok 19,4 m boven maaiveld, helling 0,615. Naar het westen loopt een schild met helling 0,95, naar het oosten een schild met helling 0,83. Op het westschild staat een dakkapel, op de nok aan de oostzijde een schoorsteen tot 22,4 m.
- Zijbeuken met lessenaarsdak: 10,55 m aan het schip, helling 0,59, buitenmuren op 11,65 m (noord) en 10,95 m (zuid).
- Negen traveeën met lisenen op de traveegrenzen en rondboogvensters in lichtbeuk en zijbeuken, als spitse blinde nissen.
- Halfronde apsis (straal 5,27 m, muur tot 10,65 m) met een halfkegeldak van tien vlakken tot 14,4 m, vijf vensters en een blinde arcade van elf bogen.
- Westtoren van 5,4 m in het vierkant, die in vijf geledingen versmalt: plint, schacht, vensterzone, wijzerplaatzone en galmzone met dubbele galmgaten. Daarboven een kroonlijst op een kraag van 45 graden en een tentdak tot 33,55 m. Tegen de west- en noordzijde staan ondiepe absidevormige uitbouwen.
- Voorportaal met lessenaarsdak (8,3 naar 5,5 m) en een arcade van vijf bogen. De doopkapel is een blok van twee lagen met een tentdak (goot 10 m, top 12,2 m). In de westgevel van het schip zitten twee vensters en twee beeldnissen.
- Twee traptorentjes naast de apsis met tentdak (12,4 m). Langs de zijbeuken lopen platte sacristiestroken op 8 m. Aan de zuidoostzijde staan een lage platte sacristie en een aanbouw met zadeldak (nok 9,2 m) en een schild naar het oosten.

## Maten en vereenvoudiging

De BAG-contour levert de plattegrond, de apsisstraal (cirkelfit) en de bogen van de torenuitbouwen. Het AHN-DSM (0,5 m) is gelezen in een stelsel langs de nok: per blok van 6 m zijn beide dakvlakken gefit (nok NAP +36,54 m, helling 0,615 aan beide zijden, nokrichting stabiel binnen 0,2 graden). Daarnaast leverde het DSM de schilden, het lessenaarsdak van de zijbeuken, het apsisdak, de torentop (NAP +50,71 m), de schoorsteen en de hoogtes van de aanbouwen.

Geschat uit foto's: de hoogtes van de torengeledingen en de kroonlijst, de goothoogte van de doopkapel en de traptorentjes, de hoogte van de torenuitbouwen, en de plaats en maat van vensters, arcades en lisenen.

Weggelaten:
- de kruisen op toren en westschild en de wijzerplaten (reliëf onder 0,3 m);
- de beelden in de westgevel en de oculi in toren en oostgevels (kleiner dan 0,9 m);
- het overstek van de daken (vrije overhang).

## Controle

Eén gesloten manifold met genus 0. De gerichte test controleert de plaatsing, de pandvervanging, de hoogte en de 45-graden-overhangopvulling op 1:1000 (steunvolume vrijwel nul). De kerk is van vier kanten vergeleken met de 3DBAG-reconstructie (LoD2.2) en met foto's van de westgevel, de noordwestzijde en de zuidoostzijde met de apsis.

## Bronnen

- [Wikipedia: Steentjeskerk](https://nl.wikipedia.org/wiki/Steentjeskerk)
- [Rijksmonumentenregister 518710](https://monumentenregister.cultureelerfgoed.nl/monumenten/518710)
- [3DBAG pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100000288003)
- [AHN via PDOK WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0)
- [Wikimedia Commons: Steentjeskerk (Eindhoven)](https://commons.wikimedia.org/wiki/Category:Steentjeskerk_(Eindhoven))
