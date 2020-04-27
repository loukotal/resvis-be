# Úkol
Tento úkol jsem vymýšlel jako zadání pro `django-rest-framework`. Zde jsem se ho pokusil vypracovat v `nodejs` a `express`.
## Zadání úkolu
Vytvořit systém ve kterém si uživatel bude moct psát "deník návštěv restaurací". Náš uživatel rád cestuje a chce si zapisovat vlastní hodnocení restaurací, které navštívil, aby věděl, kam příště jít / komu co doporučit. 
Je tedy nutné zaznamenávat Restauraci a Návštěvu. U Restaurace je nutné znát název, místo, typ (typ kuchyně). Návštěva by měla zaznamenávat datum návštěvy, poznámku (kam si uživatel může zapsat, co si dal a další poznatky) a hodnocení (hodnoty v rozmezí 1 - 5).
## Požadavky
- registrace a přihlášení uživatele přes API pomocí JWT
- možnost vytvoření nové Restaurace
- vylistování a detail Restaurací (v detail zobrazit všechny Návštevy dané restaurace)
    - Vylistování Restaurací zobrazí pouze restaurace, které vytvořil daný uživatel 
    - Detail Restaurace může zobrazit pouze uživatel, který vytvořil danou Restauraci
    - Při výpisu dat přidat field, který zobrazí průměrné hodnocení všech Návštěv daného uživatele (defaultně = 0)
- možnost vytvoření Návštevy určité Restaurace (Návštěvu k Restauraci může vytvořit pouze uživatel, který vytvořil danou Restauraci)
- vylistování a detail Návštěv
    - Vylistování Návštěv zobrazí pouze návštěvy, které vytvořil daný uživatel 
    - Detail Návštevy může zobrazit pouze uživatel, který vytvořil danou Návštěvu
## Bonusy
- Upravení projektu tak, aby byl spustitelný pomocí Docker (či docker-compose). Tzn. vytvoření `Dockerfile` (a případně `docker-compose.yml`)
- Upravení projektu tak, aby používal `environment variables`.