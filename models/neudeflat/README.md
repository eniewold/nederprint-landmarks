# Neudeflat (Utrecht)

De huidige woonflat op de wigvormige kavel aan het Neude, na de transformatie
van A3 Architecten in 2017. Het oorspronkelijke gebouw van Hugh Maaskant
dateert uit 1961–1963; BAG vermeldt 1963. De nieuwe balkons/serres, glasbanden,
commerciële etages en westelijke dakopbouw zijn onderdeel van het model.

## Bestanden en plaatsing

`neudeflat.glb`: één gesloten building-node, meters, Y omhoog.
`neudeflat.json`: plaatsing en bronmaten. `neudeflat-1-1000.stl`: vlakke voet,
circa 27,6 × 23,9 × 59,1 mm. Generator: `scripts/generate-neudeflat.mjs`.

Oorsprong RD (136544, 456074), +X oost, +Y noord, z = 0 op NAP +3,8 m,
voet z = -1,2 m. Vier straatpunten geven ellipsoïdisch +47,22958 tot
+48,05819 m; de laagste is ook de terugvalhoogte. Alleen BAG-pand
`0344100000048613` wordt vervangen. De naastgelegen historische panden
en het Neude blijven PDOK; er wordt geen terreinplaat toegevoegd.

## Opbouw

De doorlopende wigvormige bouwprisma’s krijgen een hoofddak op gemeten
NAP +59,051 m en een westelijke dak-/liftopbouw op +61,656 m. De commerciële
voet omvat de lage westelijke entree, op circa +8,411 m. Vier grote
ventilatiekasten op het hoofddak zijn gemeten rond +59,439 tot +59,711 m;
hun contouren zijn vereenvoudigd tot circa 1,3 × 1,3 m. Alle dakvlakken zijn
vlak; er zijn geen gestapelde DSM-hoogtelagen.

Brede, blinde glasvelden maken de horizontale banden leesbaar. Diepe nissen
van 2 m aan de Neude-kop en circa 1,6–2 m aan de achterste kop stellen de
balkons/serres voor; de vloerbanden blijven met de toren verbonden.

## Geschat en weggelaten

De regelmatige toren- en dakplannen zijn circa 0,5–1 m vereenvoudigd uit
BAG/3D BAG. Verdiepingsritme 3,2 m, glasvelden, balkon-/serreposities en
-dieptes en commerciële puien zijn uit de huidige gevelbouwersfoto’s
geschat. Gewone glasvelden zijn 0,4 m diep, circa 4,5 × 2,05 m; de kleinere
velden van de westelijke kern volgen hetzelfde ritme. Ventilatiecontouren
zijn circa 0,5 m onzeker; de hoogtes komen uit AHN.

De dunne stalen dakframebalken, balustrades, kozijnroedes en overige
kleine dakpunten zijn smaller dan 0,9 m en niet vrijstaand opgenomen;
het dakframe is daardoor bewust niet als losse constructie geprint.

## Controle

Generator, STL en opnieuw ingelezen GLB: `NoError`, één verbonden volume.
Permanente test controleert plaatsing, vervangen pand, beide dakhoogtes,
lage entree, gevelreliëf en de 2 m diepe balkonnis aan het Neude. De print-
correctie bij 45° voegt 1,091% volume toe onder nissen, zonder apart
steunmateriaal. Vier renders zijn naast gelijke hoeken van de echte
PDOK-reconstructie en schuine bronfoto’s beoordeeld: alle zijden krijgen
glas-/balkonreliëf, de volledige voet en gemeten dakopbouwen blijven zichtbaar.
GLTFLoader, kaart en volledige printpreview zijn gecontroleerd.

De exacte 1:1000-preview-export omvat het hele gebouw op 110 × 110 mm:
184 objecten, 56.940 driehoeken, 61,8 mm hoogte met ondergrond. Bronfoto’s
en controlebeelden blijven buiten de repo.

## Bronnen

- [Facedo](https://facedo.nl/portfolio-item/transformatie-neudeflat/),
  gevelbouwer: huidige schuine buitenfoto’s en transformatie 2017;
  uitsluitend auteursrechtelijke referentie, auteur niet vermeld.
- [A3 Architecten](https://www.a3architecten.com/nieuws-neudeflat/),
  architect: nieuwe kozijnen, panelen en balkons/serres.
- [BAG](https://service.pdok.nl/lv/bag/wfs/v2_0), CC0.
- [AHN DSM/DTM](https://service.pdok.nl/rws/ahn/wcs/v1_0), CC0.
- [Luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000048613),
  TU Delft/3DGI, CC BY 4.0.
