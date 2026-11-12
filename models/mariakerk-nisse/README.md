# Mariakerk, Nisse

Vereenvoudigde kruiskerk met westtoren, eenbeukig schip, twee dwarsarmen, veelhoekig gesloten koor, kleinere aanbouwen en steunberen. De kerk is in verschillende fasen gebouwd: de toren in de veertiende eeuw en schip en koor in de vijftiende eeuw.

## Bronnen en maten

- [BAG/3D BAG pand 0654100000030364](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0654100000030364): omtrek, richting en dakvlakken. Gemeten maaiveld NAP +1,89 m; scheepsnok circa NAP +18,5 m.
- [AHN DSM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0): controle van de dakvlakken en torenspits; hoogte maximaal circa NAP +50,1 m.
- [Rijksmonument 10008](https://monumentenregister.cultureelerfgoed.nl/monumenten/10008), [kerkgeschiedenis en exterieur](https://www.mariakerk-nisse.nl/de-kerk/exterieur/) en [Commons-foto's](https://commons.wikimedia.org/wiki/Category:Mariakerk_(Nisse)): vorm en zichtbare onderdelen.

Oorsprong RD (48270, 386242,3) met X-as (0,9986, 0,0529); onderkant 0,5 m onder maaiveld. De spits is op 47,6 m boven maaiveld gemodelleerd, met een verbrede top voor printbaarheid. De maat en vorm van de torenspits en traptoren, vensternissen, steunberen en dakovergangen zijn deels uit foto's en AHN geschat; fijn maaswerk, uurwerk, windvaan en kruisen zijn weggelaten omdat ze op 1:1000 te dun zijn. Dakvlakken zijn uit afzonderlijke gebouwvormen opgebouwd.

## Bestanden en controle

De GLB bevat één node `building:kerk`, in meters met Y omhoog; de JSON vervangt het genoemde BAG-pand. De STL-bestanden zijn op 1:100 en 1:1000. Genereer met `node scripts/generate-mariakerk-nisse.mjs --scale 1000` in de modelrepository.

De gerichte modeltest controleert de plaatsing, één gesloten manifold, 45°-steunopvulling en doorsneden. Vier schuine zijden zijn met PDOK en foto's vergeleken: de PDOK-toren mist de spits; het model behoudt de dwarsarmen en aanbouwen en voegt torenspits, traptoren en gevelopeningen toe. De nabije PDOK-panden zijn tegen AHN vergeleken; lokale afwijkingen bij dakranden wijzen niet overtuigend op een hoge kolom.


De kaart en preview-export van de volledige uitsnede zijn gecontroleerd.
