# Restaurační Systém

Jednoduchý webový restaurační systém vytvořený pomocí Reactu.

## Funkcionalita

*   Správa položek menu (přidání, úprava, smazání, kategorizace).
*   Vytváření nových objednávek s výběrem stolu a přetahováním položek z menu.
*   Sledování aktivních objednávek.
*   Zpracování plateb za objednávky (hotovost/karta) a výpočet vrácené částky.
*   Historie dokončených transakcí s filtry a statistikami.
*   Simulace použití Geolocation API, Audio API a tisku účtenek.

## Technologie

*   React
*   React Router v6
*   SCSS/CSS
*   HTML5 (sémantické tagy, ARIA atributy)
*   JavaScript (OOP principy)
*   `@hello-pangea/dnd` pro drag-and-drop

## Instalace a spuštění

1.  Naklonujte repozitář:

    ```bash
    git clone <https://gitlab.fel.cvut.cz/dinhphuc/kaj_kasa.git>
    ```

2.  Přejděte do adresáře projektu:

    ```bash
    cd restauaracni-system
    ```

3.  Nainstalujte závislosti:

    ```bash
    npm install
    # nebo
    yarn install
    ```


4.  Spusťte aplikaci v režimu pro vývoj:

    ```bash
    npm start
    # nebo
    yarn start
    ```

    Aplikace by se měla otevřít ve vašem výchozím prohlížeči na adrese `http://localhost:3000` (nebo jiném dostupném portu).

## Struktura projektu

```
restauracni-system/
├── public/
│   ├── index.html
│   └── prepared.mp3  <-- zvukový soubor
├── src/
│   ├── components/     <-- React komponenty
│   ├── hooks/          <-- Custom React hooky (např. useLocalStorage)
│   ├── styles/         <-- SCSS styly
│   ├── utils/          <-- Pomocné funkce (např. geolocation)
│   ├── App.jsx         <-- Hlavní komponenta a správa stavu
│   ├── index.js        <-- Vstupní bod aplikace
│   └── ... další soubory
├── .gitignore
├── package.json
├── README.md         
└── ... další konfigurační soubory
```