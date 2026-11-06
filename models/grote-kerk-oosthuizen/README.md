# Grote Kerk, Oosthuizen

Laatgotische eenbeukige kruiskerk uit 1511–1518 met vijfzijdig gesloten koor, steunberen en een achtzijdige vieringtoren met peervormige bekroning. Het model bestaat uit kruisende zadeldaken en vlakken voor de koorsluiting, met steunberen en verdiepte spitsboogvensters.

## Bronnen en maten

- [3D BAG, pand 0478100000001179](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0478100000001179): grondvorm en dakvlakken.
- [PDOK AHN DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa NAP -1,209 m, hoogste gemeten punt NAP +24,679 m; modeltop +25,5 m boven het maaiveld. De bovenste ijle spits is beperkt zichtbaar in de hoogtemeting.
- [Rijksdienst voor het Cultureel Erfgoed](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/40332), [kerkwebsite](https://www.grotekerk-oosthuizen.nl/over-de-kerk/) en [Commons-foto's](https://commons.wikimedia.org/wiki/Category:Hervormde_Kerk,_Oosthuizen): bouwvorm, raamindeling en de toren.

Oorsprong RD (128241, 509321,5); +X naar het koor volgens (0,9962, -0,0872). Het model vervangt BAG-pand 0478100000001179. Vensterposities, details van steunberen en de peervorm van de toren zijn deels geschat op basis van foto's. De karakteristieke open lantaarn en open kroon zijn voor 1:1000 dicht uitgevoerd met ondiepe nissen; de dunne spijlen, windwijzers en maaswerk zijn te kwetsbaar op deze schaal. Een aantal foto's is historisch.

## Genereren en printen

`node scripts/generate-grote-kerk-oosthuizen.mjs` schrijft GLB, JSON en STL's. Eén gesloten onderdeel, opgebouwd uit dakvlakken en bouwdelen; getest op 1:1000 zonder steun. De onderkant reikt 0,5 m onder het maaiveld.
