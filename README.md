# SashiDo React starter

A React + Vite app on a [SashiDo](https://www.sashido.io) backend (Parse Server): sign up and login, and a private todo list that updates live across tabs and devices.

What it shows, done the way it should be on Parse:

- **Users and sessions** with the Parse JS SDK; the session survives reloads.
- **Private data**: every todo gets an ACL for its owner in cloud code (`cloud/main.js`), so no client can read, change or delete someone else's, whatever it sends.
- **Locked-down class**: the `Todo` class allows only logged-in users and no new fields from clients (`scripts/setup-schema.mjs`).
- **Validation on the server**: titles are checked in `beforeSave`.
- **Live updates** with Live Queries (optional).

## 1. Create a SashiDo app

Create an app at [dashboard.sashido.io](https://dashboard.sashido.io). Then:

**Cloud code.** Copy `cloud/main.js` into your app's repository (**Core › Cloud Code**: link GitHub and clone it) and push to `master`. SashiDo deploys it.

**The Todo class.** From your machine, with the keys in **App Settings › Security & Keys**:

```bash
PARSE_SERVER_URL=https://pg-app-xxxxxxxx.scalabl.cloud/1 \
PARSE_APP_ID=<Application ID> PARSE_MASTER_KEY=<Master Key> \
npm run setup-schema
```

The master key stays on your machine: the app itself only uses the public keys.

**Live updates (optional).** In **App Settings › Live Queries** tick `Todo`.

## 2. Run the app

```bash
npm install
cp .env.example .env    # fill in Application ID, JavaScript Key, API URL (and the LiveQuery URL)
npm run dev
```

Open http://localhost:5173, sign up and add a few todos. Open a second tab: with Live Queries on, changes show up in both.

## 3. Deploy the web app

`npm run build` writes a static site to `dist/`. Host it anywhere, or on SashiDo itself: copy `dist/` into your app repository's `public/` folder and push.

## Notes

- The SDK uses Node's `EventEmitter`; the `events` package in `package.json` provides it in the browser (without it Vite fails with "Emitter is not a constructor").
- The Application ID and JavaScript Key are public by design. What protects the data is the ACL and the class-level permissions, and the master key never goes into the app.
- Tested on Parse Server 8.6.117 and 6.5.11.

Docs: [SashiDo developer docs](https://www.sashido.io/en/docs/developers) · [Parse JS guide](https://docs.parseplatform.org/js/guide/)
