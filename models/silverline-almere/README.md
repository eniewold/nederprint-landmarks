# Silverline (Almere)

GLB in meters met Y omhoog, JSON voor de kaart, en `silverline-almere-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-silverline-almere.mjs`; de generator gebruikt alleen vaste bronmaten.

## Positie en bronmaten

RD-oorsprong [143266,486516], X-as 13,75 graden uit de gemeten gevels. Z=0 is NAP -4,26 m, de lage straat aan de noordwestzijde; bodem -0,48 m sluit aan tot NAP -4,74 m. Maaiveldpunten [143229,486530] en [143223,486523]; de eerste geeft in de PDOK-export 38,567 m ellipsoïdisch en is de vaste terugval. BAG-pand 0034100000070107 wordt vervangen.

AHN en 3D BAG: laag dak +15,448 m NAP, hoofdvlak +44,144 m, zuidelijke dakzone +45,121 m, borstwering +45,555 m, liftinstallatie +45,799 m en garageplint -1,525 m. Het gebouw is circa 49–50 m boven de straat, niet de 120 m uit de backlog. Visit Almere en de architectuurgids beschrijven 16 woonlagen, 58 woningen en Claus en Kaan als architecten.

## Bouwdelen en aannames

Lage woonvleugel, hogere schijf met gekantelde bovengevel, hoekserres als gevarieerde vensternissen, aangesloten printafschuining, open dakput tot NAP +41,38 m, borstwering, lift-/dakinstallatie, westentree en zwarte garageplint. Dakput en lage vleugel zijn elk eigen bouwdelen. Geen DSM-hoogtelagen.

Kanteling, overgang rond NAP +24,8 m en onderhang uit schuine foto's geschat (circa 1,5 m onzeker); een afschuining vanaf +17,2 m maakt de onderhang zonder losse steun printbaar. Woonlaagritme 2,85 m en vensters circa 2,1–2,5 bij 1,6 m zijn geschat (circa 0,5 m); blinde nissen 0,38 m diep. Entree en canopy zijn uit foto's geschat, de plintwanden en borstwering minimaal 0,9 m dik.

## Weggelaten

Het begroeide garagedak blijft PDOK-terrein: een tweede landschapplaat zou het bestaande terrein dubbelen. Het zichtbare zwarte plintfront is wel opgenomen. Fijne aluminiumcorrugatie, kozijnen, relingen en antennes zijn smaller dan 0,9 m en blijven weg; zichtbare lifttechniek staat wel in het model.

## Controle

Generator: NoError, één verbonden component, 6.712 driehoeken. Vier schuine richtingen naast de echte PDOK-gebouwtegels en foto's bekeken: gevelreliëf en echte onderhang ontbreken in PDOK en zijn toegevoegd. Test in tests/landmark-models.test.ts controleert plaatsing, daken, open dakput, vrije onderhang en ontbreken van een dubbele terreinplaat. 1:1000 overhangcorrectie: NoError, één component, circa 0,21% extra volume. Volledige preview-export 140 bij 140 mm, 106 objecten, 32.058 driehoeken, 52,5 mm modelhoogte. De hele voetafdruk valt binnen de uitsnede. Controlekaart en GLTFLoader bekeken; onderzoeksbeelden blijven buiten de repo.

## Bronnen

- https://www.visitalmere.com/nl/locaties/3783843205/silverline
- https://www.architectuur.org/bouwwerk/153/Woontoren_Silverline.html
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0034100000070107 — TU Delft/3DGI, CC BY 4.0.
- PDOK BAG, AHN DSM/DTM 0,5 m en actuele orthofoto — open brondata, geometrie/hoogtes; foto's alleen referentie.
- https://commons.wikimedia.org/wiki/File:20150316_Almere_100.JPG — Mark Ahsmann — CC BY-SA 4.0
- https://commons.wikimedia.org/wiki/File:20150316_Almere_137.JPG — Mark Ahsmann — CC BY-SA 4.0
- https://commons.wikimedia.org/wiki/File:20150316_Almere_84.JPG — Mark Ahsmann — CC BY-SA 4.0
- https://commons.wikimedia.org/wiki/File:Almere_Blick_aufs_Stadtzentrum_6.jpg — Zairon — CC BY-SA 4.0
- https://commons.wikimedia.org/wiki/File:Silverline.jpg — Sander155 — CC BY-SA 4.0
