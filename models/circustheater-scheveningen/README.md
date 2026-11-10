# AFAS Circustheater, Scheveningen

Vereenvoudigd gesloten landmarkmodel van het theatercomplex aan de Circusstraat. Het GLB gebruikt meters en glTF Y omhoog; de oorsprong ligt op RD (79343,7, 458632,3) en +X wijst oost. Het model vervangt BAG-pand `0518100000211276`. De STL is op 1:1000 in millimeters; de voet ligt 0,5 m onder de modeloorsprong.

## Opbouw en maten

- De lage vleugels volgen de vereenvoudigde BAG-omtrek. Het hoofddak ligt rond NAP +16,21 m; twee lagere dakdelen rond +12,1 m. Het maaiveld is NAP +5,287 m.
- De koepel heeft een straal van circa 22,4 m; het omwentelingsprofiel volgt het AHN-DSM en loopt van circa NAP +17 m aan de rand tot +26,9 m bij de kern. De achthoekige lantaarn reikt naar circa +29,15 m.
- De toneeltoren heeft een bovenzijde rond NAP +38,56 m, met een lager aangrenzend toneelvolume op circa +21,31 m. De ronde entree en zijn kap zijn in vorm benaderd.
- De glazen gevel is als ondiepe, spits afgedekte nissen benaderd. Afmetingen en ritme van de nissen, de lantaarn en entreebekroning zijn geschat uit foto en ortho; het AHN meet het glasreliëf niet.

## Bronnen

- [3D BAG pand 0518100000211276](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000211276), LoD2.2 met AHN5 uit 2022; contour, dakhoogtes en maaiveld.
- PDOK AHN DSM 0,5 m en actuele luchtfoto, voor het koepelprofiel en de daken.
- [Wikimedia Commons: AFAS Circustheater](https://commons.wikimedia.org/wiki/File:Afas_Circustheater-Scheveningen.jpg), voor entree, glazen gevel en ronde gevel.
- [Aerophotostock: Scheveningen](https://www.aerophotostock.com/-/galleries/luchtfoto-a-z/s/scheveningen), schuine luchtfoto's 72374 en 72375 voor de koepel en zijvolumes; de achtergevel is deels afgedekt en de opname is ouder dan de torenverhoging.
- [Stieva: toneeltoren](https://stievagroep.nl/projecten/139/120-ton-stalen-balken-naar-35-meter-hoogte) en [Saan: renovatie](https://www.saan.nl/projecten/elektrische-hijswerkzaamheden-bij-afas-circustheater/), bouwfoto's en toelichting op de circa 7 m hogere toren in 2020.

Kleine installaties en tekst zijn weggelaten waar zij niet leesbaar zijn op 1:1000. De luifel is als een vereenvoudigde hellende kraag gemodelleerd; de maatvoering van entree en vensterritme moet op de kaart worden beoordeeld.

Generator: `node scripts/generate-circustheater-scheveningen.mjs`; met `--out <map>` kan een proef buiten de catalogus worden geschreven.

