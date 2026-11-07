# Fredericuskerk (Steggerda)

Vereenvoudigd landmarkmodel van de neogotische Sint-Fredericuskerk, gebouwd in 1921–1922 naar ontwerp van Wolter te Riele. De driebeukige kerk heeft schijntransepten, een driezijdig gesloten koor en een zeskantige vieringtoren.

## Bestanden

- `fredericuskerk-steggerda.glb`: gesloten model in meters, Y omhoog, met `building:kerk`.
- `fredericuskerk-steggerda.json`: positie, oriëntatie, vervangen BAG-pand en bronnen.
- `fredericuskerk-steggerda-1-1000.stl`: los printmodel, in millimeters op 1:1000.
- Generator: `scripts/generate-fredericuskerk-steggerda.mjs` in deze repository.

## Positie en bouwdelen

De oorsprong is RD (200160, 540650); de X-as (0,93715, 0,34893) loopt langs het schip van de westelijke ingang naar het koor. Het maaiveld is circa NAP +2,196 m; de vlakke onderkant ligt 0,5 m onder de modeloorsprong. Het model vervangt BAG-pand 0098100000017990, inclusief zijn lage verbinding naar de pastorie; de pastorie zelf is afzonderlijk BAG-pand 0098100000017998 en blijft als PDOK-pand behouden. De verbindingsvleugel ligt binnen de BAG-contour en is langs de pastoriegrens circa 0,5 m teruggenomen; de voetafdrukken in de 1:1000-export hebben circa 0,35 mm tussenruimte en geen overlap.

Het model bevat het schip met twee lessenaarsdaken, viering en schijntransepten, driezijdige koorsluiting, westelijke ingangsbeuk met zijkapellen, sacristie en lage verbinding, vier dakkapellen, steunberen en de zeshoekige toren met zesvlakkige spits. Het monumentenregister beschrijft zes torenzijden; sommige toeristische bronnen noemen acht. Dit model volgt de monumentbeschrijving. De daken zijn doorlopende vlakken, geen hoogteplakken. Gevelopeningen en galmgaten zijn blinde nissen.

## Maten, schattingen en weglatingen

BAG en 3D BAG geven de contour, de as, de dakvlakken en maaiveldhoogte; AHN DSM 0,5 m meet nokken en de spits tot circa 32,5 m boven het maaiveld. De uiterste spitspunt is geëxtrapoleerd tot 32,8 m. Posities en afmetingen van vensters, deur, galmgaten, steunberen en dakkapellen zijn uit foto's geschat en voor 1:1000 vereenvoudigd. De westelijke toegang is beperkt zichtbaar in beschikbare foto's; de indeling ervan is geschat. Klein metselreliëf, vensterroeden, windvaan en ornamenten onder 0,9 m zijn weggelaten. De spits is bovenaan tot 0,9 m breed gehouden voor printbaarheid.

## Controle

De generator rapporteert `NoError`, genus 0 en één gesloten onderdeel; totale afmetingen 38,3 × 28,4 × 33,3 m. De gerichte catalogus- en 45°-ondersteuningstest op 1:1000 slaagt: volumefactor 1,000163, met controle van doorsneden. Twee volledige uitsneden van 150 × 150 m zijn geëxporteerd, met en zonder landmark. Het model valt volledig in de uitsnede; vier gelijke schuine hoeken zijn vergeleken met de PDOK-reconstructie en beschikbare foto's. PDOK mist de bovenzijde van de vieringtoren; het model voegt de zeszijdige spits, dakkapellen en gevelnissen toe. De foto's zijn gevelreferenties en niet alle vanuit exact dezelfde hoek.

## Bronnen

- [3D BAG-pand 0098100000017990](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0098100000017990): contour, maaiveld en dakvlakken.
- [AHN DSM via PDOK WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogtes en torenprofiel.
- [Rijksmonumentenregister 508652](https://monumentenregister.cultureelerfgoed.nl/monumenten/508652): beschrijving en architectuur.
- [Wikimedia Commons: Fredericuskerk Steggerda](https://commons.wikimedia.org/wiki/Category:Fredericuskerk,_Steggerda): foto's van schip, koor, toren en sacristie.
- [Monumenten in Nederland: Fryslân](https://www.dbnl.org/tekst/sten009monu06_01/sten009monu06_01.pdf): bouwgeschiedenis en plattegrondbeschrijving.
