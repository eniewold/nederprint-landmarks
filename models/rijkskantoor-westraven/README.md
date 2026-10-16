# Rijkskantoor Westraven — Utrecht

Vereenvoudigd en printbaar model van Westraven aan Griffioenlaan 2: de schuin op de laagbouw staande torenschijf, vijf driehoekige kantoorvleugels, hun vijf dakinstallaties, verbindingscorridors en de glazen serres. De toren heeft horizontale blinde glasbanden, vijf grotere videvelden en een open dakput met terugliggend installatie-/PV-volume.

## Bronnen en maten

- PDOK BAG, pand `0344100000073774` (1976): de gehele eigen voet. De drie afzonderlijke lage objecten ten oosten/noordoosten van het gebouw zijn geen onderdeel van het landmark en blijven behouden.
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000073774), opname AHN5 2023: dakcontouren en torenafmetingen, gecontroleerd met het PDOK LoD2.2-model en AHN DSM/DTM op 0,5 m. De reconstructie is meetmateriaal; het script bouwt zelf benoemde prisma's en continue dakvlakken.
- PDOK actuele orthoHR: vijf driehoekige dakdelen, dakinstallaties, glazen tussenruimten, toegang en begrenzing ten opzichte van water, weg en parkeerterrein.
- [Cepezed — Westraven](https://www.cepezed.nl/projecten/westraven/): vijf driehoekige kantoorvleugels, vijf grote vides, tweede huid met horizontale geleding en de recente aanpassingen. De architectbeelden zijn uitsluitend visuele referenties; er is geen modelgeometrie uit overgenomen.
- [Rijkswaterstaat — hoofdlocatie Utrecht](https://www.rijkswaterstaat.nl/over-ons/onze-organisatie/organisatiestructuur/midden-nederland/hoofdlocatie-utrecht-westraven): adres en gebruiker.
- Schuine Commons-foto's: [vanuit parkeergarage](https://commons.wikimedia.org/wiki/File:Gebouw_van_Rijkswaterstaat_Griffioenlaan_vanuit_parkeergarage.JPG), [2014](https://commons.wikimedia.org/wiki/File:Rijkskantoorgebouw_Westraven_in_2014.jpg), [Rijkswaterstaat Westraven](https://commons.wikimedia.org/wiki/File:Rijkswaterstaat_Westraven.jpg). Foto's worden niet meegeleverd.

Hoogtes zijn in NAP: maaiveld circa +2,20 m, hoofddak toren +82,55 m, kroon +86,32 m, lage kantoren circa +14,76 m, corridors circa +15,68 m en vijf dakinstallaties +19,965 m. De serrevlakken liggen rond +15,6–16,14 m en volgen afzonderlijk uit het DSM gefitte planvergelijkingen. De kroon is dus circa 84,12 m boven het gekozen maaiveld, passend bij de afgeronde bronhoogte van 85 m.

## Modelstelsel en plaatsing

RD-oorsprong `[135420, 452270]`, lokale X-as 25,2° linksom ten opzichte van RD-oost; lokale Y staat daar haaks op. De gemeten vleugels en de afwijkende torenrichting staan als polygonen in dat eigen gebouwstelsel. Z is omhoog in de generator; de GLB gebruikt Y omhoog.

`groundHeight` is 45,538542719842226 m ellipsoïdaal, gemeten op de eigen bestrating langs het complex, buiten de lagere parkeerstrook. Twee vaste samplepunten staan in de JSON; `groundOffsetMetres` is −0,15 m. De voet loopt tot −0,8 m lokaal, met een dunne verbinding onder maaiveld zodat de gehele eigen BAG-voet één gesloten printvolume vormt. Er ligt geen nieuwe plaat over parkeerterrein, water of de groene buitentuinen. Alleen het eigen hoofd-BAG-pand wordt vervangen.

## Vereenvoudigingen en schattingen

Gevelritme, bandhoogtes, penantbreedtes, blinde diepte en de exacte indeling van de videvelden zijn uit foto's geschat. Twee grote velden liggen aan de oostzijde en drie aan de tegenoverliggende lange gevel; de exacte westelijke verdeling is minder goed zichtbaar in de referenties en is expliciet een schatting. De vides zijn blinde glasnissen met robuuste verticale stijlen, geen gaten door de toren. De tweede huid, letters, doekstructuur en kozijnen zijn vereenvoudigd tot reliëf.

De vijf dakinstallaties behouden hun gemeten driehoekige contour en hoogte. Kleine dakapparatuur en de individuele PV-panelen zijn gegroepeerd in het terugliggende torendakvolume. Serres en glazen entreeruimtes zijn gesloten volumes met ondiepe glasnissen; transparant glas en de interne kantoren worden niet gemodelleerd. De bestaande buitenvorm is leidend; een opengewerkte architectvisualisatie van de recente interne herinrichting is geen vervanging voor gemeten buitendaken.

## Reproduceren en controleren

```sh
node scripts/generate-rijkskantoor-westraven.mjs
```

Alle invoer staat als constanten in de generator. Uitvoer: GLB in meters, catalogus-JSON en STL op 1:1000. Modelafmetingen circa 64,97 × 222,03 × 84,92 mm op printschaal. Eén gesloten `building:`-node, `NoError`, één positief component, genus 0; ook na Float32 GLB-reconstructie. Blinde nisplafonds lopen onder 45° op. De automatische 45°-printcorrectie voegt circa 0,0442% volume toe en behoudt één component zonder ingesloten luchtkamers.

In de webshop controleert `tests/landmark-models.test.ts` onder meer de vijf eigen vleugels, drie serrevlakken, torenkroon, blind gevelreliëf vóór/na printcorrectie, het vervangen BAG-pand en de terreinplaatsing. Vier schuine aanzichten zijn vergeleken met dezelfde PDOK-richtingen en de foto's; daarnaast zijn de GLB met GLTFLoader, de echte kaart met landmarks aan/uit en een volledige preview-export op 1:1000 gecontroleerd. Controlebeelden en export-ZIP staan uitsluitend buiten de repositories.
