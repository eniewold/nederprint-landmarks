# Sint-Lambertuskerk (Eindhoven)

Neogotische rooms-katholieke kruisbasiliek in Gestel, ontworpen door Wolter te Riele (1909) en gebouwd in 1910-11 (rijksmonument 356432). Er is een vierkante ingangstoren met lage lantaarn, vier hoektorentjes en een achtkantige leien spits. Schip en dwarsschip liggen onder één nok, het koor heeft een veelhoekige sluiting met een dakruiter, en de zijbeuken worden vanaf de toren trapsgewijs breder. Ook de zijkapellen en de lage omgang rond het koor zitten in het model. Het model vervangt BAG-pand 0772100000271465.

## Bestanden en plaatsing

- `sint-lambertuskerk-eindhoven.glb`: gesloten model in meters met node `building:kerk`.
- `sint-lambertuskerk-eindhoven.json`: de RD-oorsprong (160324.54, 381796.85) ligt in het hart van de viering. De X-as `[-0.9455, 0.3256]` (161 graden) wijst langs de kerkas naar de toren aan de Hoogstraat. De maaiveldreferentie is NAP +18,70 m.
- `sint-lambertuskerk-eindhoven-1-100.stl` en `sint-lambertuskerk-eindhoven-1-1000.stl`: afdrukmodellen in millimeters.
- `scripts/generate-sint-lambertuskerk-eindhoven.mjs`: bouwt het model opnieuw op uit bouwdelen en dakvlakken.

## Onderdelen

- **Hoofdkap van schip en eerste koortravee:** zadeldak van 13,6 m breed, goot 16,95 m en nok 26,2 m (53,7 graden). Het dak loopt van de toren tot een topgevel boven het lagere koordak.
- **Dwarsschip:** dezelfde nok en helling, met schilden van 64 graden boven de topgevels. Op elke topgevel staan drie steunberen met twee lancetten ertussen. De kruisende kappen vormen in de viering diagonale kilgoten, zoals op de luchtfoto.
- **Zijbeuken:**
  - een ingangstravee naast de toren met lessenaarsdak;
  - de middelste beuk met een asymmetrisch zadeldak (nok 15,3 m, 2,8 m uit de schipmuur) en een steunbeer;
  - tegen het dwarsschip een recht gesloten zijkapel met lessenaarsdak en schild.
- **Lichtbeukvensters:** tussen de zijbeukdaken en de goot van het schip.
- **Oostelijke lage delen:** aan weerszijden van het koor een blok met lessenaarsdak (14,8 naar 10,2 m). Daarin staat een driezijdig gesloten koorkapel met een eigen steil schilddak (nok 14,3 m).
- **Koor:** hoge koorwanden met goot 17,0 m en nok 23,6 m, en een achtzijdige sluiting. Eromheen ligt een lage omgang (goot 8,6 m). Aan de zuidzijde staat een achtkantig traptorentje met spits.
- **Dakruiter:** op de overgang van hoofdkap naar koordak. Een vierkante schacht van 2,4 m draagt een achtkantige klokkenstoel en een naaldspits tot 43,0 m.
- **Toren:**
  - schacht van 8,6 x 8,6 m tot 36,3 m;
  - vier achtkantige hoekpinakels tot 42,6 m;
  - lage achtkantige lantaarn tot 40,5 m en spits tot 60,8 m;
  - steunberen op de voorhoeken;
  - twee galmgaten per zijde en een groot westvenster;
  - aan de zuidzijde een wimperg boven het zijportaal;
  - aan beide zijden een lage polygonale aanbouw met schilddak.
- **Gevelreliëf en dakkapellen:** blinde vensternissen van 0,35 m met spitse boog (top van 55 graden of steiler) in alle gevels, en tien dakkapelletjes van 1,1 m op hoofdkap en dwarsschip.

## Maten en vereenvoudiging

- **Hoofdas:** 161 graden, gemeten aan de nokken van schip en koor in het AHN-DSM. Over 34 m wijkt de nok minder dan 0,25 m af.
- **Plattegrond:** uit de BAG-contour. Daaruit komen de trapsgewijze zijbeuken, de kapellen, de aanbouwen en de steunberen.
- **Hoogtes:** goot-, nok- en kapelhoogtes en de dakhellingen zijn gemeten in dwarsprofielen van het AHN-DSM (0,5 m) in het gebouwstelsel.
- **Toren:** de breedte komt uit de AHN-omhullende per hoogte. De top van de spits staat in het AHN op 60,1 m; zonder kruis is hij afgerond naar 60,8 m. Lantaarnhoogte, pinakels, galmgaten en de wimperg zijn geschat op Commons-foto's.
- **Geschat:**
  - **Dakruiter:** staat niet in het AHN-DSM. Op zijn plek zit een gat van ongeveer 2,5 m zonder waarden, en de 3D BAG heeft daar een uitstulping tot 28,4 m. Het monumentenregister en Reliwiki noemen hem; de hoogte is geschat op een RCE-foto uit circa 1960.
  - **Lage delen:** de oostelijke delen en de omgang zijn vereenvoudigd tot lessenaars- en schilddaken op hun AHN-hoogte.
- **Weggelaten:** kruisen en windwijzers (dunner dan 0,9 m), de uurwerken, het maaswerk, de kleine wimpergen op de lantaarn en het baksteenreliëf.

## Controle

Het model is één gesloten manifold met genus 0. De gerichte test controleert:

- de plaatsing en de pandvervanging;
- de hoogte;
- de opvulling bij een overhang van 45 graden op 1:1000 (steunverhouding 1,00).

Het model is van vier kanten vergeleken met de 3D BAG LoD2.2-reconstructie. Daarnaast is het naast foto's gelegd van de westgevel, de zuidzijde van de toren en de koorzijde.

## Bronnen

- [Rijksmonumentenregister 356432](https://monumentenregister.cultureelerfgoed.nl/monumenten/356432)
- [Wikipedia: Sint-Lambertuskerk (Eindhoven)](https://nl.wikipedia.org/wiki/Sint-Lambertuskerk_(Eindhoven))
- [Reliwiki: Eindhoven, Hoogstraat 299 - Lambertus](https://reliwiki.nl/index.php/Eindhoven,_Hoogstraat_299_-_Lambertus)
- [3D BAG pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100000271465)
- [AHN WCS (PDOK)](https://service.pdok.nl/rws/ahn/wcs/v1_0)
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint_Lambertuskerk,_Eindhoven)
