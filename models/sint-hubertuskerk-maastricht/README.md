# Sint-Hubertuskerk (Maastricht)

De voormalige Sint-Hubertuskerk aan de Bosscherweg is een expressionistische kruiskerk uit 1924–1925 met een slanke terzijde geplaatste toren, steile kappen, lagere zijbeuken en een versmallend koor. Het model bevat de hoofdvolumes, tentdak, entree, steunberen, schoorsteen en vereenvoudigde vensternissen.

De GLB en catalogus-JSON dienen voor de kaart; de STL-bestanden zijn op 1:100 en 1:1000. Het generatorscript is `scripts/generate-sint-hubertuskerk-maastricht.mjs`.

De oorsprong is RD `[176210, 319271]`; de lokale X-as `[0.974, 0.226]` volgt de nok naar het koor. Het model vervangt BAG-pand `0935100000017601`. De 3D BAG geeft maaiveld circa +45,82 m NAP; het AHN meet de torentop tot +87,61 m NAP, met aaneengesloten meetpunten rondom. Omdat het kanaal lager ligt, meten `groundSamplePoints` op `[-10,12]` en `[0,12]` naast de kerk in plaats van rond de gehele voetafdruk. AHN geeft daar +46,27 en +46,19 m NAP. De ligging nabij het talud blijft een aandachtspunt voor controle op de kaart.

De toren- en dakmaten, gevelnissen, steunberen en koorsluiting zijn benaderd uit AHN, BAG en foto's. De stenen geveldetails, de wijzers van de klok en het kruis op de toren zijn weggelaten. De trapvormige koorsluiting is vereenvoudigd; details onder circa 0,9 m zijn niet vrijstaand uitgevoerd.

De geometrie is één gesloten manifold met genus 0. De gerichte test controleert catalogus, plaatsing en de extra 45-graden-overhangopvulling in volume en doorsneden. Er zijn preview-exports met en zonder landmark gemaakt voor een uitsnede van 150 bij 150 meter.

Bronnen: [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0935100000017601), [AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), [Rijksmonument 506627](https://monumentenregister.cultureelerfgoed.nl/monumenten/506627), [beschrijving en geschiedenis](https://www.charlesvos.nl/religieuze-werken/werken-in-kerken/h-hubertus-maastricht/) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Hubertuskerk_(Maastricht)).
