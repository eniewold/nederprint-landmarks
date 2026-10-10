# Grote of Sint-Laurenskerk (Alkmaar)

| Bestand | Inhoud |
| --- | --- |
| `grote-kerk-alkmaar.glb` | Eén gesloten node `building:kerk`, meters, glTF Y omhoog |
| `grote-kerk-alkmaar.json` | RD-plaatsing, BAG-vervanging, maaiveldpunten en bronnen |
| `grote-kerk-alkmaar-1-1000.stl` | Zelfstandig model, vlakke voet op het printbed, 94,4 × 59,5 × 48,3 mm |

Regenereren: `node scripts/generate-grote-kerk-alkmaar.mjs`; de generator
gebruikt vaste gemeten maten en haalt geen veranderlijke bronnen op.

Oorsprong: RD (111453,36, 516309,45), bij de viering. +X volgt de hoofd- en
koornok naar het oosten, RD-hoek -13,92°. +Y wijst haaks naar de noordgevel.
Het modelmaaiveld is NAP +1,80 m; de vlakke voet ligt 0,50 m daaronder.
`groundOffsetMetres = -0.30` verankert het model in het PDOK-terrein.
De vier straatpunten bemonsteren ellipsoïdisch 44,32686–44,87114 m; de
laagste waarde, 44,3268556 m, is ook de terugval voor aangesneden selecties.
Vervangen pand: `NL.IMBAG.Pand.0361100000015852`; de huizen ernaast blijven PDOK.

De kerk is opgebouwd uit benoemde prisma's, dakvlakken en bouwdelen, zonder
hoogtelagen: middenschip, koor met driezijdige schildsluiting, het volledige
dwarsschip, vijf dwarse schildkappen per zijbeuk, aansluitende lessenaarsdaken,
de polygonale kooromgang, sacristie/consistorie, de zuidwestelijke vleugels en
vier portalen. De hoofdnok ligt op NAP +38,02 m, de koornok op +37,77 m,
de transeptnok op +37,86 m. De kapeldaken hebben gelijke nokken op +19,16 m.
Steunberen met schuine bovenzijden, vier transeptpinakels, afgeronde westelijke
hoekpijlers, twee traptorens, vier dakkapellen en de achtkantige dakruiter
met spits tot NAP +49,60 m maken de gevels en het silhouet herkenbaar.
Vensters en ingangen zijn blinde spitsboognissen van 0,35 m diep; de
lantaarn heeft acht gescheiden nissen en een massieve kern.

Geschat: de raam- en portaalindeling, hoogtes van de vensternissen,
steunberen, pinakelprofielen, afgeronde hoekpijlers, dakkapellen en
lantaarngeledingen. Deze zijn vanaf schuine foto's op de gemeten dak- en
gevelmaten geplaatst en voor 1:1000 vereenvoudigd. Weggelaten: fijn maaswerk,
beelden, kruisjes, windvaan, leien, gootlijsten, dakornamenten en regenpijpen
onder 0,9 m. De openingen van de lantaarn en de bogen van het zuidportaal
zijn als blinde nissen weergegeven om een massieve, steunvrije print te houden.

Controle (10 oktober 2026): Manifold `NoError`, één samenhangend volume,
geslacht 0, 3.394 driehoeken en 77,52 cm³ op 1:1000. Vrijstaande schachten en
steunberen zijn minimaal 1,06 mm breed; de spitsen versmallen alleen omhoog.
Er zijn geen horizontale ondervlakken boven de voet, afgezien van numerieke
ruis onder 0,001 m². Nistoppen staan op circa 55° en vragen geen losse steun.
De echte `createModelBundle`-export op 1:1000 is gecontroleerd: volume vóór
opvulling 76.983,62 mm³, erna 77.870,41 mm³ (+1,15%); de doorsnede op 1 mm
is één doorlopende contour. De volledige uitsnede van 130 × 130 m past om het
hele model. Maaiveld, vervanging en nokrichting zijn op de controlekaart bekeken.
De nieuwe catalogustest controleert beide transeptnokken, alle tien
kapelnokken, de dakruiter, de bijgebouwen en de RD-plaatsing; de volledige
landmarktests (273), lintcontrole en typecheck zijn geslaagd.

Vier schuine vergelijkingen naast dezelfde PDOK-preview, hoogte 30°:

| Kijkhoek | Toegevoegde herkenning |
| --- | --- |
| -35° | Achtkantige dakruiter met spits, vensternissen en steunberen rond het koor, zuidportaal en dakkapellen |
| 55° | Regelmatige noordelijke kapelrij, koorvensters, traptoren en transeptnissen |
| 145° | Afgeronde westelijke hoekpijlers, westportaal en vensternissen aan schip en zijbeuken |
| 235° | Zuidelijke kapelrij met steunberen, lage vleugels met dakkapellen, zuidelijke transeptgevel en traptoren |

De dakvlakken zijn tevens met AHN-DSM 0,5 m vergeleken: 12.957 meetpunten
binnen de BAG-contour (1 m van de rand), 99,7% gedekt, 88,8% binnen 1 m en
92,8% binnen 2 m; mediane afwijking +0,05 m. De vier fotoreferenties dekken
noordwest, west, zuidwest en zuidoost. Controlebeelden en exports blijven
buiten de repo.

[Controlekaart](http://localhost:3000/kaart/52.63250/4.74389/350/1x1/0).
Nakijken: de aansluiting van de lage zuidvleugels en de kooromgang op het
maaiveld en de afgeronde westelijke hoekpijlers.

Bronnen, geraadpleegd 10 oktober 2026:

- [BAG WFS, CC0](https://service.pdok.nl/lv/bag/wfs/v2_0), pand 0361100000015852.
- [AHN WCS, CC0](https://service.pdok.nl/rws/ahn/wcs/v1_0), DSM/DTM 0,5 m.
- [PDOK luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [3D BAG LoD2.2, CC BY 4.0](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0361100000015852), TU Delft/3DGI, voor dakvlakken en nokken.
- [Rijksmonumentenregister 7258](https://monumentenregister.cultureelerfgoed.nl/monumenten/7258).
- [Beschrijving van de kerk](https://nl.wikipedia.org/wiki/Grote_of_Sint-Laurenskerk_%28Alkmaar%29).
- [Schuine foto's](https://commons.wikimedia.org/wiki/Category:Sint_Laurenskerk,_Alkmaar): Txllxt TxllxT, CC BY-SA 4.0; Gasthuisstraat (SE), Begijnenstraat (East, maart 2011), Kerkstraat (NNE, maart 2011), Koorstraat (NNW) en Kerkplein (transept/schip). Alleen visueel geraadpleegd, foto's niet opgenomen.
