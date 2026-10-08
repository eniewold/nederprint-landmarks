# Van Nellefabriek (Rotterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `van-nellefabriek.glb` | Catalogusbron in meters: node `building:fabriek` (fabriek, hallen, expeditiegebouw, kantoor, ketelhuis, theekoepel en loopbruggen als gesloten solid) |
| `van-nellefabriek-1-1000.stl` | Het complex op 1:1000 met de onderkant (NAP -0,5 m) op het printbed (267 × 240 × 40,5 mm); kantoor en ketelhuis zijn losse delen |
| `van-nellefabriek-grondplaat-1-1000.stl` | Idem op een grondplaat van 1 mm |
| `van-nellefabriek.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (89323,24, 437704,44), tussen de
fabriek en het expeditiegebouw, op het maaiveld (NAP 0 m), en de
glTF-conventie Y omhoog; +X wijst naar het oosten en +Y naar het noorden (de
RD-assen). Het maaiveld wordt op de straat tussen de tabaksfabriek en het
expeditiegebouw bemonsterd (`groundSamplePoints`, AHN NAP 0 tot +0,3 m).
Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0599100000763318` (fabriek
en hallen), `NL.IMBAG.Pand.0599100000763320` (expeditiegebouw),
`NL.IMBAG.Pand.0599100000763317` (kantoor) en
`NL.IMBAG.Pand.0599100000763319` (ketelhuis).

Opbouw:

- De gebouwen zijn opgebouwd uit 18 blokken (vlakken met een vaste dakhoogte)
  in een stelsel dat 37,5 graden ten opzichte van de RD-assen draait: de
  lange balk (tabaksfabriek, theefabriek en koffiefabriek) loopt in de
  v-richting, de machinehallen in de u-richting. De blokken zijn rechthoeken
  (één veelhoek voor de schuine arm van het kantoor) die op de BAG-contour van
  hun pand worden afgesneden, dus de gebogen gevels van het kantoor en het
  expeditiegebouw blijven de werkelijke contour. De dakhoogtes zijn uit het
  AHN-DSM afgelezen en afgerond op 1 m: de tabaksfabriek +31 m met de
  trapopbouw op +34 m en een uitbouw aan de oostkant, de theefabriek +24 m
  met de westrand op +20 m en een uitbouw aan de oostkant, de koffiefabriek
  +13 m, de hoge machinehal +14 m en de lage +9 m met een loopgang van +5 m
  ertussen, de hallen ten zuiden van de tabaksfabriek +7 en +8 m, het
  kantoor +18 m (het hoge deel), +9 m en +13 m in de gebogen arm, het
  expeditiegebouw +13 m en het ketelhuis +5 m. Eerdere versies gebruikten
  het AHN-DSM zelf als hoogteveld; dat is vervangen door deze vlakken.
- Groeven van 0,5 m hoog en 0,35 m diep om de 4,2 m vanaf +4,5 m in de lange
  gevels van de fabriek met een dak boven NAP +20 m, als verdiepingen.
- De theekoepel op de tabaksfabriek: een cilinder van 5,6 m straal tot
  +36,5 m, een dakrand die onder 45 graden 0,5 m uitloopt tot +37,2 m en de
  trapopbouw tot +40 m.
- De drie loopbruggen naar het expeditiegebouw als kokers van 2,2 tot 2,6 m
  breed en 3 m hoog met een kiel van 50 graden: twee vanaf de koffiefabriek
  (bovenkant +10,5 m) en de lange vanaf de tabaksfabriek, die van +22 naar
  +14 m zakt.

Vergelijking met het AHN-DSM: binnen de voetafdruk (2 m van de rand af) ligt
86 % van de circa 17.000 DSM-cellen binnen 1 m en 93 % binnen 2 m (mediaan
-0,1 m); het ketelhuis (+5 m) wijkt het meest af omdat het een schuin dak
heeft. De afwijkingen zitten in de sheddaken van de koffiefabriek en de
machinehallen, die als vlak dak zijn gemodelleerd.

Printbaar op 1:1000 zonder steun: de blokken staan met rechte wanden op
de onderkant, alleen de groeven hebben een vlakke bovenkant van 0,35 m diep,
de rand van de theekoepel loopt onder 45 graden uit en de bruggen hebben een
kiel van 50 graden; het script controleert dat. De bruggen hangen tussen de
gebouwen, dus de export zet er een wandje onder. Met overhangopvulling op
1:1000 blijft 270,3 cm³ over (model 269,6 cm³; de extra 0,7 cm³ zijn de
wandjes onder de loopbruggen). In de kaart en in de preview van die uitsnede staan de
fabriek met de theekoepel, de loopbruggen en het expeditiegebouw zonder de
vervangen panden.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Van_Nellefabriek)
(Brinkman en Van der Vlugt, 1925-1931, werelderfgoed), PDOK BAG (de vier
panden), PDOK AHN (dsm en dtm 0,5 m via WCS: dakhoogtes en blokgrenzen, theekoepel,
loopbruggen, maaiveld) en de PDOK luchtfoto. Geschat zijn de verdiepingshoogte
van de groeven, de hoogte van de kokers van de bruggen en de vorm van de
dakrand van de theekoepel. Vereenvoudigd: de glazen gevels zijn dicht met
alleen de verdiepingsgroeven, de sheddaken zijn vlak en de bruggen zijn recht.
