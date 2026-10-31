# Pharos (Den Haag)

Vereenvoudigd, printbaar model van Pharos, de woontoren van DOK architecten (Liesbeth van der Pol, 2009) op de hoek van de Loevesteinlaan en de Melis Stokelaan in Escamp, bij het Zuiderpark. De toren heeft 25 lagen met 88 woningen in gele baksteen en is opgebouwd als "voeten, lijf en hoofd": op de lagen 6 tot en met 11 kragen vier balkonstapels op de hoeken uit, elk boven een schuine voet die naar het maaiveld breder wordt. Op het dak staan twee witte installatiekasten en een mast tot circa 80 m boven het maaiveld.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `pharos-den-haag.glb` | Model in meters, Y omhoog, één node: `building:pharos-den-haag` |
| `pharos-den-haag.json` | Catalogusitem |
| `pharos-den-haag-1-1000.stl` | Los te printen op 1:1000 (26 × 33 × 81 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[79235.03, 451777.65]`, in het hart van de kern. De X-as loopt langs de lange gevels naar het noordoosten (40,6° op RD-oost, de richting van de BAG-randen), Y naar het noordwesten; de toren is spiegelsymmetrisch in Y = 0. Lokaal z = 0 is NAP +0,35 m, het maaiveld rond de toren (AHN-DTM 0,27–0,39); `groundHeight` is 43,81 m (NAP +0,35 plus de NLGEO2018-geoïde van 43,46 m ter plekke) en `groundOffsetMetres` −0,15.

De BAG-contour van het pand (circa 75 × 70 m) omvat ook de ondergrondse parkeergarage onder het grasdek rond de toren. Die ligt op maaiveldhoogte en zit niet in het model; ook de 3D BAG heeft daar geen dakvlakken.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Kern | 21,6 × 18,1 m | +72,5 m (72,6 m boven maaiveld) | 3D BAG LoD2.2 (72,51–72,52, 70e percentiel 72,54), AHN-DSM 72–73 |
| Balkon- en erkerzones noordwest en zuidoost | 21,6 × 3,0–3,2 m | +66,5 m | 3D BAG (66,49–66,57), AHN-DSM 66–67 |
| Glazen erkers aan de uiteinden van de zones | 3,4 m breed | tot +66,5 m | foto's |
| Hoekstapels (noord, oost, zuidwest, west) | 3,9 × 4,2 m en 4,5 × 4,0 m, op de lagen 6–11 | van +17,9 tot +34,0 m | 3D BAG-dakvlakken (33,8–34,0) en DSM-plaats, foto's |
| Schuine voeten onder de stapels | 2,0 m dik, op het maaiveld even ver uit de gevel als de stapel | tot +16,2 m | foto's |
| Balkonstapel zuidwestgevel | 13,7 m breed, 1,5 m voor de gevel, lagen 1–5 en 12–22 | tot +64,7 m | AHN-DSM, foto's |
| Glazen entreestrook noordoostgevel | 5,0 m breed, 0,4 m diep | tot +17,7 m | foto's |
| Installatiekasten | twee zeshoeken van 15,9 × 2,4 m | +75,2 m | 3D BAG (75,20–75,25), AHN-DSM, luchtfoto |
| Liftopbouw | 1,5 × 2,2 m | +76,0 m | 3D BAG (75,86–76,02) |
| Mast | 1,0 × 1,0 m (verdikt) | +80,3 m | Wikipedia (80 m met mast), foto vanuit het Zuiderpark |

Lagen: begane grond 3,6 m, daarboven 24 lagen van 2,84 m, zodat de zones na laag 22 op +66,5 m eindigen en het lijf (lagen 6–11) op +18 tot +35 m ligt. Gevelreliëf: vensters van 1,8 m op een raster van circa 3 m als blinde nissen van 0,35 m met een plafond onder 45°; glazen erkers als nissen van 2,0–2,2 m per laag; open balkons als nissen van 0,9 m diep met een plafond onder 45° (twee per laag, gescheiden door een penant van 0,9 m; in de hoekstapels één per laag met een zijwand van 0,9 m aan de buitenkant). Onder de hoekstapels en de balkonstapel van de zuidwestgevel loopt een kraag onder 45° naar de gevel.

## Geschat en weggelaten

- De naam Pharos is nagekeken bij DOK architecten; de hoogbouwlijst noemt 75 m (80 m met mast), de 3D BAG geeft 72,6 m boven het maaiveld.
- Verdiepingshoogtes, het vensterraster, de breedte van de erkers en balkons en de plaats van de entreestrook zijn uit foto's geschat.
- De hoekstapels: plaats en bovenkant uit de 3D BAG, de onderkant en de uitkraging uit foto's. Het AHN-DSM meet binnen de stapels maar 20–30 m (open balkons met glazen hekken); de 3D BAG en de foto's (zes lagen tot circa +35 m) zijn gevolgd. De zijwanden die op foto's nog ongeveer een laag boven het bovenste balkon uitsteken, zijn niet apart gemodelleerd.
- De voeten: op de foto's schuine wanden die op het maaiveld even ver uitsteken als de stapel erboven en de gevel op circa 16 m raken; hun dikte (2,0 m) en plaats aan de buitenkant van elke stapel zijn geschat. De kraag onder 45° vervangt de horizontale onderkant van de stapels en de twee lagen hoge consoles die op een detailfoto tussen voet en stapel zitten.
- De mast is op foto's circa 0,4 m dik en is verdikt tot 1,0 m; hij staat op de liftopbouw in het midden van de noordoostgevel.
- Weggelaten: glazen balkonhekken, de lichte betonbanden in de gevel, de glazenwasinstallatie en de railing op het dak (kleiner dan 0,9 m), en de inritten en het grasdek van de parkeergarage (op maaiveldhoogte).

## Controle

`node scripts/generate-pharos-den-haag.mjs` geeft `NoError`, genus 0 en één gesloten deel. Een tijdelijke test in de webshop controleert de hoogtes van kern, zone, hoekstapel, installatiekast en mast, dat een hoekstapel zijn open balkons na de printcorrectie op 45° houdt, de schuine voet, de volumegroei door de printcorrectie (onder 1 %), één component en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0518100000208808` (bouwjaar 2009); 3D BAG LoD2.2 (AHN4, 2020); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- [Lijst van hoogste gebouwen van Den Haag](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Den_Haag).
- [DOK architecten, Pharos Den Haag](https://dokarchitecten.nl/en/project/pharos-den-haag) (projectbeschrijving en foto's van Arjen Schmitz, niet meegeleverd).
