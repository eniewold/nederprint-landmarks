# Nicolaaskerk (Vlieland)

Een vereenvoudigde, gesloten kruiskerk voor NederPrint. De kerk bestaat uit twee kruisende zadeldaken met kilgoten, vier topgevels, de karakteristieke verhoogde klokgevel aan de straat, de lage kerkekamer met schilddak, steunberen en blinde raam- en deurnissen. Het gebouw heeft geen toren. Klein metselreliëf, raamroeden, muurankers en het kerkhof zijn weggelaten omdat ze op 1:1000 te klein zijn.

- `nicolaaskerk-vlieland.glb`: model in meters, glTF Y omhoog, node `building:kerk`.
- `nicolaaskerk-vlieland.json`: catalogus met vervanging van BAG-pand 0096100000383318.
- `nicolaaskerk-vlieland-1-1000.stl`: zelfstandig printmodel in millimeters.
- Generator: `scripts/generate-nicolaaskerk-vlieland.mjs` in deze repository.

De oorsprong is RD (133513,13; 589974,35), op maaiveld; lokale +X loopt ongeveer oostwaarts in de richting (0,999452; -0,03310), +Y haaks daarop naar het noorden. Alle onderdelen zakken 0,5 m onder de vlakke modelvoet. De staalnamepunten liggen rond de voet van de kerk, omdat het terrein er glooiend is.

De BAG-contour en 3D BAG LoD2.2 leveren de plattegrond, nokrichting en dakvlakken: nok NAP +14,43 m, maaiveld NAP +3,416 m en goot circa NAP +8,5 m. Het AHN DSM op 0,5 m bevestigt de daknok nabij NAP +14,2 m. De vorm van de klokgevel, de kerkekamer, de afmetingen en exacte positie van deuren en ramen, en de steunberen zijn uit open foto's geschat. De steunberen zijn voor printbaarheid verbreed tot minimaal 0,9 m. De oculi zijn als blinde nissen weergegeven.

Controle: generator met één gesloten onderdeel, genus 0 en `NoError`; gerichte test voor catalogus, uitsnede en 45°-print op 1:1000 geslaagd. Een volledige 150 × 150 m preview-export op 1:1000 met en zonder landmark is geslaagd; de kerk blijft geheel binnen de uitsnede. Vier gelijke modelhoeken zijn vergeleken met de PDOK-reconstructie en met open foto's van straatzijde, zijarmen en kerkhof. PDOK toont de hoofdvolumes, maar vervormt de dakvlakken; het landmark herstelt rechte daken, de voorgevel en de zichtbare nissen en steunberen.

Bronnen: [3D BAG-pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0096100000383318), [AHN DSM 0,5 m via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0), [rijksmonument 37576](https://monumentenregister.cultureelerfgoed.nl/monumenten/37576), [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Nicolaaskerk,_Vlieland), [Stichting Nicolaaskerk](https://nicolaaskerk-vlieland.nl/-/overdekerk).
