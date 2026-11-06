# Martinikerk (Koudum)

De huidige zaalkerk uit 1857 met halfingebouwde westtoren en ingesnoerde achtkante spits is als één gesloten volume opgebouwd uit bouwdelen en dakvlakken. Het vroegere bouwjaar 1847 in BAG verwijst niet naar het in 1857 opgerichte huidige kerkgebouw.

## Bestanden

- `martinikerk-koudum.glb`: model voor de kaart, meters, glTF Y omhoog, node `building:martinikerk`.
- `martinikerk-koudum.json`: catalogus, RD-plaatsing en BAG-vervanging.
- `martinikerk-koudum-1-1000.stl`: vrijstaand volume in millimeters op 1:1000.
- `scripts/generate-martinikerk-koudum.mjs` genereert de bestanden opnieuw met manifold-3d.

## Oorsprong, oriëntatie en bouwdelen

Oorsprong RD (159128, 547463), maaiveld ca. NAP +6,70 m; lokale X-as `[0.99394, 0.10992]` loopt in de richting van de nok naar het oosten. Onderkant bevindt zich 0,3 m onder de oorsprong. Het model vervangt BAG-pand `0104100000130037`. De voetafdruk en vijfzijdige koorsluiting zijn uit de BAG afgeleid; de goot en nok uit AHN/3D BAG (NAP circa +16,8 en +22,41 m). De toren is circa 31,5 m boven maaiveld tot het vereenvoudigde topje; het AHN-maximum is NAP +38,18 m.

Het model bevat schip met zadeldak en schildvlakken boven de sluiting, de torenschacht met achtkantige spits, dakkapellen, vlakke lisenen, de toegang en de vensters en galmgaten als blinde nissen. De bovenzijde van deze nissen is spits gemaakt om zonder steun te printen.

## Geschat en weggelaten

De maat en positie van dakkapellen, gevelvensters, entree, galmgaten, uurwerken, lisenen en knik van de spits zijn geschat aan de hand van schuine foto's. De ronde bogen zijn printbaar vereenvoudigd. De haan, windwijzer, dunne dakranden, kleine lijsten, glasroedes en overige details kleiner dan 0,9 m ontbreken. Het 0,9 m brede topje is voor printbaarheid dikker dan de echte spits.

## Controle

De generator controleert gesloten manifoldstatus, een vlakke onderkant, Float32-rondgang en neerwaartse vlakken; het testmodel is één verbonden stuk, `NoError`, met afmetingen 31,25 × 12,50 × 31,80 mm op 1:1000. De kaart en de preview zijn gecontroleerd op positie en plaatsing. De volledige 150 × 150 m-export op 1:1000 en de catalogus- en 45-gradensteuntest zijn geslaagd. Vier schuine exportbeelden zijn vergeleken met de PDOK-reconstructie en twee fotoaanzichten; de spits, galmgaten, raam- en deurnissen en de dakvorm zijn toegevoegd ten opzichte van PDOK.

## Bronnen

- [Rijksdienst voor het Cultureel Erfgoed: Martinikerk](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/21479).
- [Stichting monumenten Súdwest-Fryslân: Kerktoren Koudum](https://www.stichtingmonumentenswf.nl/monumenten/Hervormde%20kerk%20Koudum/Kerktoren%20Koudum).
- [3D BAG: pand 0104100000130037](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0104100000130037); PDOK AHN DSM en DTM 0,5 m via WCS.
- [Foto west en langsgevel](https://commons.wikimedia.org/wiki/File:Koudum,_de_Martinikerk_RM21479_IMG_2558_2018-04-19_11.21.jpg) en [foto oost en langsgevel](https://commons.wikimedia.org/wiki/File:Koudum,_de_Martinikerk_RM21479_IMG_2245_2018-04-18_09.53.jpg), Michiel Verbeek, Wikimedia Commons.
