# Broederenkerk Deventer

Tweebeukige voormalige kloosterkerk met twee ongelijke zadeldaken, koorsluitingen, steunberen, westportaal en dakruiter. Het 1:1000-model heeft blinde spitsboognissen voor de vensters, een vereenvoudigde lantaarn en een achtzijdige spits; glas, maaswerk en andere delen kleiner dan 0,9 m zijn weggelaten.

## Bronnen en afmetingen

- [Rijksmonumentenregister 12543](https://monumentenregister.cultureelerfgoed.nl/monumenten/12543): twee beuken waarvan de zuidelijke breder is, neogotisch westportaal en uitbreiding van het noordkoor.
- [3D BAG pand 0150100000000977](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0150100000000977) en PDOK BAG: contouren, nokrichtingen en dakvlakken.
- PDOK AHN DSM 0,5 m: maaiveld NAP circa +8,39 m, zuidnok NAP circa +36,4 m, noordnok circa +33,2 m, dakruiter tot minstens NAP +54,2 m.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Broederenkerk,_Deventer): onder meer RCE-zuidgevel en een overzichtsfoto van de twee daken en dakruiter.

De precieze vorm en hoogte van de dakruiter boven de AHN-punten, het westportaal, de nissen en de dakkapellen zijn uit de foto's geschat en vereenvoudigd. De spits eindigt op 0,9 m breedte voor printbaarheid. De maaswerken en losse dakornamenten zijn fijner dan de printschaal en ontbreken.

## Aangrenzende panden

De PDOK-dakvlakken van de zes direct aangrenzende panden zijn per rasterpunt vergeleken met AHN. De mediane afwijking bedraagt 0,02–0,06 m en het 90e percentiel 0,10–0,57 m; hun PDOK-modellen blijven daarom behouden. Op enkele punten binnen een meter van de gemeenschappelijke gevel zijn hogere verschillen zichtbaar.

## Model en print

Het GLB heeft één node `building:kerk` in meters met Y omhoog. De oorsprong ligt op RD (207573, 474333), met +X langs de nok naar het oosten. De JSON vervangt alleen het kerkpand. De STL is op 1:1000, circa 63,2 × 23,0 × 46,3 mm. De generator controleert gesloten onderdelen en aflopende ondervlakken.

```sh
node scripts/generate-broederenkerk-deventer.mjs
```
