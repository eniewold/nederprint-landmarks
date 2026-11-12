# Driekoningenkerk, Noordgouwe

Kruiskerk uit 1462 met een ingebouwde westtoren met tentdak, driezijdig gesloten koor en lage consistorie. Het model geeft de schuine dakvlakken van schip, dwarsschip en koor, de steunberen, ingang en blinde vensternissen weer.

## Bronnen en maatvoering

- [3D BAG, pand 1676100000460486](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1676100000460486): grondplan en afzonderlijke dakvlakken. Maaiveld NAP +0,471 m en torentop NAP +21,83 m, circa 21,35 m boven maaiveld.
- [AHN DSM/DTM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): dak- en maaiveldhoogtes; torentop in het DSM circa NAP +21,6 m.
- [Rijksmonument 11186](https://monumentenregister.cultureelerfgoed.nl/monumenten/11186), [kerkelijke beschrijving](https://protestantsegemeentedreischornoordgouwe.protestantsekerk.net/driekoningenkerk) en [Commons-foto's](https://commons.wikimedia.org/wiki/Category:Driekoningenkerk_(Noordgouwe)): ingebouwde toren, koor, dwarsschip en gevels.

De precieze venstermaten, steunberen, galmgaten en hoeken van de koorsluiting zijn geschat. De galmgaten zijn blinde nissen; uurwerk, kruis, glasroeden en windwijzer zijn kleiner dan 0,9 m en voor de print weggelaten. De daken bestaan uit dakvlakken en benoemde bouwdelen, niet uit gestapelde hoogtelagen.

## Bestanden en controle

De GLB heeft één gebouw-node in meters, Y omhoog. De JSON plaatst het model op RD (54856, 412664), xAxis (0,99956, 0,0297), en vervangt het opgegeven BAG-pand. De onderzijde ligt 0,5 m onder maaiveld. STL's zijn beschikbaar op 1:100 en 1:1000. De generator draait met `node scripts/generate-driekoningenkerk-noordgouwe.mjs --scale 1000`.

De gerichte modeltest controleert plaatsing, één gesloten component met genus 0 en de 45-gradensteun via volume en doorsneden. Vier modelaanzichten zijn naast PDOK en schuine foto's vergeleken: het model behoudt schip, koor, kruisarmen en consistorie en voegt galmgaten, nissen, steunberen en ingang toe. Nabije PDOK-panden zijn onderzocht; er is geen bevestigde hoge kolom gevonden. De kaart en preview-export van de volledige uitsnede zijn gecontroleerd.
