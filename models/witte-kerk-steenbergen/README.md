# Witte Kerk (Steenbergen)

Vereenvoudigd, gesloten landmark van de classicistische hallenkerk uit 1832 aan het Kerkplein. De BAG noemt 1901, maar het [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/34517) en Open Monumentendag dateren het huidige gebouw in 1832.

## Bestanden en plaatsing

- `witte-kerk-steenbergen.glb`: model in meters, Y omhoog, node `building:kerk`.
- `witte-kerk-steenbergen.json`: RD-plaatsing en vervanging van `NL.IMBAG.Pand.0851100000009837`.
- `witte-kerk-steenbergen-1-100.stl` en `witte-kerk-steenbergen-1-1000.stl`: gesloten printmodellen, Z omhoog.
- Generator: `scripts/generate-witte-kerk-steenbergen.mjs`.

Oorsprong RD (81153,2, 400416,4), X-as (0,947, 0,321) langs het schip, Z omhoog in het model. Maaiveld NAP +3,97 m; onderkant -0,5 m. De gevel met de ingang staat aan de westkant.

## Vorm en aannames

De kerk bestaat uit een rechthoekig schip met een zadeldak, voorgevel met fronton en vier pilasters, terugliggende vierkante toren, kroonlijst, achtzijdige vereenvoudigde lantaarn en spits. De langswanden hebben pilasters en rondboogvensters; de achtergevel heeft twee vensters en een rond venster in de top. De vensters zijn blinde nissen om zonder ondersteuning te kunnen printen.

De BAG-contour levert circa 32,8 bij 20,5 m. 3D BAG/AHN geeft nok NAP +23,41 m en maaiveld +3,97 m. AHN4 en AHN5 geven voor de hoogste torenpunten respectievelijk +50,28 en +48,33 m NAP; de modeltop is geschat op 43,7 m boven maaiveld. Hoogte en exacte vorm van de spits zijn een schatting bij een dun meetbaar uiteinde. Hoogtes en maten van vensters, pilasters, fronton en torenonderdelen zijn afgeleid van foto's en vereenvoudigd. De open lantaarn is massief uitgevoerd; fijn maaswerk, kruis en hek zijn weggelaten om op 1:1000 printbaar te blijven.

## Controle en bronnen

Het model is één gesloten component met genus 0. De gerichte plaatsings- en 45-graden printtest slaagt; beide echte preview-exports (met en zonder landmarks) zijn geslaagd en de model- en PDOK-uitvoer zijn naast foto's uit vier richtingen beoordeeld. De controlekaart is http://localhost:3000/kaart/51.58780/4.32160/200/1x1/0.

Bronnen: [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0851100000009837), PDOK luchtfoto, AHN4/AHN5 0,5 m, [Commons-foto's](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Steenbergen), [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/34517) en [Open Monumentendag](https://www.openmonumentendag.nl/monument/witte-kerk-steenbergen/).
