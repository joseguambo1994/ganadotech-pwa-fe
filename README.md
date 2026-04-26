# GanadoTech Sheep Counter SPA

Simple mobile-first SPA for sheep counting with a local video simulation.

## Product rules

- Mobile first by default. Every new screen starts from the small-screen layout and only then scales up.
- Single-page application. Keep the experience simple and focused.
- Only these counters exist in the product:
  - `Machos`
  - `Hembras`
  - `Nuevas crias`
  - `En celo`
  - `Enfermos`

## Current behavior

- The app uses `public/ganadotech.mp4` as the simulated pen video.
- Counter values are produced from a simple application use case that rotates through predefined scenarios as the video advances.
- The UI is intentionally minimal: one video card and one counter card.

## Architecture

The code follows four layers under `src/app`:

- `presentation`
  - Angular page and styles for the SPA.
- `application`
  - Facade and use case that transform video time into counter data.
- `domain`
  - Counter models and the source port.
- `infrastructure`
  - Concrete implementation that serves the local video simulation.

## Important files

- `src/app/presentation/pages/sheep-monitoring/`
- `src/app/application/use-cases/generate-sheep-monitoring-snapshot.use-case.ts`
- `src/app/application/services/sheep-monitoring.facade.ts`
- `src/app/domain/models/sheep-monitoring.models.ts`
- `src/app/domain/ports/sheep-monitoring-source.port.ts`
- `src/app/infrastructure/video/demo-video-monitoring.source.ts`

## Development

Install dependencies:

```bash
npm install
```

Run the app locally:

```bash
npm start
```

Build for production:

```bash
npm run build
```

Run tests:

```bash
npm test -- --watch=false
```
