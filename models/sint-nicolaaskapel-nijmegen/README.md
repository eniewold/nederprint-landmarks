# Sint-Nicolaaskapel, Nijmegen

Landmarkmodel van de kapel op het Valkhof. De zestienzijdige omgang, achtzijdige bovenbouw met tentdak en westelijke ingangsrisaliet zijn als één gesloten bouwvolume uitgevoerd. Ondiepe, afgeschuinde nissen suggereren de gevelopeningen zonder losse of zwevende delen. Het model is gemaakt voor afdrukken zonder ondersteuning op 1:1000; de losse STL is beschikbaar op 1:100 en 1:1000.

## Plaatsing en bronnen

- RD-oorsprong: 188248,63 / 428948,18; BAG-pand NL.IMBAG.Pand.0268100000045513. De voet wordt 0,3 m in de ondergrond geplaatst. Vijf maaiveldmeetpunten op de Valkhofheuvel voorkomen dat het maaiveld onderaan de heuvel wordt gekozen.
- [3DBAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0268100000045513): ligging, contour en reconstructie; maaiveldhoogte circa 32,782 m NAP.
- [Rijksmonumentenregister, nr. 31192](https://monumentenregister.cultureelerfgoed.nl/monumenten/31192): identificatie en architectuur.
- [Sint-Nicolaas.eu](https://sint-nicolaas.eu/nijmegen/): hoogte circa 20 m.
- [Foto entreezijde](https://storage.pubble.nl/fe5959ff/content/2022/8/e8aa65fa-136b-41c2-a2db-39b0969172fc_thumb1920.jpg), [foto achterzijde](https://primary.jwwb.nl/public/c/a/1/sinterklaasmijnhobby/2vtpa8/St_Nicolaas_kapel4.jpg) en [foto zuidzijde](https://www.valkhof.nl/media/Fotos/St._Nicolaaskapel/Zonnige_kapel_vanuit_zuid.jpg): gevelindeling en dakvorm.

De maatvoering van de omgang, de ingangsrisaliet, dakhellingen en de positie en afmetingen van de nissen zijn geschat uit reconstructie en foto's. Kleine versieringen, metselwerk en het kruis zijn vereenvoudigd of weggelaten vanwege de printschaal. De afmeting is ongeveer 15,04 × 13,63 × 20,3 m inclusief de ingegraven voet.

## Genereren en controleren

Voer vanuit de landmarkrepository `node scripts/generate-sint-nicolaaskapel-nijmegen.mjs` uit voor de GLB, catalogus en STL 1:100; gebruik `--scale 1000` voor de losse STL op 1:1000. Het volume is verbonden en gesloten (genus 0). Een uitsnede van 150 × 150 m is met en zonder landmark geëxporteerd en de vier richtingen zijn met de PDOK-reconstructie en schuine foto's vergeleken. Controleer bij kaartbeoordeling vooral de aansluiting op de Valkhofheuvel en de ligging van de entree.
