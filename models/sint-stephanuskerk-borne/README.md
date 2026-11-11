# Sint-Stephanuskerk (Borne)

Model van de neogotische hallenkerk met toren, pastorie en het ermee verbonden platte parochiegebouw. De laatste twee zijn opgenomen omdat dezelfde BAG-identificatie de gehele footprint dekt; die reconstructie wordt in de kaart door dit model vervangen.

## Bestanden

- `sint-stephanuskerk-borne.glb`: één gesloten node `building:kerk`, in meters, Y omhoog.
- `sint-stephanuskerk-borne.json`: plaatsing en BAG-vervanging.
- `sint-stephanuskerk-borne-1-1000.stl`: voor een afzonderlijke print op 1:1000, Z omhoog, in millimeters.
- `sint-stephanuskerk-borne-grondplaat-1-1000.stl`: dezelfde print met grondplaat.
- Generator: `scripts/generate-sint-stephanuskerk-borne.mjs`.

## Oorsprong en oriëntatie

RD-oorsprong (248260, 480090), maaiveld circa NAP +15,2 m. De lokale +X loopt langs de kerkas naar de voorgevel; de RD-richting is (0,656059, 0,754710). De voet staat op -0,5 m; de kaart laat hem nog 0,3 m zakken voor de aansluiting op terrein. Het model vervangt BAG-pand `NL.IMBAG.Pand.0147100000013192`.

## Onderdelen en schattingen

De hoofdbeuk heeft twee dakvlakken met nok circa +17,5 m boven maaiveld; de zijbeuken hebben lagere hellende daken. Verder zijn weergegeven: dwarsschip met portaal, driezijdig koor met lagere koorvleugels, toren met galmgaten, wijzerplaatnissen, vier geveltoppen en spits, kleine hoektoren, dakruiter, steunberen, spitsboognissen en dakkapellen. De pastorie heeft een schilddak, trapgevel, dakkapellen en gevelnissen; de aangrenzende aanbouw heeft afzonderlijke vlakke dakhoogtes en een piramidaal daklicht op de BAG-contour. De AHN-top van de toren ligt op circa NAP +64,8 m, oftewel +49,6 m ten opzichte van de gekozen maaiveldhoogte; dunne elementen zijn voor 1:1000 vereenvoudigd.

Geschat aan de hand van foto's zijn positie en afmetingen van nissen, ingang, dakkapellen, steunberen en torenbekroning. De afmetingen van de gevelnissen, trapgevel en dakkapellen van de pastorie zijn geschat; de rechte vensters zijn als printbare spitsboognissen vereenvoudigd. De details en het verloop van de lage aanbouw moeten nog op de kaart worden gecontroleerd. Weggelaten zijn maaswerk, uurwerkdetails, kruisjes, smalle balkonbalusters en afvoerbuizen kleiner dan 0,9 m op ware grootte.

## Controle

De generator controleert manifoldstatus, verbindingen en overhang en schrijft een GLB en een STL op 1:1000. De PDOK-gebouwtegel is vanuit vier richtingen naast het model vergeleken; beschikbare foto's tonen niet alle achtergevels vrij. De kaartcontrole en preview-export dienen nog te worden afgerond.

## Bronnen

- [Rijksmonumentenregister nr. 9920](https://monumentenregister.cultureelerfgoed.nl/monumenten/9920): bouwvorm en geschiedenis.
- [3D BAG, pand 0147100000013192](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0147100000013192): contour, dakvlakken en maaiveld.
- PDOK AHN DSM 0,5 m en actuele luchtfoto: hoogtes en ligging.
- [Wikimedia Commons: Stephanuskerk Borne](https://commons.wikimedia.org/wiki/Category:Stephanuskerk_(Borne)): gevels en zichtbare onderdelen.
