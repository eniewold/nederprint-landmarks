# Instructies voor AI-assistenten

Deze repo bevat gegeorefereerde 3D-modellen van Nederlandse landmarks, elk
gebouwd door een eigen generatorscript met manifold-3d. Volg bij het maken of
aanpassen van een model [docs/handleiding.md](docs/handleiding.md) en
[docs/catalogus-formaat.md](docs/catalogus-formaat.md).

Kernregels:

- Eén model = `scripts/generate-<slug>.mjs` plus de map `models/<slug>/` met
  `<slug>.json`, `<slug>.glb`, de STL's en een `README.md`. Maak geen andere
  submappen in `models/`.
- Bouw uit vlakken en benoemde bouwdelen (planvergelijkingen, prisma's,
  `revolve`, `hull`), nooit uit gestapelde hoogtelagen uit het AHN.
- Herkenbaar en printbaar op 1:1000: delen van minstens 0,9 m, geen overhang
  boven 45 graden, elke node een gesloten manifold (`status()` is `NoError`).
- Alle invoer staat als constanten in het script; het script haalt niets van
  internet en de uitvoer is reproduceerbaar.
- Gebruik alleen open bronnen (PDOK, BAG, BGT, AHN, 3D BAG). Foto's alleen als
  referentie: zet ze in `sources`, niet in de repo. Neem niets over van Google,
  Mapbox of modelplatforms.
- Controlebeelden en tijdelijke bestanden horen buiten de repo.
- Genereer met `node scripts/generate-<slug>.mjs`; wijzig de GLB of STL nooit
  met de hand.
