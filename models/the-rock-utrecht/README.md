# The Rock (Utrecht)

Vereenvoudigd, printbaar model van The Rock, de studententoren van 23 lagen met 463 woningen aan het Van Heuven Goedhartplein in Kanaleneiland (2020, LIAG Architecten), op het terrein van het voormalige ziekenhuis Oudenrijn. De toren is een rechthoekig blok met een witte gevel van horizontale, golvende banden van gevouwen composietplaat ("Panta Rhei"): onder de vensters van elke laag steekt een band uit, met een uitsprong die langs de gevel golft en per laag verschuift. Hoogbouwlijsten noemen hem ook "The Rock (Up Living)", de bouwberichten "de Rock".

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `the-rock-utrecht.glb` | Model in meters, Y omhoog, twee nodes: `building:the-rock-utrecht-toren` en `building:the-rock-utrecht-plint` |
| `the-rock-utrecht.json` | Catalogusitem |
| `the-rock-utrecht-1-1000.stl` | Los te printen op 1:1000 (33 × 23 × 76 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[134640.47, 454680.37]`, het hart van de BAG-contour. De X-as loopt langs de lange gevels (29,55° op RD-oost, de richting van de BAG-randen), Y langs de korte gevels naar het noordnoordwesten. Lokaal z = 0 is NAP +1,72 m (maaiveld uit de 3D BAG); `groundHeight` is 45,17 m ellipsoïdisch: NAP + 43,45, geijkt op De Hoogt 160 m verderop (44,81 bij NAP 1,36; de geoïde NLGEO2018 is op beide plekken 43,37). `groundOffsetMetres` is −0,15. De vier `groundSamplePoints` liggen op straatniveau ten westen en noordwesten van de toren, niet op het verhoogde binnenhof (NAP +5,6 m) tegen de zuidzuidoostgevel, dat bij andere panden hoort en niet in het model zit.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Toren (pand `0344100000146591`) | 33,28 × 22,99 m (BAG-contour = buitenrand van de banden), vensterwand 1,0 m daarbinnen | +73,95 m | BAG, 3D BAG (dakvlak 73,92–73,95), AHN-DSM (73,8–74,0) |
| Plint | 0,5 m binnen de BAG-contour | +5,6 m | hoogte van het binnenhof (DTM 5,5–5,6); gemetseld volgens de architect; geschat |
| Woonlagen | 22 × 3,04 m boven de plint, dakrand 1,4 m | — | foto's (23 lagen in totaal), hoogte uit het dak afgeleid |
| Gevelbanden | per laag 1,6 m hoog, 0,35–1,0 m uitstekend met een onderkant onder 45° | — | foto's, gestileerd |
| Installatieframe | twee kokers van 21 × 2 m met poten van 1,5 m | +77,05 m | AHN-DSM (77,0–77,1), 3D BAG (77,02–77,05) |
| Leidingkokers | twee van 28 × 1 m en één van 1 × 7,7 m | +75,2 m | AHN-DSM (75,0–75,4) |
| Installatiekasten | 3,75 × 5,5 m en twee kleinere | +76,3 en +75,75 m | AHN-DSM, 3D BAG (76,28–76,37 en 75,64–75,85) |

Gevelreliëf: de uitsprong van de banden is een golf van acht golflengtes (circa 13 m) rond de hele toren die per laag 0,35 rad verschuift, zodat de hoeken doorlopen. Vensters als blinde nissen van 0,35 m met een plafond onder 45°: op de lange gevels achttien van 1,1 × 1,4 m per laag, op de korte gevels per laag één venster van 1,1 m op 2 m van de hoek en een breed driedelig venster van 3,6 m in het midden. In de plint nissen van 2,4 m op 3,6 m, behalve aan de zuidzuidoostkant tegen het binnenhof.

## Geschat en weggelaten

- Naam: de taak noemt "The Rock (Up Living)"; Commons, DUIC en de architect noemen de toren The Rock of de Rock. "Up Living" is niet in andere bronnen gevonden.
- Het golfpatroon van de banden (golflengte, verschuiving per laag, uitsprong 0,35–1,0 m) is een stilering van de foto's, niet per paneel opgemeten.
- De plint (hoogte gelijk aan het binnenhof, gemetseld volgens de architect) en haar nissen zijn geschat; er is geen foto van de voet gevonden.
- Laaghoogte 3,04 m, dakrand 1,4 m en de vensterwand 1,0 m achter de BAG-contour zijn geschat.
- De indeling van de oostnoordoostgevel is puntsymmetrisch aan de westzuidwestgevel aangenomen.
- Weggelaten: de stijlen in het driedelige venster en de dakrand van 0,3–0,6 m (kleiner dan 0,9 m), een opening van circa 0,5–1 m in de lange installatiekokers, antennes en kleine dakdelen, en de ingang (geen foto van de voet).

## Controle

`node scripts/generate-the-rock-utrecht.mjs` geeft voor beide nodes `NoError` en één gesloten deel (toren genus 0, plint genus 1). In de webshop controleert `tests/landmark-models.test.ts` het dak en de installaties, dat de band van een laag langs de gevel in en uit golft en een vensternis 0,35 m diep is, ook na de printcorrectie op 45°, dat die correctie het volume minder dan 1 % laat groeien, één component per node en de plaatsing op het maaiveld. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0344100000146591` (bouwjaar 2020); actuele orthoHR; AHN-DSM en -DTM 0,5 m; 3D BAG (LoD2.2, AHN5 2023, TU Delft/3DGI, CC BY 4.0).
- [Lijst van hoogste gebouwen van Utrecht (stad)](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Utrecht_(stad)).
- [DUIC: Studenten nemen intrek in nieuwe woontoren de Rock in Kanaleneiland](https://www.duic.nl/algemeen/studenten-nemen-intrek-in-nieuwe-woontoren-de-rock-in-kanaleneiland/).
- Foto's op Wikimedia Commons (niet meegeleverd): [Woontoren The Rock](https://commons.wikimedia.org/wiki/File:Woontoren_The_Rock.jpg), [Up Living woontoren in Utrecht](https://commons.wikimedia.org/wiki/File:Up_Living_woontoren_in_Utrecht.jpg), [Panta Rhei](https://commons.wikimedia.org/wiki/File:Panta_Rhei_-_Flickr_-_Rob_Oo.jpg).
