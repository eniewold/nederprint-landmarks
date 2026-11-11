# Geboorte van de Heilige Johannes de Doper, Montfoort

De kerk uit 1925 heeft een hoog schip met twee langskappen, een dwarsschip, een veelzijdig gesloten koor, een vieringtoren en de bijbehorende lage aanbouwen. Het model vervangt BAG-pand 0335100000319913 volledig. De uit 3D BAG afgeleide gebouwcontour en afzonderlijke schuine dakvlakken zijn samengevoegd tot een printbaar volume. De door PDOK afgeknotte vieringtoren is aangevuld met een achtzijdige spits.

## Ligging en maatvoering

De RD-oorsprong is (124735, 450820). De +X-as loopt langs het schip naar het koor volgens (0,932, 0,362). Het maaiveld ligt circa NAP +2,14 m. Het AHN DSM meet op de spits maximaal NAP +43,26 m; de modelspits ligt 41,12 m boven maaiveld. De voet steekt 0,5 m in het terrein. Het model meet circa 53,4 × 38,0 × 41,6 mm op schaal 1:1000.

De omtrek en dakvlakken van schip, zijbouw, dwarsschip, koor en sacristie volgen 3D BAG en AHN. De vieringtoren en de ontbrekende torenspits zijn geschat uit AHN en foto's; galmgaten en grote spitsboogvensters zijn vereenvoudigd als ondiepe nissen. De spits eindigt op een breedte van 0,9 mm; klein ornament, wijzerplaten en raamtracering blijven onder de printmaat.

Buurpand 0335100000319914 raakt de kerkregistratie. Plaatselijke PDOK-dakvlakken rond NAP +15 m zijn vergeleken met AHN en wijken doorgaans ten hoogste circa 0,7 m af; ze zijn niet overmatig hoog en vereisen geen extra vervanging.

## Bronnen en controle

- [3D BAG: pand en dakvlakken](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0335100000319913)
- [Rijksmonumentenregister 512115](https://monumentenregister.cultureelerfgoed.nl/monumenten/512115)
- [Commons: foto's kerk en omgeving](https://commons.wikimedia.org/wiki/Category:Geboorte_van_de_Heilige_Johannes_de_Doper)
- [Stichting Vrienden: monumentbeschrijving](https://www.stichtingvriendenvanjohannesdedoperkerkmontfoort.nl/historie/100-jarig-kerkgebouw-1925/rijksmonument)
- PDOK 3D Basisvoorziening en AHN DSM/DTM 0,5 m. Vier vergelijkingen van model, PDOK en foto's zijn gemaakt in het werkscratchpad `montfoort-1956/compare0.png` t/m `compare3.png`.

Generator: `node scripts/generate-geboorte-van-de-heilige-johannes-de-doper-montfoort.mjs --components`. De export vormt één gesloten volume (genus 0); de gerichte test controleert plaatsing, verbondenheid en steunbehoefte met doorsneden. De kaart en preview-export worden afzonderlijk in de webshop gecontroleerd.
