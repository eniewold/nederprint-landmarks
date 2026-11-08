# Sint Antonius Abtkerk (De Mortel)

Neogotische kruiskerk uit 1902-1904 met vierkante westtoren, traptorentje, dakruiter en zevenzijdig koor. De generator `scripts/generate-sint-antonius-abtkerk-de-mortel.mjs` maakt GLB, catalogus-JSON en STL's op 1:100 en 1:1000. Het model vervangt BAG-pand 1652100000000980.

De oorsprong is RD 177291,75 / 394720,75 bij de westtoren; de lokale X-as loopt naar het koor. Maaiveldhoogte is +18,45 m NAP. AHN4 geeft een spitsmaximum van +63,6195 m NAP, circa 45,17 m boven maaiveld; AHN5 geeft +63,058 m. Beide rasters hebben direct naast de spits gaten, maar vullen deze wederzijds aan: AHN4 meet op 177292,25 / 394720,75 waar AHN5 nodata heeft, en AHN5 meet op 177292,25 / 394721,25 waar AHN4 nodata heeft. De hoogte van het geprinte spitslichaam is vereenvoudigd tot 45,05 m boven maaiveld.

Schip, zijschepen, dwarsarmen, koor, kapellen, aanbouw, torens en daken zijn als vlakken en bouwdelen opgebouwd. Positie, afmetingen en details van kapellen, portaal, traptorentje, venster- en galmgatnissen zijn op foto's en hoogtebeeld geschat en voor 1:1000 vereenvoudigd. Dun maaswerk, wijzers en kruisen zijn weggelaten; de ingesnoerde torenspits en open dakruiter zijn gesloten geïnterpreteerd.

Bronnen: [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1652100000000980), [AHN4 WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), [AHN5 WCS](https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec), [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/518089), [Wikimedia met schuine achterfoto](https://commons.wikimedia.org/wiki/File:De_Mortel_Rijksmonument_518089_kerk_Sint_Antonius_Abt_achter-zijkant.JPG).

De generator controleert één gesloten component. Een gerichte test controleert catalogusplaatsing, steunvolume en doorsneden. Twee ruime previewexports zijn vergeleken met PDOK; controleer plaatsing, terrein en koor op de kaart.
