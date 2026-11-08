# Ledevaertkerk (Chaam)

Vereenvoudigde gotische kruiskerk met driezijdig gesloten koor, dwarskap, dakruiter en lagere consistorie. De toren en het westelijke schip zijn in 1944 verwoest; de tegenwoordige situatie heeft daar de lagere consistorie. Het model vervangt BAG-pand 1723100000005082.

## Bestanden en plaatsing

- `ledevaertkerk-chaam.glb`: gesloten model in meters, met node `building:kerk`.
- `ledevaertkerk-chaam.json`: plaatsing op RD (118684, 390658), X-as `[0.97589, -0.21827]`, maaiveldreferentie NAP +13,199 m.
- `ledevaertkerk-chaam-1-100.stl` en `ledevaertkerk-chaam-1-1000.stl`: afdrukmodellen.
- `scripts/generate-ledevaertkerk-chaam.mjs`: reproduceert het model uit bouwdelen en dakvlakken.

## Maten en vereenvoudiging

De BAG geeft omtrek en positie. AHN4 levert de kaphoogten (nok ongeveer NAP +28,73 m) en de dakruiter (circa NAP +35,0 m); 3DBAG geeft het maaiveld en rapporteert geen AHN4-gat. De regelmatige dakvlakken zijn tussen meetpunten geïnterpoleerd. De vensters, steunberen, portaal, dikte en hoogte van de dakruiter zijn naar foto en raster geschat; de lantaarn is voor 1:1000 gesloten met nissen en de spits verdikt. Venstertraceringen, kruis, dakranden en andere details onder 0,9 m zijn weggelaten.

## Controle

Eén gesloten manifold zonder gaten. Een gerichte test controleert plaatsing, pandvervanging, hoogte en 45-graden-overhangopvulling bij 1:1000. Twee previewexports, met en zonder landmark, zijn gemaakt op een uitsnede van 150 bij 150 m en van vier kanten met PDOK en beschikbare schuine foto's vergeleken.

## Bronnen

- [Rijksmonumentenregister 11479](https://monumentenregister.cultureelerfgoed.nl/monumenten/11479)
- [3DBAG pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1723100000005082)
- [AHN4 WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0)
- [Historie en voormalige toren](https://alphenserfgoed.nl/ledevaertkerk/)
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Ledevaertkerk,_Chaam)
- [Actuele foto van de kerk](https://ledevaertkerk.protestantsekerk.net/contact_1/)
