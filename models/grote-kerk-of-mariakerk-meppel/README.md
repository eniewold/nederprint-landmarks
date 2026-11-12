# Grote Kerk of Mariakerk, Meppel

Tweebeukige kerk met vierkante toren en lantaarn, geschikt gemaakt voor afdrukken zonder ondersteuning. De generator gebruikt vlakken voor de afzonderlijke beuken, dakschilden en torenbouwdelen. De steunberen en diepe gevelnissen volgen de foto’s en blijven op 1:1000 zichtbaar.

## Bronnen

- [Rijksmonumentenregister 28632](https://monumentenregister.cultureelerfgoed.nl/monumenten/28632)
- [3DBAG-pand 0119100000000319](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0119100000000319), PDOK 3D-reconstructie en AHN DSM 0,5 m.
- [Kerk en toren](https://grotemariakerk.nl/over/): torenhoogte 45 m.
- [Foto’s Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Grote_of_Mariakerk_(Meppel)).

## Maten en aannames

Oorsprong RD (209275, 523624), lengteas (0,984; −0,178), maaiveld NAP +1,735 m. Kerkvolume circa 51,2 × 24,9 m inclusief steunberen en aanbouw; nokhoogte circa 15,1 m, torentop 45 m boven maaiveld. Het AHN-raster had slechts kleine gaten: grootste aaneengesloten gat twee pixels. Hoofdmaten zijn uit BAG/3DBAG, AHN en PDOK afgeleid; de exacte dakhelling, lantaarnvorm, raamverdeling, steunbeermaten en hoogten van de aanbouw zijn op foto’s geschat. Fijn ornament en hekwerk zijn vanwege de printschaal vereenvoudigd.

## Reproductie en controle

`node scripts/generate-grote-kerk-of-mariakerk-meppel.mjs --scale 1000 --components` en idem met `--scale 100`. Het model is één gesloten deel (genus 0), met vlakke onderzijde en zonder ondervlakken steiler dan 45 graden. De 1:1000-STL meet 51,2 × 24,9 × 45,5 mm. Een vierzijdige vergelijking met de PDOK-reconstructie en schuine foto’s is uitgevoerd. De kaart is met en zonder landmarklaag en schuin bekeken; de volledige uitsnede is op 1:1000 zonder ondersteuning in de printpreview gecontroleerd.
