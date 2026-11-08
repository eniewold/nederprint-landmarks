# Nederlands Hervormde Kerk (Budel)

Het Kerkje is een eenvoudige driezijdig gesloten zaalkerk uit 1812. Deze weergave volgt de actuele torenloze toestand: de dakruiter is in oktober 2020 om veiligheidsredenen verwijderd. De beheerder schrijft dat terugplaatsing bij de restauratie is voorzien, maar dat de restauratie is uitgesteld tot minstens 2027. Oude foto's tonen de dakruiter dus nog wel.

De generator `scripts/generate-nederlands-hervormde-kerk-budel.mjs` maakt een GLB, catalogus-JSON en STL's op 1:100 en 1:1000. Het model vervangt BAG-pand 1706100000058849, heeft oorsprong RD 168166 / 365070 en een lokale X-as ongeveer zuidzuidoost. Het maaiveld is +31,668 m NAP; 3DBAG vermeldt een maximale dakhoogte +43,204 m NAP. Het gebouw is ongeveer 20,4 bij 8,6 m en het hoofdvolume ongeveer 11,54 m hoog.

Het schip, achteraanbouw en de dakvlakken volgen de BAG-contour en de dakhoogtes uit 3DBAG/AHN5. Posities en maten van vensternissen en ingang zijn op foto's geschat en in 1:1000 vereenvoudigd; fijn metselwerk, kozijnen en glas ontbreken. De dakruiter is weggelaten omdat deze daadwerkelijk is verwijderd, niet wegens een hoogtegat. De aanbouw en de terreinverbinding zijn vereenvoudigd.

Bronnen: [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1706100000058849), [AHN5 WCS](https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec), [beheerder nieuws](https://www.hetkerkjebudel.nl/nieuws), [actuele restauratiestand](https://www.hetkerkjebudel.nl/), [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/11269), [historische foto's](https://commons.wikimedia.org/wiki/File:Exterieur_voorzijde_-_Budel_-_20044638_-_RCE.jpg).

De generator controleert één gesloten component; de test controleert catalogusplaatsing en steunvolume op 1:1000. Twee previewexports tonen hetzelfde gebied met en zonder landmark. Controleer op de kaart plaatsing, maaiveldaansluiting en de voorgevel.
