# Hervormde Kerk Westbroek

De laatgotische kerk bestaat uit schip, hoger veelhoekig koor, noordelijke grafkapel en ingebouwde westtoren met hoekposten en een spits. De STL meet 45,5 × 20,8 × 41,5 mm op 1:1000 inclusief 0,5 mm onder maaiveld. De generator maakt één gesloten genus-0-volume en controleert ondervlakken; de webshoptest controleert plaatsing, steunvolume en meerdere doorsneden.

## Bronnen en plaatsing

- [Rijksmonumentenregister 26509](https://monumentenregister.cultureelerfgoed.nl/monumenten/26509) en [Hervormd Westbroek](https://www.hervormdwestbroek.nl/Gebouwen/Kerk-en-toren/): geschiedenis van kerk en toren.
- [3DBAG pand 0310100000670299](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0310100000670299): contour, dakvlakken en maaiveld NAP +0,64 m. Kerk en toren zijn één BAG-pand; 3DBAG meldt 35% AHN4-nodata en de spits is onvolledig.
- AHN DSM 0,5 m: hoogste torenpixel NAP +41,68 m, circa 41,04 m boven maaiveld; meerdere omringende punten tonen een taps toelopende top, ondanks het 3DBAG-nodata-aandeel.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Hervormde_kerk,_Westbroek): noord-, zuid-, oost- en westaanzichten van schip, koor, toren en grafkapel.
- PDOK 3D Basisvoorziening: reconstructie en vervanging van één BAG-pand; de nabije daken zijn lokaal met AHN vergeleken zonder vastgestelde stelselmatig te hoge kolom. Enkele dakranden vertonen incidentele verschillen.

Oorsprong RD (137131, 462609), X-as (0,97319, 0,23), maaiveld NAP +0,64 m. [Controleer op de kaart](http://localhost:3000/kaart/52.15137/5.12612/200/1x1/0).

## Geschat en vereenvoudigd

Maten van spits, hoekposten, grafkapel, vensters en steunberen zijn naar foto's en hoogtegegevens geschat. De spits is afgeplat tot 0,9 mm voor printbaarheid; openingen, uurwerken, kruisen en maaswerk zijn vereenvoudigd of weggelaten. Controleer de relatief korte torenspits, de aansluiting van het hogere koor en de noordelijke grafkapel op de kaart.

Generator: `node scripts/generate-hervormde-kerk-westbroek.mjs --components`.
