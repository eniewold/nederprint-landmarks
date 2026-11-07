# Johanneskerk (Tzum)

De twaalfde-eeuwse zaalkerk met gotisch koor en de monumentale westtoren uit 1548, vereenvoudigd voor NederPrint en 3D-print op 1:1000.

## Bestanden

- `johanneskerk-tzum.glb`: gesloten model in meters, met één node `building:kerk`.
- `johanneskerk-tzum.json`: catalogus, ligging en bronvermelding.
- `johanneskerk-tzum-1-1000.stl`: losse print in millimeters op 1:1000.
- Generator: `scripts/generate-johanneskerk-tzum.mjs`.

## Ligging en bouwdelen

De oorsprong ligt op RD (166765, 574695), op maaiveld NAP +3,164 m; de lokale +X-as wijst langs de nok naar het oosten, RD-richting (0,9788, -0,2048). De vlakke onderzijde ligt 0,5 m onder het maaiveld. Het model vervangt BAG-pand `NL.IMBAG.Pand.0070100000318527`.

De BAG-contour en 3D BAG-dakvlakken bepalen het langgerekte schip, de driezijdige koorsluiting, de zuidelijke consistorie en de vierkante toren. De schuine daken en de achtzijdige torenspits zijn echte vlakken. Het schip heeft een nok op +14,32 m boven maaiveld; de torenmuur reikt tot +31,58 m en de spits tot +69,0 m. Het AHN-DSM meet de hoogste bruikbare punten rond NAP +72,1 m (ongeveer +69 m boven het BAG-maaiveld); publieke bronnen noemen een totale hoogte van 72 m inclusief topornament. Vensters en galmgaten zijn als ondiepe nissen weergegeven.

## Schattingen en weglatingen

Posities en afmetingen van gevelvensters, deuren, galmgaten en het precieze einde van de spits zijn geschat uit foto's en het AHN. De bovenste 0,9 m brede tip is voor printbaarheid verbreed; de zeer dunne torenbalustrade, windvaan, kruis, baksteenreliëf en raamroeden zijn weggelaten. Het hippedak van de consistorie is vereenvoudigd uit de 3D BAG en foto's.

## Controle

De generator meldt `NoError`, één gesloten onderdeel en genus 0; afmetingen 49,53 × 18,53 × 69,5 m. De gerichte catalogus- en 45°-printtest slaagt, met een steunvolume-factor van 1,000000. Een volledige uitsnede van 150 × 150 m op 1:1000 is met en zonder landmark geëxporteerd. Vier aanzichten zijn vergeleken met PDOK en bronfoto's: de PDOK-toren is boven de trans afgekapt; het model voegt de hoge spits en gevelnissen toe en behoudt kerk, koor en consistorie.

## Bronnen

- [3D BAG, pand 0070100000318527](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0070100000318527): contour, dakvlakken en maaiveld.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): DSM 0,5 m voor toren, spits en dakhoogten.
- [PDOK luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0): plattegrond en dakrichting.
- [Rijksmonumentenregister 15869](https://monumentenregister.cultureelerfgoed.nl/monumenten/15869).
- [Wikimedia Commons: Johanneskerk Tzum](https://commons.wikimedia.org/wiki/Category:Johanneskerk,_Tzum): foto's rondom.
- [Tsjerkepaad: Johanneskerk](https://tsjerkepaad.nl/overzicht-kerken/tzum-johannes-kerk): hoogte 72 m.
