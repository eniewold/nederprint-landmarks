# Sint-Nicolaaskerk (Broekhuizen)

Eenbeukige kerk met driezijdige koorsluiting, steunberen, drie dakkapellen, een noordelijk portaal, zuidelijke sacristie en een dakruiter met twee lantaarns. De kerk werd na oorlogsschade herbouwd; het model toont de huidige vorm.

## Bestanden en plaatsing

- `sint-nicolaaskerk-broekhuizen.glb`: gesloten gebouw, meters, glTF met Y omhoog en node `building:kerk`.
- `sint-nicolaaskerk-broekhuizen.json`: catalogusitem en BAG-vervanging `1507100000016898`.
- `sint-nicolaaskerk-broekhuizen-1-100.stl` en `-1-1000.stl`: losse printmodellen, Z omhoog en millimeters.
- Generator: `scripts/generate-sint-nicolaaskerk-broekhuizen.mjs`.

Oorsprong RD (208955,7, 388835,5); lokale X-as langs het schip naar het oosten, richting (0,99875, -0,04998). Het maaiveld ligt rond NAP +18,8 m, de modelvoet op -0,5 m om aan te sluiten op het terrein. De zadeldaknok van het schip is circa NAP +35,34 m en de hoogste AHN-cel van de dakruiter circa NAP +43,10 m; de direct omliggende rastercellen zijn aanwezig. Modeltop +24,1 m boven maaiveld.

## Aannames en vereenvoudigingen

Steunberen, dakkapellen, sacristie, portaal, venster- en galmgatnissen en de verhoudingen van de twee dakruitergeledingen zijn geschat uit foto's en dakvlakken. De open lantaarns zijn op schaal 1:1000 als gesloten bouwdelen met ondiepe nissen weergegeven; dunne stijlen, uurwerk, kruis en windvaan zijn weggelaten voor printbaarheid. De toren van 47 m die soms bij Broekhuizen verschijnt betreft de andere kerk in Broekhuizenvorst en is hier niet gebruikt.

## Controle

Manifold `NoError`, één gesloten component, genus 0; gerichte plaatsings- en steuncontrole op 1:1000 geslaagd en proefexports met en zonder landmark van 150 × 150 m geslaagd. Vier schuine weergaven zijn naast PDOK en bronfoto's beoordeeld. Controleer op de kaart de dakruiter, sacristie, dakkapellen en de aansluiting op het terrein.

## Bronnen

- [PDOK AHN DSM en DTM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0).
- [3D BAG LoD2.2 van pand 1507100000016898](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1507100000016898).
- [Rijksmonumentenregister 11091](https://monumentenregister.cultureelerfgoed.nl/monumenten/11091).
- [Databank Kerkgebouwen in Limburg](https://www.kerkgebouwen-in-limburg.nl/kerken/broekhuizen/nicolaas).
- [Wikimedia Commons: Sint Nicolaaskerk, Broekhuizen](https://commons.wikimedia.org/wiki/Category:Sint_Nicolaaskerk,_Broekhuizen).
