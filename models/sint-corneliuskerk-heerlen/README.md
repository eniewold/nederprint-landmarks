# Sint-Corneliuskerk (Heerlerheide, Heerlen)

De neoromaanse kruisbasiliek van 1909 heeft een tweelingtorenfront met vierkante tentdaken, zijbeuken met lessenaarsdaken, dwarsschip, een halfronde apsis en een bakstenen angelusklokje. Het model vervangt BAG-pand `0917100000018184`; de oorsprong is RD (195074,5; 325344,7), de lokale X-as (0,9894; 0,145) loopt van het westfront naar het koor.

## Bronnen en schattingen

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0917100000018184): footprint en reconstructie van dakvlakken; het maaiveld ligt lokaal rond NAP +96,3 m en de nokken van de twee torens rond 30,5 m erboven.
- [AHN DSM/DTM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): dakhoogten en maaiveld. Rond beide tentdaken zitten enkele losse ontbrekende rastercellen, maar de omliggende hoogten tonen een herkenbaar oplopend dak; de nokhoogten zijn benaderingen. Het maaiveld loopt op door de kerkheuvel.
- [Kerkgebouwen in Limburg](https://www.kerkgebouwen-in-limburg.nl/kerken/heerlerheide/cornelius), [Kerkramen in de Mijnstreek](https://www.kerkramenindemijnstreek.nl/kerken/heerlerheide-corneliuskerk/) en [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Corneliuskerk,_Heerlen): bouwgeschiedenis en foto's van de twee torens, zijbeuken en ronde koorsluiting.

Raam- en galmgatdiepte, het angelusklokje, de kleinere bijgebouwen en de fijne dak- en metselwerkdetails zijn geschat en voor 1:1000 vereenvoudigd. De torendaken zijn bovenaan verbreed; de kruisen ontbreken. De kerkheuvel zelf is geen onderdeel van het model: gebruik PDOK-terrein en controleer de aansluiting op de kaart en in de export.

## Bestanden

De GLB en JSON worden gebruikt op de kaart en in de export; STL's zijn beschikbaar op 1:1000 en 1:100. Genereer opnieuw met `node scripts/generate-sint-corneliuskerk-heerlen.mjs --scale 1000` en `--scale 100`. Controleer na aanpassing de positie en printbaarheid opnieuw.

De relatief lage tentdaken zijn naar de foto's aangepast; de aanzet op circa 28 m is een schatting en wijkt af van de door 3DBAG geëxtrapoleerde lagere dakrand.
