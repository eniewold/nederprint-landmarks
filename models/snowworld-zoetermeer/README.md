# SnowWorld Zoetermeer

Het bestaande complex met twee lagere hallen, de in 2016 verlengde derde baan, het voorcomplex met afzonderlijke chaletdaken, installaties, paneelvelden, zijtrap en uitzichtpunt. Het losse gebouw ten zuiden van het complex en het park blijven PDOK-geometrie. Toekomstige hotel- en speelhalplannen zijn niet toegevoegd.

## Bronnen en maatvoering

- PDOK BAG-pand `0637100000171219`, actuele luchtfoto en AHN DSM/DTM 0,5 m, RD-bbox `[90900,453800,91450,454350]`.
- [Gemeente: beeldkwaliteitplan van de verlengde derde baan](https://www.zoetermeer.nl/_flysystem/media/7.-beeldkwaliteitsplan-snowworld.pdf): vorm van de verhoogde hal, zijtrap, uitzichtpunt en staalconstructie. [Gemeente: nieuwe uitbreidingsplannen](https://www.zoetermeer.nl/uitbreidingsnowworld) onderscheidt de bestaande situatie van plannen die nog worden uitgewerkt.
- Commons: [frontcomplex, 2010](https://commons.wikimedia.org/wiki/File:Zoetermeer_Meerzicht_Snowworld_(02).JPG), S.J. de Waard, CC BY 3.0; [zijaanzicht van de oorspronkelijke derde baan](https://commons.wikimedia.org/wiki/File:SnowWorld_Zoetermeer_Netherlands.JPG), Steven Lek, publiek domein; [verlengde baan vanuit de polder, 2017](https://commons.wikimedia.org/wiki/File:Snowworld_Zoetermeer_(36995235085).jpg), FaceMePLS, CC BY 2.0. De oude foto geeft gevel- en vakwerkdetails; het eindprofiel volgt de huidige luchtfoto, BAG en AHN.

De as volgt de langse dakrichting: oorsprong RD `[91270,453890]`, +X naar het noordwesten, +Y naar het zuidwesten. De laaggelegen voorzijde heeft een lokale datum NAP −3,20 m; de maaiveldmeting voor de kaart is 40,530596 m in het PDOK-stelsel op één terreinpunt vóór het gebouw. Een lager wegpunt is bewust niet gebruikt.

Het hoogste dak is geïnterpoleerd tot NAP +66,73 m; de grootste geldige AHN-return is +67,4737 m. De backlogwaarde +68,4 m is dus geen ingemodelleerde dakhoogte. Het dak heeft een tonvormige dwarsdoorsnede, circa 31 m breed en 5,75 m welving. Het langsprofiel bevat bouwkundige hellingovergangen. De twee lagere hallen zijn samen circa 60 m breed, met twee ondiepe dakwelvingen en een vlakker boveneinde op circa NAP +16,86 m. Hun daken zijn niet verward met de hogere derde baan.

## Model en schattingen

Daken bestaan uit omhullende doorsneden en doorlopende vlakken; er zijn geen gestapelde DSM-hoogtelagen. De paneelvelden volgen de dakwelving. Het voorcomplex bevat vijf kleinere zadeldaken, een grotere glazen middenkap en het aparte schilddak aan de restaurantzijde. Gevelglas is als ondiepe nis weergegeven.

AHN-returns ontbreken op delen van het lichte metalen dak. Daar zijn dakhelling en dwarswelving geïnterpoleerd tussen de gemeten vlakken en gecontroleerd op foto's. Staalprofielen zijn verdikt tot 1,05–1,30 m; kleine relingen, glasroeden, kabels, belettering en individuele zonnecellen zijn weggelaten. Trapgroepen, de precieze indeling van het uitzichtpunt, entreeglas en dakoverstekken zijn vereenvoudigd. Een doorlopende centrale steunwand en permanente 45°-opvulling maken de verhoogde hal printbaar; hierdoor is de onderbouw dichter dan de werkelijke open staalconstructie.

## Print en controle

`node scripts/generate-snowworld-zoetermeer.mjs` schrijft GLB (meters, Y-up), catalogus en STL (millimeters, Z-up, 1:1000). De zelfstandige STL krijgt dezelfde permanente 45°-opvulling als de webshop plus een grondplaat van 1 mm: één gesloten printdeel, `NoError`, circa **318,33 × 144,30 × 71,93 mm**. Een bed van minimaal 319 mm of een matrixexport is nodig. De opvulling voegt circa 18% volume toe.

Controle: vier volledige schuine aanzichten naast PDOK en de referentiefoto's, de kaart, en een volledige **400 × 400 m/mm** uitsnede op **1:1000**, centrum RD `[91270,454030]`. De gehele lange hal en het voorcomplex vallen binnen de uitsnede. Tests bewaken het langsprofiel, de tonvormige dwarsdoorsnede, lagere dakwelvingen, middenkap, uitzichtpunt en BAG-vervanging.

[Kaartcontrole](http://localhost:3060/kaart/52.0709/4.4576/1000/1x1/0): controleer de drie dakprofielen, chaletdaken, paneelvelden en de dichter gemaakte onderbouw van de lange baan.
