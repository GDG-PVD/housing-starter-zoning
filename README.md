# Site Explorer: Challenge 1 starter

**What can be built at this site?**

A starter for [Build for Good: AI Lab for Housing](https://gdgpvd.dev/housing-jam) (DevFest Providence 2026). It is [Site Explorer](https://github.com/GDG-PVD/housing-site-explorer) with the Challenge 1 tab already built, so your team starts from a working tab and spends the afternoon making it better.

## What's already built

- A "Draft the lot checklist" button: Gemini drafts what to check in the town's zoning ordinance for this lot (zoning district, minimum lot size, setbacks, height, units by right, parking, special permits) and where in the ordinance to look.
- A table with a "Your value" box for each check, filled in by you from the ordinance itself. Gemini never fills in the values.
- A list of recent Rhode Island housing laws (2024 to 2026) that could change what the lot can hold, such as accessory dwelling units.

Below the map, amenities, zoning link and summary, the new tab is at the bottom of the page. The code is in `challenge.ts` (the `/api/lot-check` endpoint and its Gemini prompt) and `src/components/ChallengePanel.tsx` (the tab).

## Start

1. Click **Use this template** (top right on GitHub) to make your team's own copy, then clone it.
2. Run it:

   ```
   npm install
   npm run dev
   ```

3. Put `GEMINI_API_KEY` and `GOOGLE_MAPS_API_KEY` in a `.env.local` file (it is never committed). Open http://localhost:3000, explore an address, and scroll to the Challenge 1 tab.

Working in Google AI Studio instead of an editor? [Remix Site Explorer](https://ai.studio/apps/fcbdfa66-237e-4e2a-b5b4-090284f9d4bc) and use the Challenge 1 prompt cards on [gdgpvd.dev/housing-jam](https://gdgpvd.dev/housing-jam). This repo is for teams who want their own code.

## Your Google Maps key

The app hands the Maps key to the browser to draw the map, so anyone who opens a shared copy can read it. The server also uses the same key to look up addresses and nearby places, so do not restrict it to your app's website: Google refuses website-restricted keys on server calls, and address search would fail while the map still draws. Instead, in the Google Cloud console (APIs & Services, then Credentials, then your key), restrict it to the Maps JavaScript, Geocoding, Places API (New) and Places APIs, set a low daily quota on each of those APIs, and delete the key after the event. Never paste a key into a chat or commit one.

## Keep going

Prompts to try next, in AI Studio or with your coding assistant:

1. "Next to the "Zoning district" row, add a link to the town's zoning map or GIS viewer."
2. "Flag any check where my value would not allow a 6-unit building, so I can see what would need a variance."
3. "Save the values I type for each address, so they are still there when I come back."
4. "When I pick a language in the summary card, translate the lot check panel too. Keep district names, numbers and links as they are."

## Submit

Submit your team's app by 3:15 at [gdgpvd.dev/housing-jam](https://gdgpvd.dev/housing-jam): a screenshot and the link to your app or repo. One person submits for the whole team.

## The fine print

Everything Gemini drafts here is a starting point, not a zoning determination, legal advice or a funding commitment. Check with the town and the program.

Code is licensed under the [Apache License 2.0](LICENSE). Copyright 2026 GDG Providence; see [NOTICE](NOTICE).

Docs and any sample data are licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
