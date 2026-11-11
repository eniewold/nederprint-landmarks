# Oude Kerk, Borne

Vereenvoudigd printbaar model van het laatgotische kerkgebouw en de westtoren. Het schip heeft één groot zadeldak boven twee even hoge beuken; het smallere koor heeft een veelhoekige sluiting. De toren heeft een vierkante romp en een ingesnoerde achtzijdige spits. Steunberen, spitsboogvormige vensternissen, galmgaten, zij-ingang, uurwerken, aanbouw en dakkapellen zijn als bouwdelen opgenomen.

## Bronnen en maten

- [Rijksmonumentenregister 9929](https://monumentenregister.cultureelerfgoed.nl/monumenten/9929): twee even hoge beuken en vijftiende-eeuws koor.
- [3D BAG, pand 0147100000012207](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0147100000012207): contour, dakvlakken en maaiveld circa NAP +14,38 m.
- PDOK AHN DSM 0,5 m: nok circa NAP +30,54 m, richting en doorsnede van het dak; torensilhouet.
- [Visit Borne](https://www.visitborne.nl/wat-te-doen/cultuur-historische-waardekaart/): kerk circa 35 m lang en toren circa 48 m tot de bol.
- [RCE-foto’s op Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Borne): vormen van het koor, steunberen, torenspits en vensters.

De exacte posities en afmetingen van dakkapellen, steunberen, vensternissen en galmgaten en het profiel van de ingesnoerde torenspits zijn vereenvoudigd en geschat op basis van de foto's. De uurwerken zijn als ruitvormige nissen vereenvoudigd om hun bovenkant zonder steun te kunnen printen. De torenspits is bovenaan verbreed tot 0,9 m voor printbaarheid. Fijn maaswerk, kruis, windvaan en andere details kleiner dan 0,9 m zijn weggelaten.

## Model en print

`oude-kerk-borne.glb` heeft één gesloten node `building:kerk`, in meters met Y omhoog. De JSON plaatst het model in RD met oorsprong (248600, 480043), +X langs de nok oostwaarts. Het vervangt BAG-pand `NL.IMBAG.Pand.0147100000012207`. De binaire STL is op 1:1000 en meet circa 36,2 × 15,9 × 48,4 mm. Alle onderdelen zijn samengevoegd en het model heeft geen naar beneden gerichte overhang steiler dan 45 graden.

Opnieuw genereren vanuit de repository:

```sh
node scripts/generate-oude-kerk-borne.mjs
```
