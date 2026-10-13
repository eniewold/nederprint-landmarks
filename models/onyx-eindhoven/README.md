# Onyx (Eindhoven)

Woontoren van diederendirrix, gereed in 2019, aan de Mathildelaan. Het gebouw
heeft 22 woonverdiepingen en een penthouse, met een verlichte kroon, verticale
gemetselde gevelvelden en balkonbakken. De backloghint 2021 is gecorrigeerd;
BAG vermeldt 2019, de balkonleverancier circa 84 m hoogte.

## Bestanden en plaatsing

`onyx-eindhoven.glb` bevat één gesloten building-node, meters, Y omhoog;
`onyx-eindhoven.json` de plaatsing; `onyx-eindhoven-1-1000.stl` een vlakke voet,
circa 27,6 × 24,7 × 84,0 mm. Generator: `scripts/generate-onyx-eindhoven.mjs`.

Oorsprong RD (160952, 383524), +X op 13,4°, z = 0 op NAP +16,95 m,
voet z = -1,2 m. Vier straat-/parkpunten geven ellipsoïdisch +60,55689 tot
+61,87920 m; de laagste is ook de terugvalhoogte. De voet loopt onder de
plaatselijk hogere parkzijde door. Er is geen nieuwe plaat over het park.

## Pand-id’s en volledige omgeving

Onyx-pand `0772100001022321` wordt vervangen, samen met garagepand
`0772100001047018`, dat in PDOK een tweede scan van dezelfde toren én een
scan van een deel van Philips Lighting levert. Philips Lighting blijft via
zijn eigen pand `0772100001003342` in PDOK behouden. De oude scans verschillen
plaatselijk circa 0,3–0,8 m langs kleine zuidelijke randstroken; die oude
Lighting-omgeving wordt niet als nieuw toren-/garagevolume gedubbeld.

De toren, achterste bouwdeel, volledige entree-/restaurantplint en beide
lagere hoekvelden zijn meegenomen. De ondergrondse parkeergarage krijgt
geen fictief bovenbouwblok; de openbare omgeving blijft zichtbaar.

## Bouwvlakken en gemeten maten

De doorlopende woonprisma’s eindigen op NAP +94,482 m en de achterste
bouwstrook op +95,503 m. Twee hoekterrassen liggen op +87,689 en +87,690 m.
De open kroon eindigt op +99,786 m. Daklift-/techniekkern: +98,452 m;
techniekkast oost: +98,589 m; westelijke kasten: circa +95,619 en +97,127 m.
De losse kroonstijlen blijven met het gebouw verbonden, de dakruimte tussen
de stijlen en kasten blijft open. Alle daken en bouwdelen zijn benoemde
vlakken/prisma’s; er zijn geen gestapelde DSM-hoogtelagen.

## Geschat en weggelaten

Torenplannen, hoekterrassen en dakcontouren zijn circa 0,5–1 m vereenvoudigd
uit BAG/AHN/3D BAG. Vensters van circa 1,5 × 2,7 m, laagritme 3,15 m,
drie balkonvelden, restaurantpuien, kleine facetribben en kroonstijlen zijn
uit schuine architectfoto’s geschat. De balkonbakken zijn 1,4 m diep met
een bovenrand van 0,9 m en een schuine onderzijde van circa 45–48°;
de onderzijde is een printvereenvoudiging. Kroonstijlen zijn circa 1,1 m
dik om ze op 1:1000 aan het model te laten zitten. Gewone vensters zijn
0,45 m diepe blinde nissen.

Fijne kozijnroedes, glazen balkonrelings, lampjes, reclame en zonnepanelen
smaller/dunner dan 0,9 m zijn weggelaten of samengevoegd in gevelvelden.
De kleur van de verlichting en metselwerk is geen aparte materiaalklasse.

## Controle

Generator, STL en opnieuw ingelezen GLB: `NoError`, één verbonden volume.
De permanente test controleert één geplaatste toren, beide vervangen panden,
behoud van Lighting, vijf dak-/terrashoogtes, open kroon, gevelnis en
uitstekende balkonbakken. De 45°-printcorrectie voegt 0,512% volume toe,
zonder afzonderlijk steunmateriaal. Vier renders zijn naast gelijke hoeken
van de echte PDOK-reconstructie en schuine architectfoto’s beoordeeld:
vensterreliëf op alle zijden, verticale ribben, balkons, glasplint en
regelmatige open kroon verbeteren de vlakke PDOK-gevels.

GLTFLoader, kaart en volledige printpreview zijn gecontroleerd. De exacte
1:1000-preview-export omvat de hele toren op 130 × 130 mm: 168 objecten,
77.304 driehoeken, 85,8 mm hoogte met ondergrond. Controlebeelden en
bronfoto’s blijven buiten de repo.

## Bronnen

- [diederendirrix](https://www.diederendirrix.nl/nl/projecten/woontoren-onyx-eindhoven/),
  architect, 2019, kroon en gebouwindeling; schuine foto’s van Mitchell van Eijk
  uitsluitend auteursrechtelijke referentie, geen overgenomen tekeningen.
- [Schöck](https://www.schoeck.com/nl/detail/onyx-toren), balkonleverancier,
  circa 84 m hoogte en balkonbakken.
- [BAG](https://service.pdok.nl/lv/bag/wfs/v2_0), CC0.
- [AHN DSM/DTM](https://service.pdok.nl/rws/ahn/wcs/v1_0), CC0.
- [Luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100001022321),
  TU Delft/3DGI, CC BY 4.0.
- PDOK 3D Tiles: controle van de dubbele toren-/garage- en Lighting-scans.
