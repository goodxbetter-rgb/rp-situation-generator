# RP Situation Generator

A small SillyTavern UI extension that generates exactly three next-scene suggestions from the current chat context.

## Features
- Adds a `สุ่มสถานการณ์ ×3` button beside the chat send controls.
- Uses SillyTavern's `generateQuietPrompt()` so suggestions are generated in the current chat context without posting a message into the RP.
- Shows three separate suggestion cards.
- Each card has its own Copy button.
- Does not automatically write or send anything as the user.

## Install (manual)
1. Stop SillyTavern.
2. Find your SillyTavern installation folder.
3. Open `data/<your-user-folder>/extensions/`.
4. Create a folder named `rp-situation-generator`.
5. Extract `manifest.json`, `index.js`, and `style.css` into that folder.
6. Start SillyTavern and refresh the browser page.
7. Open Extensions > Manage Extensions and make sure **RP Situation Generator** is enabled.

If your installation does not load user-scoped extensions from that folder, use the Extensions > Install Extension workflow with a Git repository URL, or place the folder under `scripts/extensions/third-party/` for an all-users local development install.

## Usage
Open any RP chat and click `สุ่มสถานการณ์ ×3` near the message input. Wait for generation, then Copy the suggestion you want and paste it into the chat yourself.

## Notes
- Uses the currently selected SillyTavern API/model. Generation may consume tokens/API credit.
- Requires a SillyTavern version exposing `SillyTavern.getContext().generateQuietPrompt`.
- The extension is provided as a starting build and has not been tested against your specific local SillyTavern version or theme.
