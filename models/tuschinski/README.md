# Koninklijk Theater Tuschinski, Amsterdam

Vereenvoudigd model van het theater tussen de Reguliersbreestraat en de Reguliersdwarsstraat, voor een stadskaart op 1:1000. Het bevat de twee voorgeveltorens met koepels en lantaarns, voorbouw met erker en nissen, de gebogen zaalkap met daklicht, het toneelgebouw en de aansluitende lagere bouwdelen.

## Ligging en maatvoering

- Oorsprong RD (121440, 486600), op maaiveld; lokale +X is (0,8746, −0,4848) in RD en +Y wijst naar de Reguliersbreestraat. Maaiveldreferentie NAP +0,754 m.
- De BAG-voetafdruk van pand `0363100012168188` en de uit die contour en dakranden bepaalde as vormen de basis; het model vervangt datzelfde pand in PDOK. Het model is circa 36,9 × 64,1 × 30,8 m.
- De dwarsdoorsnede van de zaalkap volgt het AHN5 DSM van 0,5 m: dakranden circa NAP +19,8 m, midden circa +22,8 m; het dak is geëxtrudeerd en aan de voorzijde op een gebogen plancontour begrensd. Het toneeldak en lagere aanbouwen volgen BAG, AHN en 3D BAG. De grote dakopbouwen zijn afzonderlijke bouwdelen.
- De torenkoepels en lantaarns volgen de voorgevel en de AHN-omhullende. Fijne bekroningen worden vereenvoudigd tot een printbare lantaarn van minimaal 0,9 m breed. De precieze vorm, hoogte en gevelnisposities zijn geschat uit de foto's; de glazen ramen zijn blinde nissen. De drie vensters van de achtergevel zijn naar de foto van Amsterdam Monumentenstad geplaatst; hun exacte maten zijn geschat.
- De lange zijgevels grenzen grotendeels aan buurpanden; van de boven hun daken zichtbare delen zijn geen bruikbare schuine foto's gevonden. Die zijvlakken zijn daarom vereenvoudigd en hun indeling is geschat op basis van BAG, AHN en de orthofoto; niet zichtbare geveldetails zijn niet verzonnen.
- Weggelaten: dunne vlaggenmasten, letters, hekken, sculptuur, keramische versiering en andere onderdelen kleiner dan 0,9 m op ware grootte. De luifel is in het gevelreliëf vereenvoudigd; geen fragiele horizontale plaat.

## Bestanden en gebruik

- `tuschinski.glb`: meters, glTF Y omhoog, één gesloten node `building:theater`.
- `tuschinski.json`: RD-plaatsing en vervanging van het BAG-pand.
- `tuschinski-1-1000.stl`: millimeters, Z omhoog, geprint op 1:1000.
- Generator: `scripts/generate-tuschinski.mjs`; voer uit vanuit de landmarkrepo met `node scripts/generate-tuschinski.mjs`. Met `--out <map>` kan een proefexport buiten de catalogus worden gemaakt.

De geometrie is één manifold met blinde nissen; de positie en afmetingen van kleine geveldetails zijn benaderingen. Controleer de aansluiting op de omliggende panden, de contour van de zaalkap en beide torenbekroningen op de kaart.

## Bronnen

- [3D BAG, pand 0363100012168188](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012168188), AHN5-opname 2023, LoD2.2.
- PDOK AHN DSM 0,5 m en actuele luchtfoto, geraadpleegd 10 november 2026.
- [Rijksmonumentenregister 4828](https://monumentenregister.cultureelerfgoed.nl/monumenten/4828).
- [Wikimedia Commons: voorgevel](https://commons.wikimedia.org/wiki/File:Tuschinski_Theater_Amsterdam-msu-9124-.jpg).
- [Amsterdam Monumentenstad: voor- en achtergevel](https://www.amsterdam-monumentenstad.nl/database/grachtenboek_objecten.php?id=5645).
