# Grote of Jacobijnerkerk (Leeuwarden)

Landmarkmodel van de driebeukige Jacobijnerkerk in Leeuwarden. Het gereconstrueerde Angelustorentje staat op het kerkdak; er is geen vrijstaande kerktoren.

## Bestanden en plaatsing

- `grote-of-jacobijnerkerk-leeuwarden.glb`: gesloten gebouwvolume, meters, glTF met Y omhoog.
- `grote-of-jacobijnerkerk-leeuwarden.json`: positie, oriëntatie en bronnen.
- `grote-of-jacobijnerkerk-leeuwarden-1-1000.stl`: losse print op 1:1000.
- Generator: `scripts/generate-grote-of-jacobijnerkerk-leeuwarden.mjs`.

De oorsprong ligt op RD (182411, 579803), op maaiveldniveau; lokale +X volgt de nok 4,2° zuid van oost. Het model vervangt BAG-pand `0080100000360014`. Het ondervlak ligt 0,5 m onder het lokale maaiveld.

## Onderdelen en aannames

Hoofdbeuk en vijfzijdige koorsluiting, de noordbeuk, vier kapellen met dwarskappen aan de zuidzijde, twee lagere koorkapellen met schilddaken, steunberen, blinde vensternissen en een Angelustorentje zijn opgebouwd uit vlakken en bouwdelen. De 3D BAG geeft de nokken en dakvlakken en een maaiveld van circa NAP +2,70 m; de hoogste DSM-meting ter plaatse van de dakruiter is NAP +42,13 m.

Breedte en detaillering van de dakruiter, steunberen, vensters, portalen en de kleine aanbouwen zijn geschat op basis van de hoogtegegevens en foto's. Het ronde venster in de westgevel is een printbare spitse nis. Maaswerk en details onder 0,9 m zijn voor de schaal 1:1000 weggelaten. De huidige spits en gerestaureerde west- en zuidgevel wijken af van oudere foto's met een koepelvormige dakruiter en een klassiek zuidportaal. De hoogteplaatsing en aanbouwen zijn op de kaart en in de preview bekeken.

## Controle

De generator controleert de gesloten manifold, rondgang via Float32 en de overhanghoeken. De proefexport heeft één aangesloten volume, status `NoError`, genus 0 en meet 64,09 × 29,4 × 39,93 mm op 1:1000. Een tijdelijke catalogus- en 45°-steuntest slaagt; de volledige 3MF-export van een 150 × 150 m uitsnede op 1:1000 bevat het kerkobject. Renders vanuit vier hoeken zijn vergeleken met de PDOK-export en foto's; de kaart en de volledige 1:1000-preview zijn bekeken.

## Bronnen

- [3D BAG, pand 0080100000360014](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0080100000360014): dakvlakken, omtrek en maaiveld.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): DSM 0,5 m, dakruiter.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Grote_of_Jacobijnerkerk_(Leeuwarden)): gevels en kerk.
- [Noordgevel na restauratie](https://commons.wikimedia.org/wiki/File:Noord-gevel_na_restauratie_-_Leeuwarden_-_20131865_-_RCE.jpg): noordelijke steunberen en huidige spits.
- [Monumenten in Nederland, Fryslân](https://www.dbnl.org/tekst/sten009monu06_01/sten009monu06_01_0100.php): beschrijving van de koorsluiting, kapellen, sacristie en dakruiter.
