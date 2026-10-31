# De Witte Keizer (Rotterdam)

Vereenvoudigd, printbaar model van De Witte Keizer, een woontoren van circa 71 m aan de Vissersdijk bij de Leuvekolk (KCAP, ontwerp 2001, oplevering 2005, 107 appartementen). Het gebouw staat naast Five55 en tegenover Blaak 333. Het bestaat uit een plint over het hele driehoekige perceel en daarop twee vleugels die samen een L vormen, met een witte prefab-betongevel en een raster van vensters. De werklijst noemde het gebouw "De Hoofdpoort", maar dat is de oorspronkelijke naam van het kantoorgebouw Blaak 333 (1962, in 2023 gesloopt). BAG-pand `0599100000394211` is De Witte Keizer. De slug `hoofdpoort-rotterdam` komt uit die taak.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `hoofdpoort-rotterdam.glb` | Model in meters, Y omhoog, één node: `building:hoofdpoort-rotterdam-witte-keizer` |
| `hoofdpoort-rotterdam.json` | Catalogusitem |
| `hoofdpoort-rotterdam-1-1000.stl` | Los te printen op 1:1000 (40 × 34 × 75 mm), Z omhoog |

## Oorsprong en oriëntatie

De RD-oorsprong `[92835.0, 437160.0]` ligt in de binnenhoek tussen de twee vleugels. De X-as loopt langs de zuidgevel naar het oostnoordoosten (19,87° op RD-oost; de noordgevel loopt evenwijdig, de oostgevel haaks). Lokaal z = 0 is NAP +2,1 m, het maaiveld aan de Vissersdijk; de Blaak-kant in het zuiden ligt op +3,0 tot +3,3 m. `groundHeight` is 45,64 m (ellipsoïdisch, NAP + 43,54 zoals bij Five55) en `groundOffsetMetres` −0,15. De maaiveldpunten liggen op de straat aan de noord-, oost- en zuidkant, niet op de kade van de Leuvekolk.

## Onderdelen en maten

| Onderdeel | Maat | Hoogte (NAP) | Bron |
| --- | --- | --- | --- |
| Plint | BAG-contour, 39,8 × 33,6 m | +17,97 m (dak in de binnenhoek) | BAG, 3D BAG (17,95–17,98), AHN-DSM (17,94) |
| Zuidvleugel | 39,8 × 18,3 m, westkant schuin volgens de BAG | +73,08 m | 3D BAG (73,06–73,09), AHN-DSM (73,0–73,1) |
| Noordvleugel | 15,6 × 15,4 m langs de oostgevel | +73,08 m | 3D BAG, AHN-DSM |
| Insnijding in de zuidgevel | 6,8 m breed, 4,45 m diep, open naar boven | bodem +32,45 m | 3D BAG (32,39–32,52), AHN-DSM (32,47) |
| Glazen hoekstrook tussen de vleugels | circa 3,3 × 3,5 m, 1 m diep | van het plintdak tot het dak | foto, BAG/3D BAG-hoek |
| Installatieblok met uitlaat | 5,4 × 3,7 m, uitlaat 1,2 × 1,4 m | +74,6 m / +75,8 m | 3D BAG (74,41–74,79), AHN-DSM (74,5; 75,4–76,0) |
| Kanaalkast | 5,4 × 1,0 m | +74,4 m | AHN-DSM (74,36–74,46) |
| Kast op de noordvleugel | 2,2 × 1,7 m | +75,6 m | AHN-DSM (75,2–76,3) |
| Vijf ventilatieschachten | 1,0 × 1,0 m (één 1,2 × 1,4 m) | +75,0 tot +75,6 m | AHN-DSM (mediaan 75,1–75,3, maxima 75,4–76,1) |

Lagen: een glazen begane grond van 4,6 m en in de vleugels drie kantoorlagen tot 15,9 m. Daarboven ligt een teruggelegen glazen laag tot 18,9 m en dan volgen 18 woonlagen van 2,86 m. In de plint aan de Leuvekolk liggen vier lagen van 2,75 m. Gevelreliëf: de begane grond en de glazen laag zijn doorlopende glasbanden van 0,4 m diep met een plafond onder 45°. De vensters zijn blinde nissen van 0,35 m diep met een plafond onder 45°, 1,8 m breed (1,6 m op de smalle gevels en in de insnijding). Op de zuidgevel staan vier kolommen aan weerszijden van de insnijding, op de oostgevel acht, op de noord- en westgevel en op de gevels boven de plint vier. In de plint aan de Leuvekolk zijn de vensters 1,3 m breed op een travee van 2,6 m. Onder de insnijding loopt een glazen strook van 0,4 m diep tot de glazen laag.

## Geschat en weggelaten

- Naam: de taak noemde het gebouw "De Hoofdpoort". De echte naam van dit pand is De Witte Keizer (e-architect, architectureguide.nl, Funda-complexnaam). Hoofdpoort was de oorspronkelijke naam van Blaak 333. Dat is een ander pand (`0599100110024241`) en het staat niet in dit model.
- Verdiepingshoogtes, aantallen lagen (geteld op foto's van Rob 't Hart, 2009) en het vensterraster zijn geschat, net als de vensterbreedte en de diepte van de nissen en de glasbanden.
- De glazen hoekstrook staat op foto's vanaf de Leuvekolk. Breedte en diepte zijn geschat.
- De noordgevel van de zuidvleugel is recht gemaakt op v = 5,75 m. In de 3D BAG loopt hij 0,67 m schuin over 16,6 m.
- De plattegronden en hoogtes van de dakopbouwen komen uit het AHN4-DSM. De 3D BAG (AHN5) geeft voor de kast op de noordvleugel 74,4 m, het DSM 75,2–76,3 m; aangehouden is 75,6 m.
- Weggelaten: de dakrandbeveiliging en de gondelrail, de glazen balustrade op het plintdak, losse ventilatiepijpjes van één DSM-cel (allemaal kleiner dan 0,9 m), de witte omlijstingen en grijze borstweringspanelen rond de vensters (reliëf kleiner dan 0,3 m) en de stijlen in de glazen begane grond.

## Controle

`node scripts/generate-hoofdpoort-rotterdam.mjs` geeft `NoError`, genus 0 en één gesloten deel. Een tijdelijke test in de webshop controleert:

- de daken van de vleugels, de plint, de insnijding en de hoekstrook;
- de dakopbouwen;
- een vensternis naast een penant en de open insnijding, vóór en na de printcorrectie op 45°;
- de volumegroei na de printcorrectie (minder dan 1 %);
- de plaatsing op het maaiveld.

Vier schuine aanzichten zijn naast de 3D BAG LoD2.2 en de foto's gelegd. Five55 (pand `0599100000701103`) en Blaak 333 blijven eigen panden en overlappen het model niet.

## Bronnen

- PDOK BAG, pand `0599100000394211` (bouwjaar 2005, Vissersdijk en Hang 33); actuele orthoHR; AHN-DSM en -DTM 0,5 m.
- [3D BAG](https://3dbag.nl), `NL.IMBAG.Pand.0599100000394211` (LoD2.2, puntwolk AHN5 2023).
- [Lijst van hoogste gebouwen van Rotterdam](https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Rotterdam) en [Blaak 333](https://nl.wikipedia.org/wiki/Blaak_333) (oorspronkelijke naam Hoofdpoort).
- [De Witte Keizer op e-architect](https://www.e-architect.com/rotterdam/de-witte-keizer) (KCAP, programma; foto's van Rob 't Hart, niet meegeleverd).
- [architectureguide.nl, project 1924](https://www.architectureguide.nl/project/item/prj_id/1924/alfa/H).
