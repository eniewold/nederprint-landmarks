# Oude Kerk, Soest

Eenbeukige gotische kerk met veelhoekig gesloten koor, lage noordelijke aanbouw, westtoren met korte spits en een slanke dakruiter. Naast de torenvoet staat een laag traptorentje. Het model vervangt BAG-pand 0342100000013337 volledig en is opgebouwd uit afzonderlijke muur- en dakvlakken, zonder gestapelde hoogtelagen.

## Ligging en maatvoering

De RD-oorsprong is (149868, 465043), +X loopt van de toren langs het schip naar het koor volgens (0,9998, -0,020). Het maaiveld ligt rond NAP +9,51 m. AHN DSM meet op de hoofdspits maximaal NAP +57,88 m. Het model reikt tot 48,37 m boven maaiveld; de voet steekt 0,5 m in het terrein. De afmetingen op schaal 1:1000 zijn circa 42,2 × 20,1 × 48,9 mm.

Plattegrond en kapvlakken zijn bepaald uit 3D BAG en AHN. De torenspits, dakruiter en traptorentje zijn hersteld uit AHN en schuine foto's; hun precieze doorsneden en de posities en afmetingen van venster- en galmgatnissen zijn geschat. De punten zijn minimaal 0,9 mm breed; leuningen, uurwijzers en klein maaswerk zijn weggelaten voor printbaarheid. De dakruiter is geschat op circa 19 m boven maaiveld: zijn dunne top wordt in AHN beperkt bemonsterd.

Er is in de PDOK-tegel binnen 4 m van de BAG-voet geen afzonderlijk buurpand gevonden, dus extra vervangingen zijn niet nodig.

## Bronnen en controle

- [3D BAG: pand en dakvlakken](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0342100000013337)
- [Rijksmonumentenregister 34107](https://monumentenregister.cultureelerfgoed.nl/monumenten/34107)
- [Commons: kerk en toren vanuit diverse zijden](https://commons.wikimedia.org/wiki/Category:Oude_Kerk_(Soest))
- [Stichting Kerk en Cultuur Soest: geschiedenis](https://kerkencultuursoest.nl/oude-kerk-soest/)
- PDOK 3D Basisvoorziening en AHN DSM/DTM 0,5 m. Vier aanzichten naast PDOK en foto's staan in werkscratchpad `soest-1964/compare0.png` t/m `compare3.png`; de in PDOK afgeknotte toren en kleine dakruiter zijn aangevuld.

Generator: `node scripts/generate-oude-kerk-soest.mjs --components`. De export is één gesloten volume (genus 0); de gerichte test controleert plaatsing, verbondenheid en steunbehoefte met doorsneden. Kaart en preview-export worden afzonderlijk in de webshop gecontroleerd.
