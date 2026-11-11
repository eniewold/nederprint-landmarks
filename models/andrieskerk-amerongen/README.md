# Andrieskerk Amerongen

Laatgotische pseudobasiliek met lager schip, hogere vijfzijdige koorsluiting, lage kooraanbouw en een westtoren met korte spits. De geschiedenis gaat terug tot de dertiende eeuw; de toren werd vanaf 1527 gebouwd. Het model is opgebouwd uit gesloten bouwdelen en dakvlakken; spitsboogvensters en galmgaten zijn blinde nissen.

## Maten en print

- BAG-pand 1581100000018529, oorsprong RD (160108, 445513), X-as (0,891; 0,454), maaiveld circa NAP +14,16 m; BAG-grondoppervlak 613,11 m².
- De kerknok is circa 16,7 m en de koornok 19,7 m boven maaiveld. De AHN ziet de spits tot circa 50 m; een externe beschrijving noemt de gehele toren 55 m. De top en de verdeling van de torengeledingen zijn geschat op basis van foto's en die hoogte.
- GLB in meters, STL op 1:1000 circa 44,9 × 17,3 × 55,3 mm. De voet ligt 0,5 m onder het maaiveld. Generator controleert één aangesloten gesloten volume en de ondervlakken op 45 graden.

## Bronnen

- [Rijksmonument kerk 7755](https://monumentenregister.cultureelerfgoed.nl/monumenten/7755) en [toren 7756](https://monumentenregister.cultureelerfgoed.nl/monumenten/7756)
- [3DBAG, BAG en AHN](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1581100000018529)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Andrieskerk_(Amerongen))
- [Geschiedenis van de kerk](https://www.andrieskerk.nl/andrieskerk/)
- [Torenhoogte circa 55 m](https://kerkfotografie.nl/andrieskerk-amerongen/nggallery/slideshow)

## Controle en schattingen

Het model is van vier kanten naast de PDOK-reconstructie en beschikbare schuine foto's bekeken. De PDOK-toren mist de bovenste spits; die is toegevoegd. De breedte en hoogte van de nissen, steunberen, traptorens en details zijn geschat en voor 1:1000 vereenvoudigd. Fijn maaswerk en open balustrades zijn niet gemodelleerd.

Vier nabije panden zijn lokaal met het AHN-DSM vergeleken. Drie tonen een mediane dakafwijking van 0,04–0,08 m; het vierde (1581100000018532) toont lager PDOK dan het DSM, mogelijk door vegetatie. Er is geen overtuigend te hoog buurpand gevonden en alleen het kerkpand wordt vervangen.

`node scripts/generate-andrieskerk-amerongen.mjs --components` genereert GLB, metadata en STL. De gerichte webshoptest controleert plaatsing, verbondenheid en de ondersteuningsberekening.
