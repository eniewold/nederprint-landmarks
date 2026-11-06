# Grote Kerk (Elst)

Landmarkmodel van de Grote of Sint-Maartenskerk in Elst (Overbetuwe). De kerk heeft een tweebeukig schip, driezijdig gesloten koor en een westtoren met een hoge achthoekige bovenbouw en korte bekroning.

## Bestanden en plaatsing

- `grote-kerk-elst.glb`: gesloten model in meters, glTF met Y omhoog.
- `grote-kerk-elst.json`: plaatsing en metadata.
- `grote-kerk-elst-1-1000.stl`: losse print op 1:1000.
- Generator: `scripts/generate-grote-kerk-elst.mjs`.

De oorsprong ligt op RD (186800, 436918), lokale +X loopt 22,3° noord van oost langs het schip. Het model vervangt BAG-pand `1734101000027993`. Het ondervlak ligt 0,5 m onder lokaal maaiveld.

## Onderdelen en aannames

Het model omvat het tweebeukige schip, de koorsluiting met drie vensternissen, asymmetrische dakvlakken met drie dakkapellen, de westtoren met vierkante onderbouw en hoge achthoekige bovenbouw, zuidportaal, traptoren, diagonale torensteunberen en vensternissen. De nok en dakvlakken zijn op basis van 3D BAG vereenvoudigd. De hoogste AHN DSM-meting is NAP +63,27 m; bij NAP +10,95 m maaiveld is dat circa 52,32 m boven het maaiveld.

De exacte geledingen en de achthoekige bekroning van de toren, pinakels, dakhellingen, steunberen, portaal en nissen zijn geschat op basis van foto's. Maaswerk, open balustrades en kleine details onder 0,9 m zijn voor schaal 1:1000 weggelaten.

## Controle

De generator controleert de gesloten manifold, Float32-rondgang en neerwaartse vlakken. Het model bestaat uit één component, status `NoError`, genus 0, met afmetingen 65,4 × 23,7 × 52,8 mm op 1:1000. De catalogusplaatsing en de 45-gradensteuntest zijn geslaagd; twaalf doorsneden bleven gelijk. Volledige 3MF-exports van 200 × 200 m op 1:1000 met en zonder landmark zijn vanuit vier gelijke hoeken met PDOK en foto's vergeleken. De fotohoeken zijn benaderend. De kaart en de volledige preview zijn bekeken.

## Bronnen

- [3D BAG, pand 1734101000027993](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1734101000027993): omtrek, dakvlakken en maaiveld.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): DSM 0,5 m en torenhoogte.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Grote_of_Sint-Maartenskerk_(Elst)): gevels en toren.
- [Monumenten in Nederland: Elst](https://www.dbnl.org/tekst/sten009monu05_01/sten009monu05_01_0075.php): toren, schip en koor.
