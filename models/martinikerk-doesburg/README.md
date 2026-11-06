# Grote of Martinikerk (Doesburg)

De huidige Martinikerk is een laatgotische driebeukige basiliek zonder dwarsschip. Het model is opgebouwd uit afzonderlijke bouwdelen en dakvlakken: de hoge middenbeuk en vijfzijdige koorsluiting, de twee lagere zijbeuken, sacristie, westtoren, spits en steunberen.

## Bestanden

- `martinikerk-doesburg.glb`: glTF 2.0, meters, Y omhoog; node `building:martinikerk`.
- `martinikerk-doesburg.json`: catalogusplaatsing en vervanging van het BAG-pand.
- `martinikerk-doesburg-1-1000.stl`: gesloten printmodel in millimeters op 1:1000.
- `scripts/generate-martinikerk-doesburg.mjs`: reproduceerbare generator met manifold-3d.

## Oorsprong en bouwdelen

De oorsprong ligt op RD (206260, 447619,3), maaiveld ca. NAP +13,25 m. De lokale +X-as `[0.99955, 0.02999]` volgt de nok oostwaarts; de onderkant ligt 0,3 m onder de oorsprong. Het model vervangt `NL.IMBAG.Pand.0221100000312924`, dat zowel kerk als toren omvat. BAG- en 3D BAG-gegevens geven de voetafdruk, een hoofdnok op NAP +43,8 m en een 50°-dak. Het AHN geeft de goot- en zijbeukhoogtes en de omhullende van de toren tot het begin van de spits; voor de totale hoogte is 94 m aangehouden uit de openbare bronnen.

De zijbeuken zijn lessenaarsdaken met dakvensters, boven de zijbeuken ligt de lichtbeuk met vensternissen. Het koor heeft een veelhoekige sluiting met steunberen en hoge ramen. De westtoren draagt een hoge achtkantige spits met vereenvoudigde wijzerplaten en vier vergrote hoekpinakels. Vensters, galmgaten en de westelijke ingang zijn blinde spitsboognissen.

## Geschat en weggelaten

Schattingen op basis van de afbeeldingen zijn onder meer de afmetingen van de nissen, steunberen, portaal en sacristie, de positie en breedte van de dakvensters, het verloop van de spits, de bovenste lantaarn en de vergroting van pinakels. De open balustrade en het raam- en galmgatmaaswerk zijn vanwege afmetingen onder 0,9 m weggelaten; blinde nissen zijn 0,35 m diep. De spits eindigt ter printbaarheid op 0,9 m breedte. Een beeld van de oorspronkelijk open balustrade is niet met een dichte vervangende wand gesuggereerd.

## Controle

De generator controleert de manifoldstatus, vlakke onderzijde, Float32-rondgang en neerwaarts gerichte vlakken. In de proef is het model één aangesloten stuk, `NoError`, genus 0 en circa 70,5 × 32,7 × 94,3 mm bij 1:1000. Een tijdelijke catalogus- en 45°-steuntest slaagt; de volledige 3MF-export van een 150 × 150 m uitsnede op 1:1000 bevat het kerkobject. Vanuit vier gelijke hoeken is het model vergeleken met de PDOK-export en foto's; PDOK mist de spits en geeft grillige dakvlakken. De ligging op de kaart en de volledige 1:1000-preview zijn visueel gecontroleerd.

## Bronnen

- [Gemeente Doesburg: geschiedenis en torenhoogte](https://www.doesburg.nl/open-monumentendag).
- [Kerk & Orgel: bouwkundige beschrijving](https://www.kerk-en-orgel.nl/record.php?id=24326).
- [3D BAG, pand 0221100000312924](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0221100000312924); AHN DSM/DTM 0,5 m via PDOK WCS.
- [Wikimedia Commons, Martinikerk Doesburg](https://commons.wikimedia.org/wiki/Category:Grote_of_Martinikerk_(Doesburg)); onder meer dronefoto `1617284842 tmp DJI 0116-2.jpg` en RCE-foto's 20057939 en 20057940.
