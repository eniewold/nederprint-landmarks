# Bartholomeüskerk Westhem

De Bartholomeüskerk bestaat uit een zaalkerk uit 1708 met een middeleeuwse zadeldaktoren. Het model gebruikt afzonderlijke bouwdelen en schuine dakvlakken, met verdiepte vensters en galmnissen. De windvaan en kleine ornamenten zijn op schaal 1:1000 weggelaten.

## Ligging en maten

- BAG-pand 0683100000294144; RD-oorsprong (165925, 559001), X-as (0,9856, -0,169).
- De contour en de dakvlakken zijn gebaseerd op 3D BAG LoD2.2. Maaiveld NAP +0,95 m, kerknok NAP +11,35 m en torennok ongeveer NAP +19,93 m; AHN DSM 0,5 m geeft circa NAP +20,1 m voor de toren.
- Vensterposities, de afmetingen en diepte van de nissen, het torenportaal en de vereenvoudigde koorvlakken zijn geschat uit schuine foto's. Kleine ovale koorvensters en de topornamenten zijn weggelaten.

## Bronnen

- [3D BAG pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0683100000294144)
- [PDOK AHN DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0)
- [Rijksmonument 39822](https://monumentenregister.cultureelerfgoed.nl/monumenten/39822)
- [Bronfoto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Bartholome%C3%BCskerk,_Westhem)

## Productie en controle

`node scripts/generate-bartholomeuskerk-westhem.mjs` maakt de GLB, JSON en STL op schaal 1:1000. Het model is gesloten (genus 0), bestaat uit één onderdeel en heeft een gecontroleerde ondersteuningsbehoefte. De 150 m-uitsnede is met en zonder landmark geëxporteerd; vier gelijke aanzichten zijn naast de PDOK-reconstructie en foto's vergeleken. Kaartcontrole: http://localhost:3000/kaart/53.01782/5.55011/200/1x1/0.
