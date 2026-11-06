# Grote Kerk en Wijkertoren, Beverwijk

De Grote Kerk is een driebeukige kerk met drie langskappen en een laatmiddeleeuwse Wijkertoren aan de westzijde. De toren is via een lagere tussenbouw met de kerk verbonden. Het model bevat de drie afzonderlijke kappen, de toren met achtzijdige spits en hoekpinakels, grafkapellen en bijgebouwen, steunberen en blinde vensternissen.

## Bronnen en maten

- [3D BAG, pand 0375100000017910](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0375100000017910): grondvorm en dakvlakken; de spits ontbreekt grotendeels in de reconstructie.
- [PDOK AHN DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa NAP +3,20 m en hoogste punt NAP +64,907 m; modelspits +61,7 m boven het maaiveld.
- [Rijksmonumentenregister, toren 9448](https://monumentenregister.cultureelerfgoed.nl/monumenten/9448), [kerk 9449](https://monumentenregister.cultureelerfgoed.nl/monumenten/9449) en [Commons-foto's](https://commons.wikimedia.org/wiki/Category:Grote_Kerk,_Beverwijk): silhouet, gevels en aanbouwen.

Oorsprong RD (105478, 500042), +X van toren naar kerk volgens (0,99657, 0,08275); het model vervangt BAG-pand 0375100000017910. Venster- en galmgatbreedten, vensterposities, hoekpinakels en de vormen van kleinere aanbouwen zijn uit foto's geschat en vereenvoudigd. De open balustrade, het uurwerk, de windwijzer en dun maaswerk zijn wegens printschaal of kwetsbaarheid weggelaten. De historische foto's van de achterzijde zijn aangevuld met een recentere schuine foto.

## Genereren en printen

`node scripts/generate-grote-kerk-beverwijk.mjs` schrijft GLB, catalogus-JSON en STL's. De onderdelen zijn als doorlopende vlakken en bouwdelen opgebouwd. Het gesloten model is geschikt voor 1:1000 zonder steun; het reikt 0,5 m onder het maaiveld voor de verbinding met de ondergrond.
