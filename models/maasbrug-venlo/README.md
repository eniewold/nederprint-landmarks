# Maasbrug (Stadsbrug), Venlo

Staal-betonplaatliggerbrug met drie rivierpijlers, een oeverpijler, twee
landhoofden en de vier Wachters van Tajiri. De spoorbrug ernaast behoort niet
tot dit model. Generator: `scripts/generate-maasbrug-venlo.mjs`.

## Bronnen en opbouw

- [Bruggenstichting, A. Romeijn](https://bruggenstichting.nl/tijdschrift/ouder/48-bruggen-2002/588-evolutie-van-de-verschijningsvorm-van-vaste-bruggen-vanaf-1940): staal-betonbrug uit 1957, hoofdoverspanning ruim 60 m.
- [Nationaal Archief, 908-2438](https://commons.wikimedia.org/wiki/File:Bouw_brug_Maas_bij_Venlo,_Bestanddeelnr_908-2438.jpg): schuin overzicht vanaf Nedinsco; de verkeersbrug ligt vóór de toenmalige spoorbrug en Baileybrug.
- [Nationaal Archief, 907-8991](https://commons.wikimedia.org/wiki/File:Nieuwe_verkeersbrug_over_de_Maas_bij_Venlo,_Bestanddeelnr_907-8991.jpg): schuine onderzijde met plaatliggers en massieve pijlers.
- [Foto uit 2021](https://commons.wikimedia.org/wiki/File:Venlo_hoogwater_juli_2021_6.jpg): fietsdek, rand en aansluiting; de zichtbare parallelle brug is de spoorbrug.
- [Nationaal Comité 4 en 5 mei](https://www.4en5mei.nl/oorlogsmonumenten/zoeken/3000/venlo-de-wachters): vier beelden, 9 m inclusief sokkels.
- [Wachterfoto uit 2023](https://commons.wikimedia.org/wiki/File:Venlo,_sculptuur_één_van_de_Wachters_ontworpen_door_Shinkichi_Tajiri_IMG_7158_2023-07-10_18.20.jpg): sokkel, smalle stam, breed pantser en hoorns.
- PDOK actuele BGT-overbruggingsdelen en wegdelen, AHN DSM/DTM 0,5 m en actuele luchtfoto; opgehaald op 10 oktober 2026.

Dek: `G0983.7aa5d4c01c5f4ddbb1b87015efec2526`, 5.747,8 m².
De letterlijke contour bepaalt de schuine uiteinden en de dekranden.
Het lokale dek is 257,82 m lang; de maximale dwarsomvang inclusief pijlervoeten
is 26,60 m. RD-oorsprong `[208900.3975864089,375794.98474320024]`,
X-as `[0.8774403134966757,-0.4796858307797463]`, naar Venlo.

Het AHN-lengteprofiel loopt van circa 23,02 naar 24,88 m NAP en terug naar
23,19 m NAP. De dekplaat is een doorlopend loft langs dezelfde stations als
de snijlaag; vier afzonderlijke plaatliggers liggen eronder. De pijlers volgen
hun BGT-voetafdrukken, inclusief de scheve richting in de rivier.
De drie rivierpijlerassen liggen lokaal ongeveer op -56,8, 4,5 en 66,1 m.
Er zijn geen gestapelde hoogteplakken of DSM-hoogtelagen.

Geschat: dekplaatdikte 0,8 m, vier liggers met 2,4 m totale constructiehoogte,
flenzen, pijleropstand, landhoofddiepte en schampkanten. De vier Wachters zijn
vereenvoudigde, geschatte silhouetten met 3 m sokkel en 6 m beeld; positie,
pantser en hoorns zijn schematisch, geen exacte sculptuurreproducties. Hun
smalste delen zijn minstens 0,9 m. Kleine lampen, leuningstaven en staalribben
zijn weggelaten vanwege 1:1000.

NAP-referentie van het water is geschat op 10,5 m; maaiveld wordt op twee
punten naast het dek bemonsterd. Gemeten PDOK-fallback: 57,356541221362235 m
in het hoogteframe van de app. Grondoffset -0,1 m, pijlervoeten tot -1 m lokaal.

## Wegdelen en print

Eén `building`-node voor de constructie, zes `road`-nodes voor rijbaan asfalt,
voetpad tegels, fietspad tegels, voetpad asfalt, fietspad asfalt en voetpad
gebakken klinkers. Alle 22 actuele wegdeelcontouren en `lokaal_id`'s staan
letterlijk in de generator. Hun functie, fysiek voorkomen en ingevulde
plus-waarde worden onveranderd `extras.attributes`.

De bovenste 0,5 m is de wegdeklaag. Schampkanten en Wachtersokkels blijven
constructie met 2 cm vrije ruimte rond de snijstrook. Alle onderdelen vullen
samen het oorspronkelijke brugvolume, zonder volumeoverlap.
`replaces-terrain.mjs maasbrug-venlo --write` vindt precies het bovenstaande
BGT-dek; dat verdwijnt met de landmarks aan. Water, pijlervoeten en spoorbrug
blijven staan.

STL 1:1000: 9.086 driehoeken, gesloten `NoError`, genus 0, circa 69,16 cm³,
257,82 × 26,60 × 22,96 mm. Een interne 50°-printvoet draagt het dek en de
liggers; het centrale scherm is minimaal 0,9 mm. De generator controleert
alle neerwaartse vlakken: **0 m² onprintbare overhang boven de bodem**.
Er is geen externe steun nodig. Deze printvoet staat alleen in de STL.
De GLB houdt de echte open ruimten tussen de pijlers.

## Uitgevoerde controles

- 2.410 onafhankelijke AHN-dekmetingen, 100% geldig; 98,84% binnen 1 m en
  99,71% binnen 2 m. Mediaan model minus AHN -0,017 m; P90 absolute fout 0,068 m.
- 2.825 verticale stralen over alle nodes: nul samenvallende bovenvlakken
  binnen 1 cm en nul wegvlakken zonder dikte.
- Volledige 320 × 320 m preview en 3MF op 1:1000, onderplaat 1 mm,
  hoogtefactor 1, overhang 45°, zonder bomen, fietspadregel Bambu Red.
  Het hele model valt binnen de uitsnede.
- Gezamenlijke 3MF-opvulling: constructie +248,43%; geen eigen wegopvulling.
  Booleaanse export trimt wegvolume: rijbaan -0,32%, voetpad asfalt -0,35%,
  fietspad asfalt -0,48%, tegels -2,63%/-3,24%, kleine klinkerstrook -5,47%.
  Alle wegdelen blijven als gesloten, afzonderlijk gekleurde onderdelen behouden.
- Vier schuine volledige GLB-renders en vier preview-renders met identieke
  camera's naast PDOK, beoordeeld tegen de schuine bronfoto's. Pijlers,
  verhoogd dek, liggers en vier Wachters zijn vanuit beide oevers zichtbaar.
- Werkelijke kaart met landmarks aan/uit: rode fietsstrook volgt de brug,
  het platte PDOK-dek verdwijnt en het water blijft gesloten. De kaartcontrole
  is van boven uitgevoerd; de schuine controle gebruikt de GLB en de volledige preview.
- Verplichte test in `tests/landmark-models.test.ts`: nodes en attributen,
  wegdekhoogte, afwezigheid van constructiehoekpunten op de rijbaan, drie
  rivierpijlers, vier Wachters en vervangen terrein-ID.

Controle-URL: `/kaart/51.36874/6.16130/600/1x1/0?landmarks=1&rules=r.f.fietspad.10200`.
Nakijken: Wachtersilhouetten, de geschatte liggerdikte en de aansluitingen
van de rode fietsstrook op beide landhoofden.
