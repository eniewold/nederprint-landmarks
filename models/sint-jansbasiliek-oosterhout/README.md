# Sint-Jansbasiliek (Oosterhout)

Vereenvoudigd gesloten model van de gotische kruiskerk met de nooit voltooide westtoren, traveedaken van de zijbeuken, dwarsschip, koor, traptoren en dakruiter. Alle daken zijn uit vlakke dakdelen opgebouwd.

- `sint-jansbasiliek-oosterhout.glb`: één node `building:kerk` in meters.
- `sint-jansbasiliek-oosterhout.json`: plaatsing en vervanging van kerk `0826100000016868` en toren `0826100000016867`.
- `sint-jansbasiliek-oosterhout-1-1000.stl`: Z omhoog, circa 72,8 × 36,8 × 47,3 mm.
- Genereren: `node scripts/generate-sint-jansbasiliek-oosterhout.mjs --components`.

De oorsprong is RD (118561,5, 406384,4) op het hart van de toren; +X [0,984, −0,178] volgt het schip richting koor. De onderzijde ligt 0,5 m onder maaiveld; de offset is −0,3 m. BAG geeft NAP +4,953 m als maaiveld en circa NAP +25,7 m voor de nok. Het AHN DSM meet op de torenkap tot NAP +51,76 m. De toren is nooit voltooid en heeft een lage kap, geen grote torenspits.

Vorm en exacte maten van torenberen, vensternissen, koor, traptoren en dakruiter zijn op grond van foto's geschat. De open lantaarn van de dakruiter is voor print vereenvoudigd tot een gesloten kern en de bol vergroot. De ornamenten, wijzerplaat en maaswerk zijn weggelaten. De noordelijke bijbouw is vereenvoudigd; de traveedaken en vensters zijn regelmatig gemaakt.

De generator controleert geslotenheid, Float32-rondgang en overhang. De geometrie is één volume, genus 0; steuncontrole op 45 graden geeft vrijwel gelijk volume en gelijke doorsneden. Een volledige 150 × 150 m uitsnede is met en zonder landmark geëxporteerd. Vier aanzichten zijn vergeleken met de PDOK-gebouwen en foto’s; fotohoeken zijn benaderend.

Bronnen: [3D BAG kerk](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0826100000016868), BAG-panden 0826100000016867 en 0826100000016868, [AHN DSM PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0), [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/31673), [Open Monumentendag](https://www.openmonumentendag.nl/monument/sint-jansbasiliek/), [foto's via Proef Oosterhout](https://www.cityappoosterhout.nl/locaties/sint-jansbasiliek--2-56abb6a9f6bf5072258b4778).


Aanvullende gevelreferenties: [Wikimedia Commons, buitenzijde](https://commons.wikimedia.org/wiki/Category:Exterior_of_Sint-Jansbasiliek_(Oosterhout)); noord- en zuidoostfoto uit 2017, noordoostfoto historisch.
