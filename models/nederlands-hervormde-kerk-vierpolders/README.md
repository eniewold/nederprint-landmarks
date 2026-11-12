# Nederlands Hervormde Kerk Vierpolders

Zaalkerk aan Dijkpotingen 1, met een afgewolfd dak, lage aanbouwen en een dakruiter. Het kerkgebouw dateert uit de achttiende eeuw en is later verbouwd en gerestaureerd; het BAG-bouwjaar 1880 is niet zonder meer het oorspronkelijke bouwjaar.

## Bronnen en plaatsing

- [3DBAG, pand 0501100001988682](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0501100001988682): grondvlak, oriëntatie en dakhoogte.
- [PDOK AHN5 WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogten, met 652 geldige DSM-cellen in het pandvlak.
- [Rijksmonumentenregister 37404](https://monumentenregister.cultureelerfgoed.nl/monumenten/37404) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Dorpskerk,_Vierpolders): monument en foto's van beide langsgevels.
- RD-oorsprong 71875.04, 433031.78; lokale x-as (0.583, 0.812); maaiveld circa NAP +1.01 m. Dit model vervangt BAG-pand NL.IMBAG.Pand.0501100001988682.

## Model en onzekerheden

Schip, lage aanbouwen, dakruiter en spits zijn uit afzonderlijke volumes met dakvlakken opgebouwd en samengevoegd tot één gesloten volume. Goothoogte circa 4,9 m en nokhoogte circa 8,6 m boven maaiveld volgen de reconstructie. De dakruiter, zijn spits (tot circa 14,5 m), gevelopeningen en kleine aanbouwen zijn geschat uit foto's: bomen bedekken delen van de gevel en de AHN/PDOK-reconstructie geeft de spits niet betrouwbaar weer. De kleine weerhaan en de fijne raamtraceringen zijn voor 1:1000 weggelaten; de top is verbreed voor printbaarheid. De voet loopt 0,5 m onder het maaiveld.

## Genereren en controleren

`node scripts/generate-nederlands-hervormde-kerk-vierpolders.mjs` genereert GLB, metadata en STL op 1:100 en 1:1000. De geometrie is één manifold component met genus 0. De webshoptest controleert catalogusplaatsing, vervanging van het BAG-pand en ondersteuning bij 45 graden. Kaartcontrole: http://localhost:3000/kaart/51.87967/4.18007/200/1x1/0.
