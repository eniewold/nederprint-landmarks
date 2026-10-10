# SnowWorld Landgraaf

Het bestaande BAG-complex met hoofdskihal, de lagere gebogen zuidhal, oefenhal, ontvangst- en conferentiegebouw, chaletfronten, techniekzone en Alpine Hotel. De Wilhelminaberg, losse bijgebouwen en het klimpark blijven de oorspronkelijke PDOK-context.

## Bronnen en maatvoering

- BAG-pand `0882100000017847`, PDOK actuele luchtfoto en AHN DSM/DTM 0,5 m; RD-bbox `[199000,320200,200000,321200]`. De BAG bevat hallen én hotel als één pand. De hoofdas volgt de daknok en gevelrichting, oorsprong `[199520,320760]`, +X naar het oostnoordoosten, +Y naar het noordnoordwesten.
- [De Kok Staalbouw: skihallen Landgraaf](https://www.kokstaal.nl/en/projects/landgraaf-ski-halls/), bouwfoto's voor de dakknik, lagere hal en staalconstructie. De opgegeven circa 550 m is een nominale projectmaat; het model volgt de huidige geprojecteerde BAG-contour van circa 423 m langs de gebouwas, en is niet uitgerekt tot de nominale pistelengte.
- [Vandenbergh–Windemuller: skibaan](https://www.vwarchitectuur.nl/project/skibaan-snowworld-landgraaf/) en [sporthotel](https://www.vwarchitectuur.nl/project/sporthotel-snowworld-landgraaf/), gevel- en bouwfoto's van het hotel met asymmetrische kap, houten front en glazen portaal.
- Commons: [SnowWorld.JPG](https://commons.wikimedia.org/wiki/File:SnowWorld.JPG), Maurice van Bruggen, CC BY-SA 3.0; [Landgraaf-SnowWorld.JPG](https://commons.wikimedia.org/wiki/File:Landgraaf-SnowWorld.JPG), Romaine, CC0; [Snowworld Landgraaf.jpg](https://commons.wikimedia.org/wiki/File:Snowworld_Landgraaf.jpg), Lotteberkhout, CC BY-SA 3.0. De laatste foto toont de vroegere entree; huidige contour en hoogtes zijn getoetst aan BAG, luchtfoto en AHN.

De datum is NAP +151,2391 m, de DTM-waarde op het terrein vóór de gevel bij lokaal `[-40,-45]`. Dezelfde plek meet 197,072499 m in de PDOK-reconstructie; die waarde staat als fallback in de catalogus. Een tweede punt met een DTM-gat is niet gebruikt. Het model begint op NAP +149,50 m, onder het laagste maaiveld.

Het hoge dak heeft een vlakke middenstrook, een noordvlak met ongeveer 0,16 m daling per meter en een langshelling van circa 0,19–0,20. De hoogste geldige AHN-return binnen BAG is +232,9411 m. De geïnterpoleerde dakvlakken bereiken circa +233,00 m. Langs de gebogen zuidrand ligt een circa 3,1 m lager dak; dit is een afzonderlijke hal, niet één gewelfde kap. De hotelnok ligt op +180,55 m, met ongelijke dakzijden en goothoogten +173,48 en +169,10 m.

## Model, schattingen en weggelaten details

Doorlopende dakvlakken worden gemaakt uit bouwkundige doorsneden en omhulsels tussen hellingovergangen, begrensd door de BAG-polygoon. Er worden geen DSM-hoogtelagen gestapeld. De drie hoofdvelden met zonnepanelen volgen de onderliggende dakvlakken als reliëf. De korte oefenhal en verbindingshal hebben eigen dakhellingen. De entree bevat vier kleine chaletkappen, twee grotere kappen, de hogere middenzone en installaties. Het hotel heeft een eigen asymmetrische kap, houten frontvolume, raamnissen en portaal.

De dakknik, zuidhelling en overgang bij het boveneinde zijn tussen gemeten AHN-vlakken geïnterpoleerd. De exacte chaletspanten, glasindeling, installaties en houten geveldetails zijn uit foto's geschat. Het hotelportaal is verdikt en gesloten; gevelnissen zijn slechts 0,35 m diep. De lage onderbouw is permanent gevuld tot onder het maaiveld, zodat de hellende hallen aan de heuvel en aan een printbasis aansluiten.

Kleine dakroeden, paneelcellen, kabels, leuningen, belettering en antennes zijn weggelaten omdat hun vrijstaande doorsnede onder 0,9 m ligt. Het open interieur en individuele stoeltjesliften zijn niet zichtbaar in het gesloten exterieur. Klimpark- en achtbaankabels horen bij de buitenomgeving, blijven PDOK-context waar beschikbaar en zijn niet verdikt tot een nieuw gebouwvolume.

## Print en controle

`node scripts/generate-snowworld-landgraaf.mjs` schrijft GLB in meters/Y-up, catalogus en STL in millimeters/Z-up op 1:1000. De STL bevat dezelfde permanente 45°-opvulling als de webshop en een grondplaat van 1 mm: één positief verbonden printdeel, `NoError`, **425,22 × 136,26 × 84,50 mm**. De opvulling voegt circa 106 m³ toe, minder dan 0,01% van het modelvolume. De lange STL vraagt een groot bed; gebruik voor een bed van 200 mm de matrixexport.

De volledige preview is geëxporteerd op **1:1000** uit een gedraaide RD-uitsnede van **600 × 300 m**, centrum `[199700,320750]`. De drie middelste tegels van 200 × 200 mm dekken de complete geometrie; de positieve volumes en gesloten geometrie zijn ook na schaling gecontroleerd. Een ruimere vierkante uitsnede overschrijdt de bestaande vertexlimiet door het heuvelterrein.

Vier schuine aanzichten zijn naast dezelfde PDOK-camera en de bronfoto's gecontroleerd: voorzijde heeft de aparte chaletkappen en hotelkap; noordzijde de doorlopende helling en paneelvelden; boveneinde de hoge uitloop en afzonderlijke dakvlakken; zuidzijde de gebogen lagere hal en oefenhal. PDOK geeft hier een grof blok zonder deze gevel- en dakdetails. De 304 model- en API-tests slagen; de nieuwe test bewaakt langshelling, lagere zuidrand, hotelkap, chaletfronten en BAG-vervanging.

[Kaartcontrole](http://localhost:3057/kaart/50.8748/6.0224/1600/1x2/90?matrix=1&printScale=1000): controleer de lagere gebogen zuidhal, afzonderlijke chaletkappen, paneelvelden en asymmetrische hotelkap.
