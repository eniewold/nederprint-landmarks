# Brugkerk (Waddinxveen)

Vereenvoudigd model van de neoclassicistische kerk uit 1837, rijksmonument 38202.

## Bestanden en ligging

- `brugkerk-waddinxveen.glb`: meters, glTF Y omhoog; één gesloten `building:brugkerk`-node.
- `brugkerk-waddinxveen.json`: RD-oorsprong `[104989, 450929]`, X-as `[0.9762, -0.2169]`, vervangt BAG-pand `0627100000010577`.
- `brugkerk-waddinxveen-1-100.stl` en `brugkerk-waddinxveen-1-1000.stl`: printmodellen in millimeters op 1:100 en 1:1000.
- Generator: `scripts/generate-brugkerk-waddinxveen.mjs`.

## Onderdelen en aannames

De kerk is opgebouwd uit twee kruisende schilddaken, de voorgevel met ingangsportaal en fronton, een toren met twee smallere geledingen, blinde raam- en galmgatnissen, pilasters en twee lage zijportalen en een lagere achterbouw met schilddak en achthoekige nevenbouw. De oorspronkelijke dakvlakken en nokken zijn beoordeeld met 3D BAG en AHN5-DSM; de nok ligt op ongeveer NAP +14,78 m en de torentop rond NAP +24,79 m; het geschatte maaiveld ligt op NAP -1,56 m. De contour en oriëntatie volgen de BAG en de zichtbare daknok. Een ontbrekende AHN-cel binnen de contour ligt niet op de torentop; het dakvlak volgt de omliggende metingen en 3D BAG.

Afmetingen en plaatsing van portaal, fronton, geledingen, vensters en de lage verbinding tussen de achtergebouwen zijn vereenvoudigd geschat uit foto's en de luchtfoto. De punt van het torentje is verdikt voor de 1:1000-print; details kleiner dan 0,9 m zoals de windvaan, het maaswerk en dunne portaalzuilen zijn weggelaten. De schoorsteen op de historische RCE-foto uit 1976 is op de foto uit 2024 niet meer te zien en is weggelaten.

## Controle

Het generatorscript geeft `NoError`, één verbonden deel en een afmeting van ongeveer 36,3 × 36,1 × 26,7 mm op 1:1000. Een modeltest controleert de catalogus, BAG-vervanging, plaatsing, de gesloten mesh en de overhangopvulling. Een volledige uitsnede op 1:1000 is zonder ondersteuning in de preview gecontroleerd.

## Bronnen

- [Rijksmonumentenregister 38202](https://monumentenregister.cultureelerfgoed.nl/monumenten/38202)
- [3D BAG: pand 0627100000010577](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0627100000010577)
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), DSM 0,5 m en PDOK actuele luchtfoto.
- [Wikimedia Commons: Brugkerk](https://commons.wikimedia.org/wiki/File:Brugkerk_Waddinxveen.jpg)
- [RCE-foto van de voorgevel via Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Overzicht_-_Waddinxveen_-_20248555_-_RCE.jpg)


- [Recente foto uit 2024 via Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Waddixveen,_de_Brugkerk_RM38202_IMG_0544_2024-04-07_16.24.jpg)
- [Linker zij- en achtergevel via Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Linker_zijgevel_en_gedeelte_achtergevel_-_Waddinxveen_-_20248564_-_RCE.jpg)
- [Rechter zij- en achtergevel via Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Rechter_zij-_en_achtergevel_-_Waddinxveen_-_20248560_-_RCE.jpg)

