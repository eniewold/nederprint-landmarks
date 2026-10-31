# Martinez met het PLAZA Premium Almere (Almere)

Vereenvoudigd, printbaar model van Martinez aan het Mandelaplein 1 in Almere-Centrum (2010, ZZDP Architecten, 77 m, R+20), aan de noordkant van station Almere Centrum en ten oosten van het Carlton (WTC Almere). Het gebouw stond na de bouw jaren leeg en is sinds 2017 een hotel (eerst Best Western Plus Plaza Almere, nu PLAZA Premium Almere) met restaurant, sky bar en kantoren. Het bestaat uit vier aan elkaar geschakelde glazen schijven van 7,8 m dik en circa 42 m lang, die in lengte en hoogte verspringen; twee schijven komen niet tot de grond maar beginnen boven de tweede of vierde laag. De lange gevels hebben verticale witte stijlen op een stramien van 1,8 m, de kopgevels brede vensterbanden met witte vloerranden.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `plaza-almere.glb` | Model in meters, Y omhoog, één node `building:plaza-almere-martinez` |
| `plaza-almere.json` | Catalogusitem |
| `plaza-almere-1-1000.stl` | Los te printen op 1:1000 (62 × 31 × 78,5 mm), Z omhoog |

## Oorsprong en oriëntatie

RD-oorsprong `[143507.0, 487577.0]`, in het midden van de vier schijven. De lokale X-as loopt langs de lange gevels, 13,75° linksom op RD-oost (BAG-randen evenwijdig binnen 0,01°; dezelfde richting als het Carlton); de Y-as wijst naar het noordnoordwesten. Lokaal z = 0 is NAP −3,47 m (AHN-DTM op het plein rondom, −3,65 tot −3,37; de 3D BAG geeft −3,64). `groundHeight` is 39,43 m: NAP-maaiveld plus de NLGEO2018-geoïde ter plekke (42,90 m). `groundOffsetMetres` is −0,15 en de `groundSamplePoints` liggen op het plein rondom.

`replacesBuildings` bevat alleen pand `0034100000103008` (bouwjaar 2010; bijeenkomst-, kantoor- en logiesfunctie). Het Carlton (`0034100000051481`) is een eigen model (`carlton-almere`) en raakt dit pand niet; de garagedekken ten noorden (`0034100000051273`, `0034100000103007`) liggen op maaiveldhoogte.

## Onderdelen en maten

| Onderdeel | Maat (u, v in m) | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Noordschijf, 19 lagen | u −28,41 tot 13,77, v 7,42 tot 15,22 | +66,75 m | BAG; 3D BAG 66,72–66,78, DSM 67 |
| Uitkraging noordschijf west | 4,57 m voorbij de hoogste schijf, vanaf de vierde laag (+15,4 m boven maaiveld), kraag onder 45° | — | foto's (diepte uit de BAG-contour) |
| Hoogste schijf, 21 lagen | u −23,84 tot 18,35, v −0,38 tot 7,42 | +74,2 m | BAG; 3D BAG 73,86–74,51, DSM 74 |
| Verdiept dakterras | u −22,9 tot −3,4, v −0,38 tot 3,8, open naar het zuiden | +72,3 m | 3D BAG 72,24–72,36, DSM 72,5–73 |
| Opbouw op het dakterras | u −17,0 tot −7,1, v 1,55 tot 3,8 | +73,7 m | 3D BAG 73,66–73,71 |
| Derde schijf, 15 lagen | u −10,45 tot 33,58, v −8,18 tot −0,38 | +52,55 m | BAG; 3D BAG 52,52–52,59, DSM 52–53 |
| Sky bar op de derde schijf | u −5,8 tot 5,6, over de hele schijfdikte | +55,65 m | 3D BAG 55,64–55,67, DSM 55–56 |
| Uitkraging derde schijf oost | 4,43 m voorbij de zuidschijf, vanaf de tweede laag (+8,2 m), kraag onder 45°; eronder de entree van het restaurant | — | foto's |
| Zuidschijf, 17 lagen | u −13,03 tot 29,15, v −15,98 tot −8,18 | +59,8 m | BAG; 3D BAG 59,78–59,84, DSM 60 |
| Westkop zuidschijf | boven de entree, die 2,58 m terugligt (gelijk met de kop van de derde schijf), vanaf de tweede laag, kraag onder 45° | — | foto's |
| Installatiekast op de zuidschijf | 3,2 × 2,6 m | +61,05 m | 3D BAG 61,03–61,09 |
| Lange gevels | per laag een venster van 0,9 m op het stramien van 1,8 m, stijlen van 0,9 m | — | foto's, BAG-contour (stramientrapjes om de 1,8 m) |
| Kopgevels | per laag één vensterband tussen hoekstijlen van 0,9 m | — | foto's |

Het verdiepingsraster (begane grond 4,6 m, daarboven 3,6 m) komt uit op 15, 17, 19 en 21 lagen voor de vier daken met een dakrand van 0,8–1,1 m; dat klopt met R+20 voor de hoogste schijf en het terras op de vijftiende verdieping. Alle nissen zijn 0,35 m diep met een plafond onder 45°, alleen waar de gevel op die hoogte buitengevel is (1516 nissen).

## Geschat en weggelaten

- De hoogte van de uitkragingen (vierde en tweede laag) komt uit de foto's en de beschrijving van het gebouw; de diepte van de teruggezette plint onder de westkop van de zuidschijf (2,58 m) en onder de oostkop van de derde schijf (gelijk met de zuidschijf, 4,43 m) is geschat. De kragen onder 45° zijn er voor de print; in werkelijkheid zijn de onderkanten vlak.
- Laaghoogtes en het vensterraster zijn geschat; het stramien van 1,8 m komt uit de BAG-contour, de breedte van venster en stijl (elk 0,9 m) is afgerond naar wat op 1:1000 te printen is. De groene borstweringspanelen en de meanderende gevel (verspringingen van 5 cm) zijn niet als reliëf te maken.
- De vorm van het dakterras op de hoogste schijf en de sky bar komen uit de 3D BAG (AHN5 2023); het AHN4-DSM heeft boven de derde schijf een gat (glas en schaduw van de hoge schijven). Het dak van de hoogste schijf loopt in de 3D BAG 0,6 m af naar het oosten; het model neemt één hoogte.
- Weggelaten: de diagonale V-kolommen in de entree onder de zuidschijf (dunner dan 0,9 m), glazen balustrades en beplanting op de daken, de gevelonderhoudsinstallatie op de hoogste schijf, een verhoogd vlak van 0,75 m op de derde schijf en losse dakinstallaties (lager dan 0,9 m), en de kleuren (groen en blauw glas, witte stijlen).

## Controle

`node scripts/generate-plaza-almere.mjs` geeft `NoError`, één gesloten deel, genus 0 en 25 882 driehoeken. In de webshop controleert de test de vier daken, het dakterras met de opbouw, de sky bar en de installatiekast, dat de drie uitkragingen na de printcorrectie op 45° open blijven, dat een vensternis in de noordgevel na de printcorrectie 0,35 m diep blijft naast zijn stijl, dat de printcorrectie minder dan 1 % volume toevoegt, genus 0, één component en de plaatsing. Vier schuine aanzichten zijn naast de 3D BAG-reconstructie en de foto's gelegd.

## Bronnen

- PDOK BAG, pand `0034100000103008` (bouwjaar 2010); actuele orthoHR; AHN-DSM en -DTM 0,5 m (PDOK WCS); NLGEO2018.
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0034100000103008).
- [Lijst van hoogste gebouwen van Almere](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Almere) (Martinez, 78 m, 21 lagen, 2010).
- [PSS-Archi: Martinez](https://www.pss-archi.eu/immeubles/NL-34-63044.html) (ZZDP Architecten, 77 m, R+20).
- [Visit Almere: Martinez](https://www.visitalmere.com/en/locations/2617365838/martinez) (vier schijven rond een kern, sommige beginnen op de tweede of vierde verdieping; hotel sinds 2017).
- Foto's op Wikimedia Commons (niet meegeleverd): [Gebouw Martinez Almere](https://commons.wikimedia.org/wiki/File:Gebouw_Martinez_Almere.jpg), [Martinez Almere](https://commons.wikimedia.org/wiki/File:Martinez_Almere.jpg), [Almere Almere-Stad 1](https://commons.wikimedia.org/wiki/File:Almere_Almere-Stad_1.jpg), [Almere Almere-Stad 2](https://commons.wikimedia.org/wiki/File:Almere_Almere-Stad_2.jpg), [20150316 Almere 03](https://commons.wikimedia.org/wiki/File:20150316_Almere_03.JPG), [20150316 Almere 08](https://commons.wikimedia.org/wiki/File:20150316_Almere_08.JPG), [20150316 Almere 10](https://commons.wikimedia.org/wiki/File:20150316_Almere_10.JPG).
