# Hervormde Gemeente Nieuwvliet

Eenbeukige zaalkerk met schilddak, een kleine lagere aanbouw en een dakruiter met vierkante kloklantaarn. Volgens de historische beschrijvingen is het kerkgebouw omstreeks 1658–1659 gebouwd; het BAG-bouwjaar 1695 is als registratiegegeven opgenomen en niet als nauwkeurig bouwjaar overgenomen.

## Bronnen en maatvoering

- [3D BAG, pand 1714100000717682](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1714100000717682): grondplan, richting van dakvlakken en nok NAP +13,99 m; maaiveld NAP +2,045 m. Het kerkgebouw en de lagere aanbouw behoren tot hetzelfde pand.
- [AHN DSM/DTM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld en hoogte van dak en dakruiter; 3D BAG meet het hoogste punt van de dakruiter op NAP +18,88 m, circa 16,83 m boven maaiveld.
- [Rijksmonument 31527](https://monumentenregister.cultureelerfgoed.nl/monumenten/31527) en [Commons/RCE-foto’s](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Nieuwvliet): voorzijde, zijgevels en dakruiter.

Maten en vorm van de klokkenlantaarn, vensternissen, steunberen en aansluiting van de kleine aanbouw zijn uit foto's en reconstructie geschat. De open lantaarn is als blinde nissen in een gesloten kern vormgegeven voor de print; de windvaan, klok en het uurwerk zijn te klein op 1:1000 en weggelaten. Het hoofdvolume is opgebouwd uit schuine dakvlakken en afzonderlijke bouwdelen.

## Bestanden en controle

De GLB heeft één gebouw-node in meters met Y omhoog. De JSON plaatst het model op RD (21690, 377615) met xAxis (0,625, -0,7806) en vervangt het aangegeven BAG-pand. De onderzijde ligt 0,5 m onder maaiveld. STL's zijn beschikbaar op schaal 1:100 en 1:1000. De generator draait met `node scripts/generate-hervormde-gemeente-nieuwvliet.mjs --scale 1000`.

De gerichte modeltest controleert plaatsing, één gesloten component met genus 0 en de 45-gradensteun via volume en doorsneden. Vier aanzichten zijn naast PDOK en beschikbare schuine RCE-foto's vergeleken: het model behoudt schip en aanbouw en voegt vensters, steunberen, ingang en lantaarn toe. Er is geen bevestigde hoge kolom bij de aangrenzende panden gevonden. De kaart en preview-export van de volledige uitsnede zijn gecontroleerd.
