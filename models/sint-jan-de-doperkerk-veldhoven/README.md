# Sint-Jan de Doperkerk, Veldhoven (Oerle)

Neogotische driebeukige kruisbasiliek uit 1911 naar ontwerp van W. van Aalst, rijksmonument 507725. Het model bestaat uit de toren met achtzijdige spits en vier pinakels, middenschip met zadeldak, lagere zijbeuken, driezijdig gesloten dwarsschip en koor, vieringtorentje, zijkapellen, aanbouwen, steunberen en verdiepte vensters.

## Bronnen en maatvoering

- [3D BAG, pand 0861100000366307](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0861100000366307): omtrek, dakvlakken en globale hoogten. De reconstructie mist de spits.
- [PDOK AHN DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogste gemeten punt NAP +65,914 m; maaiveld circa NAP +22,57 m. Modeltop +43,6 m boven maaiveld. DSM-gaten in de donkere spits worden met schuine dakvlakken en foto's overbrugd.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/507725) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:St._Jan_de_Doperkerk_(Veldhoven)): bouwvormen en gevelbeeld.

Oorsprong RD (153768, 381416), +X langs de kerk van toren naar koor, richting (-0,12, -0,9927739); de kerk vervangt BAG-pand 0861100000366307. Ramen, steunberen, de twee kapellen, pinakels, vieringtoren en bijgebouwen zijn vereenvoudigd en deels geschat uit foto's; het open vieringtorentje is voor printbaarheid gesloten en verdikt. Kleine dakramen, kruisen, open balustrades en antennes zijn vanwege schaal en kwetsbaarheid weggelaten. Er zijn slechts beperkt schuine fotoaanzichten beschikbaar; achterzijde en bijgebouwen verdienen extra controle.

## Genereren en printen

`node scripts/generate-sint-jan-de-doperkerk-veldhoven.mjs` schrijft de GLB, JSON en STL's. Een gesloten onderdeel is opgebouwd uit dakvlakken en bouwdelen, zonder steun op 1:1000; de onderste 0,5 m valt in de ondergrond. De kleinste losse torendetails zijn minimaal 0,9 m breed. De controle-uitsnede bevat het hele gebouw.
