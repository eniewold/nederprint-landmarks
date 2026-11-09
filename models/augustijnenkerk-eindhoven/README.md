# Augustijnenkerk (Eindhoven)

Neogotische driebeukige kruiskerk van P.J. Bekkers en J.P.I. Hegener (Paterskerk of Heilig Hartkerk, Tramstraat, 1897-1898, rijksmonument 518826), met een zeshoekige westtoren met de punt naar het plein, een lage zeshoekige doopkapel op de zuidwesthoek, een dakruiter op de viering en een koor met driezijdige sluiting. Het model vervangt BAG-pand 0772100000285555; het aangrenzende klooster (pand 0772100001009210) blijft PDOK.

## Bestanden en plaatsing

- `augustijnenkerk-eindhoven.glb`: gesloten model in meters met node `building:kerk`.
- `augustijnenkerk-eindhoven.json`: RD-oorsprong (161738, 383231) in de viering op de nokas, X-as `[0.9063, -0.4226]` (nokrichting -25 graden, naar het koor), maaiveldreferentie NAP +15,942 m (3DBAG).
- `augustijnenkerk-eindhoven-1-100.stl` en `augustijnenkerk-eindhoven-1-1000.stl`: afdrukmodellen.
- `scripts/generate-augustijnenkerk-eindhoven.mjs`: reproduceert het model uit bouwdelen en dakvlakken.

## Onderdelen

- Middenschip, dwarsschip en koor als prisma's met zadeldaken (nok 24,85 m boven maaiveld, helling 1,75 op schip en koor, 1,62 op het dwarsschip); dwarsschipgevels als topgevel.
- Koorsluiting van een regelmatige achthoek (apothema 6 m) met drie schilddakvlakken die op de nok uitkomen.
- Zijbeuken met lessenaarsdak (11,0 naar 9,3 m), laag biechtstoelenstrookje aan de noordzijde, steunberen met afgeschuinde top.
- Kapellen naast het koor: twee zadeldaken dwars op de as met afgewolfde buiteneinden aan de noordzijde, een zadeldak en een lage schilddakkapel aan de zuidzijde, lage aanbouw met traptoren aan de noordoosthoek, traptoren aan de zuidoosthoek.
- Twee lage westkapellen met veelhoekige sluiting naast het schip.
- Zeshoekige toren (omgeschreven straal 3,8 m, goot 30,5 m) met zes wijzerplaatgevels, zes hoekpinakels, zeshoekige naald tot 60,9 m en het Heilig Hartbeeld als staaf tot 65 m; achtkante traptoren met naald (30 m) aan de noordzijde.
- Doopkapel als zeshoek met tentdak, dichte lantaarn en naald (25 m) en een achtkant torentje (22 m) ernaast.
- Dakruiter op de viering tot 40,5 m, zes dakkapellen op schip en koor, gevelpinakel op de westtop.
- Portalen, vensters, galmgaten en transeptvensters als blinde spitse nissen van 0,4 m.

## Maten en vereenvoudiging

BAG-contour en AHN-DSM (0,5 m, in een stelsel langs de nok) geven de plattegrond, nokken en goten: nok NAP +40,8 m, dakruiter circa NAP +56,4 m, torennaald NAP +76,5 m (60,5 m boven maaiveld); Wikipedia noemt 66 m tot het beeld. De zeshoek van de toren volgt uit de schuine zijden van de BAG-contour en de afnemende straal van de naald uit het DSM. Geschat uit foto's en de bouwtekening: torengoot en hoogte van de wijzerplaatgevels, kapelhoogtes en dakvormen naast het koor, hoogte van traptorens, doopkapellantaarn en naalden (die het DSM door de leien grotendeels mist), en de plaats en maat van vensters en dakkapellen. Weggelaten: de dakkapellen halverwege de torennaald (onder 0,9 m en vrij hangend), de armen van het beeld, kruisen, maaswerk en de beelden in de westgevel.

## Controle

Eén gesloten manifold met genus 0. De gerichte test controleert de plaatsing, pandvervanging, hoogte en de 45-graden-overhangopvulling op 1:1000 (steunvolume vrijwel nul). De kerk is van vier kanten vergeleken met de 3DBAG-reconstructie (LoD2.2) en met foto's van de westgevel, de zuidwestzijde, de zuidoostzijde en het koor.

## Bronnen

- [Wikipedia: Augustijnenkerk (Eindhoven)](https://nl.wikipedia.org/wiki/Augustijnenkerk_(Eindhoven))
- [Rijksmonumentenregister 518826](https://monumentenregister.cultureelerfgoed.nl/monumenten/518826)
- [3DBAG pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100000285555)
- [AHN via PDOK WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0)
- [Wikimedia Commons: Paterskerk (Eindhoven)](https://commons.wikimedia.org/wiki/Category:Paterskerk_(Eindhoven))
