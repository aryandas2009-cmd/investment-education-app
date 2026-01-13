# Investment Education App

This application helps beginners understand major investment types, their pros and cons, and explore simple 5‑year trends for individual stock symbols.

## Features
- Clear explanations for stocks, bonds, mutual funds, ETFs, real estate, crypto, savings accounts, and retirement accounts
- Pros, cons, and “things to consider” for each type
- Stock trend search with a 5‑year chart
- Data source priority: Stooq (historical daily quotes). Automatic fallback to simulated data for smooth local runs

## Prerequisites
- macOS, Windows, or Linux
- One of:
  - Python 3 (recommended for a quick local static server)
  - Node.js (if you prefer using a static server such as `serve`)

## Local Setup
1. Clone the repository:
   - Using GitHub CLI:
     ```bash
     gh repo clone <your-username>/investment-education-app
     ```
   - Or using Git:
     ```bash
     git clone https://github.com/<your-username>/investment-education-app.git
     ```
2. Change into the project directory:
   ```bash
   cd investment-education-app
   ```
3. Run a local static server:
   - Python:
     ```bash
     python3 -m http.server 8000
     ```
     Then open http://localhost:8000/
   - Node (optional alternative):
     ```bash
     npx serve .
     ```

## Usage
- Use the left sidebar to select an investment type and read the overview
- Enter a stock symbol (for example: AAPL, MSFT, GOOGL) and click “Search” to see a 5‑year trend
- If the live source is not available or the symbol is not found, a realistic simulated series is shown

## Notes
- Educational content only; not financial advice
- Stooq data is public and does not require an API key
- The chart and content are client‑side only—no server dependencies

## Project Structure
```
investment-education-app/
├─ index.html
├─ styles.css
├─ app.js
└─ README.md
```

