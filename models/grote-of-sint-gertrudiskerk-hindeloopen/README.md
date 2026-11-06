# Grote of Sint Gertrudiskerk, Hindeloopen

Een vereenvoudigd landmarkmodel van de eenbeukige kerk uit 1632 met haar vijfzijdige koorsluiting en westtoren. Het gesloten model bestaat uit dakvlakken en bouwdelen: het schip met steunberen, de noord- en zuidportalen, de toren en zijn achtkantige houten bekroning met twee lantaarns, galerijranden en een koepeltje. De vensters en open galerijen zijn als blinde nissen weergegeven zodat zij op 1:1000 zonder steun printen.

## Bronnen en maten

- [Rijksmonument 22171](https://monumentenregister.cultureelerfgoed.nl/monumenten/22171): bouwvorm, zeven traveeën, driezijdig schilddak, vijfzijdige koorsluiting, portalen en twee koorvensters. De zuidbeuk is in 1892 afgebroken.
- [Stichting tot Behoud van Monumenten](https://www.stichtingmonumentenswf.nl/monumenten/Hervormde%20kerk%20Hindelopen/Westertoren%20Hindeloopen): geschiedenis en bouwvorm van de westtoren.
- [Wikimedia Commons, kerk vanaf de oostzijde](https://commons.wikimedia.org/wiki/File:20080504_Church_Hindeloopen_NL.jpg): uiterlijk van schip, koorsluiting en torenbekroning.
- 3D BAG, pand `0104100000129880`: plattegrond. AHN DSM 0,5 m via PDOK WCS: nok circa NAP +16,0 m en maaiveld circa NAP +1,9 m.

De vensters, portalen, de torengeledingen en de maten van de houten bekroning zijn geschat uit foto's; de volledige hoogte is benaderd. De fijne balustrades, windvanen en ander detail dunner dan 0,9 m zijn weggelaten. De galerijopeningen zijn als ondiepe nissen weergegeven, zodat het bouwdeel gesloten en printbaar blijft.

## Bestanden en genereren

De GLB is in meters, met Y omhoog en een `building:kerk`-node. De oorsprong ligt op RD (155770, 550670,7), de X-as loopt oostwaarts langs de nok; het model vervangt BAG-pand `NL.IMBAG.Pand.0104100000129880`. De onderkant ligt 0,4 m onder het geschatte maaiveld.

Genereer de GLB, catalogus-JSON en STL op schaal 1:1000 vanuit de root van deze repository:

```sh
node scripts/generate-grote-of-sint-gertrudiskerk-hindeloopen.mjs
```

## Controle

De generator controleert een gesloten manifold en overhang op 45 graden. De catalogusplaatsing en de steuncontrole zijn getest; een volledige 3MF-export van 150 × 150 m op 1:1000 is geslaagd. De kaart en printpreview zijn gecontroleerd; vier gelijke exporthoeken zijn vergeleken met de PDOK-reconstructie en schuine foto's. De galerijen zijn voor de print als nissen uitgevoerd.
