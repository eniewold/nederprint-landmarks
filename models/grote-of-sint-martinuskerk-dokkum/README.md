# Grote of Sint-Martinuskerk (Dokkum)

Landmarkmodel van de kerk aan de Markt in Dokkum. De kerk heeft een dakruiter aan de westgevel; de vroegere Abdijtoren hoort niet bij het bestaande gebouw.

## Bestanden en plaatsing

- `grote-of-sint-martinuskerk-dokkum.glb`: gesloten gebouwvolume in meters, glTF met Y omhoog.
- `grote-of-sint-martinuskerk-dokkum.json`: positie, oriëntatie en bronnen.
- `grote-of-sint-martinuskerk-dokkum-1-1000.stl`: losse print op 1:1000.
- Generator: `scripts/generate-grote-of-sint-martinuskerk-dokkum.mjs`.

De oorsprong ligt op RD (195720, 593537), op maaiveldniveau; de lokale X-as loopt 2,2° ten noorden van oost. Het model vervangt BAG-pand `0058100000213293`. Het vlakke ondervlak ligt 0,5 m onder het lokale maaiveld.

## Onderdelen en aannames

Het model omvat het schip met zadeldak en koorsluiting, de lagere noordbeuk, oostelijke aanbouwen, de westelijke trapgevel, een dakruiter, steunberen, toegangen met een omlijsting en blinde vensternissen. Het roosvenster in de westgevel is als eenvoudige nis weergegeven. De dakvlakken en nokrichting zijn vereenvoudigd op basis van 3D BAG LoD2.2; de maaiveldhoogte is circa NAP +4,60 m. De dakruiter reikt tot circa 32,67 m boven dat maaiveld, naar de hoogste AHN DSM-meting.

De precieze trapafmetingen van de westgevel, de doorsnede en galmgaten van de dakruiter, de portalen, vensters en steunberen, en de geometrie van de oostelijke aanbouwen zijn geschat. Maaswerk en kleine versieringen onder 0,9 m zijn weggelaten voor de schaal 1:1000. De koorvensters zijn volgens een foto gereconstrueerd, maar hun maat en plaats blijven geschat. De aanbouwen en hun aansluiting op het aangrenzende pand zijn op de kaart en in de preview bekeken.

## Controle

De generator controleert de gesloten manifold, rondgang via Float32 en overhanghoeken. De proefexport is één aaneengesloten volume, met `NoError`, genus 0 en afmetingen 42,78 × 21,0 × 33,17 mm op 1:1000. Een tijdelijke catalogus- en 45°-steuntest is geslaagd; een volledige 3MF-export van een uitsnede van 150 × 150 m op 1:1000 bevat het kerkobject. Vier renders naast dezelfde hoeken van de PDOK-export tonen regelmatiger dakvlakken, een hogere dakruiter en gedetailleerde gevels. De positie en de aansluiting op het buurperceel zijn op de kaart en in de 1:1000-preview bekeken.

## Bronnen

- [3D BAG, pand 0058100000213293](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0058100000213293): omtrek, maaiveld en dakvlakken.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): DSM 0,5 m.
- [Wikimedia Commons: Grote of Sint-Martinuskerk](https://commons.wikimedia.org/wiki/Category:Grote_of_Sint-Martinuskerk): gevels en dakruiter.
- [RCE, oostzijde](https://commons.wikimedia.org/wiki/File:Exterieur_oost-zijde_-_Dokkum_-_20058794_-_RCE.jpg): koorvensters en steunberen.
- [Tsjerkepaad: Grote of Sint Martinuskerk](https://www.tsjerkepaad.nl/overzicht-kerken/dokkum-grote-of-sint-martinuskerk): trapgevel en aanbouw.
- [Wikipedia](https://nl.wikipedia.org/wiki/Grote_of_Sint-Martinuskerk_(Dokkum)): achtergrond en identificatie.
