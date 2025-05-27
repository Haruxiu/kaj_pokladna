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
    git clone <URL_VAŠEHO_REPOZITÁŘE>
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

4.  Umístěte soubor `prepared.mp3` (nebo jiný zvukový soubor pro upozornění na připravenou objednávku) do složky `public/` v kořenovém adresáři projektu. Pokud použijete jiný název souboru, aktualizujte `src` atribut `<audio>` tagu v `src/components/OrderCard.jsx` na správnou cestu (např. `/váš_soubor.mp3`).

5.  Spusťte aplikaci v režimu pro vývoj:

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
│   └── prepared.mp3  <-- Umístěte zde váš zvukový soubor
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
├── README.md           <-- Tento soubor
└── ... další konfigurační soubory
```

## Dokumentace

Kompletní dokumentace projektu, včetně cíle, postupu, popisu funkčnosti a komentářů ke kódu, je k dispozici v dokumentačním souboru (pokud byl vygenerován samostatně, nebo je vkomponován do komentářů v kódu).

--- 