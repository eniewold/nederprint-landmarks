# Jacobikerk Utrecht

De Jacobikerk is een driebeukige hallenkerk met drie hoge zadeldaken, dwarsschip en drie koorsluitingen. De toren staat binnen het westelijke kerkvolume en heeft een vernieuwde, ingesnoerde spits. De STL meet 69,7 × 38,1 × 67,1 mm op 1:1000 inclusief 0,5 mm onder maaiveld. De generator maakt één gesloten genus-0-volume en controleert ondervlakken; de webshoptest controleert plaatsing, steunvolume en doorsneden.

## Bronnen en plaatsing

- [Rijksmonumentenregister 36148](https://monumentenregister.cultureelerfgoed.nl/monumenten/36148) en [Jacobitoren, gemeente Utrecht](https://erfgoed.utrecht.nl/verhalen/jacobitoren): bouwgeschiedenis, ingebouwde toren en huidige spits.
- [3DBAG pand 0344100000027479](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000027479): contour, dakvlakken, maaiveld NAP +4,04 m; de spits ontbreekt grotendeels en een deel van de AHN-metingen is niet beschikbaar.
- AHN DSM 0,5 m: hoogste torenpixel NAP +70,66 m, circa 66,62 m boven maaiveld; omliggende punten tonen een taps toelopende spits.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Jacobikerk,_Utrecht): buitenfoto's van westgevel, schip, koren en toren. Historische foto's zonder spits tonen een toestand van vóór de huidige torenbekroning.
- PDOK 3D Basisvoorziening: reconstructie en vervanging van kerk en toren onder één BAG-pand. Aanpalende westelijke huisjes 0344100000027478 zijn een afzonderlijk pand en worden niet vervangen. Hun lokaal met AHN vergeleken dakvlakken tonen geen systematische hoge kolom; enkele dakrandpunten verschillen tot circa 2,2 m. Het verder zuidelijk gelegen pand 0344100000022882 vertoont lokaal grotere afwijkingen (p90 circa +6,5 m, max +13,9 m), oorzaak onzeker.

Oorsprong RD (136365, 456345), X-as (0,99001, 0,141), maaiveld NAP +4,04 m. [Controleer de kaart](http://localhost:3000/kaart/52.09505/5.11526/200/1x1/0).

## Geschat en vereenvoudigd

De aansluitingen van de drie koren, dwarsschip, steunberen en vensters zijn uit foto's en dakvlakken geschat. Spits, galmgaten en gevelnissen zijn vereenvoudigd; open maaswerk, wijzerplaten en kleine ornamenten ontbreken. De spits is bovenaan 0,9 mm breed voor de print. Controleer vooral de drie daknokken, koren en aansluiting op de westelijke huisjes.

Generator: `node scripts/generate-jacobikerk-utrecht.mjs --components`.
