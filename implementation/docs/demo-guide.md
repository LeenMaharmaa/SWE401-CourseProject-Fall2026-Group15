# Run and demonstrate SkillBridge

## First setup

1. In VS Code, choose **File → Open Folder** and open `implementation`.
2. Choose **Terminal → New Terminal**.
3. Run `npm install`.
4. Run `Copy-Item .env.example .env.local` once. If `.env.local` already exists, edit it instead of copying over your key.
5. Open [Google AI Studio](https://aistudio.google.com/app/apikey), copy your existing API key (or choose **Create API key**), and paste it into `.env.local` as shown below. Keep the key private and do not paste it into chat.
6. Run `npm run dev` and open `http://localhost:3000`.
7. Sign in with `demo@skillbridge.local` and password `123456`.

The live mode needs internet and an available model in your AI Studio project. If a model is unavailable, change `GEMINI_MODEL` to an available model and restart. No billing upgrade is required by this application.

Your `.env.local` should contain:

```dotenv
GEMINI_API_KEY=paste_your_actual_key_here
GEMINI_MODEL=gemini-3.5-flash-lite
```

Do not add `NEXT_PUBLIC_` to the key name. Stop the current server with `Ctrl+C` after saving, then run `npm run dev`. The missing key notice disappears once a key is configured; a successful generation confirms that the key and model actually work.

Adding a key does not create interview notes or change old records. New analysis, comparison, and interview content is generated when you press the relevant button. The optional sample input buttons and fictional demo profile remain available. Old sample results retain their sample marker; delete them from My history if no longer needed. The **Sample rehearsal** banner is shown only when running `npm run demo:sample`, even if a key has been configured.

## SQLite in VS Code

SQLite Viewer is already installed on this computer. After the application starts, open `data/skillbridge.db` in Explorer. If it opens as text, right click its tab and choose **Reopen Editor With → SQLite Viewer**. Select a table, such as `profiles`, `analyses`, or `compatibilities`. Refresh or reopen the viewer after saving in the app.

You do not need to install a server, create tables, or write SQL. The database file retains your records when the application stops.

If the extension is missing on another computer, open Extensions with `Ctrl+Shift+X`, search for **SQLite Viewer** by **qwtel**, and install it. The free viewer is sufficient; the application handles all record updates.

## Quick checks

Run these in the application folder:

```powershell
npm run typecheck
npm test
npm run build
```

Run the build while the development server is stopped. To test the built app, run `npm start`, open `http://localhost:3000`, and sign in. Stop with `Ctrl+C`.

Node 24 may print an experimental SQLite warning. This is an informational Node message, not an application error.

## Presentation walkthrough

1. **Overview:** introduce the four main tasks. Open **My profile** to show the fictional background.
2. **Analyze job description:** choose **Use sample description**, then **Analyze description**. Show the required and optional groups. Hover, focus, or click a term to reveal its prepared explanation.
3. Choose **Save and calculate compatibility** in the floating action bar. This saves the reviewed analysis and starts scoring for that role. **Save analysis only** lets you save without scoring. Explain the matching skills, gaps, weighted points, and hiring disclaimer.
4. On the score result, choose **Generate interview preparation**. The same role is carried forward and its materials are generated without pasting or selecting the description again. Expand a question to show its suggested answer, then show the quick reference notes.
5. The three step role bar lets you revisit **Analysis**, **Compatibility score**, or **Interview preparation** for the same role. It navigates without automatically repeating generation. You can also generate interview preparation directly from a saved analysis. **Optimize experience** remains a separate profile based task: show both versions, edit if desired, confirm review, and accept.
6. **My history:** reopen an analysis and a score. Demonstrate deletion on a spare record, explaining that deleting an analysis also deletes its related scores.
7. Refresh or restart and show that saved work remains.

In live mode, generated wording and percentages can vary. Explain the factors rather than promising a particular percentage.

## Rehearse without a key

Stop the server and run:

```powershell
npm run demo:sample
```

Use **Use fictional sample profile** and save it, then use **Use sample description**. This is a fixed rehearsal with a visible banner, not evidence of live AI quality. Its expected compatibility score is **78%**. Other input is intentionally rejected. Sample records are labelled so they remain distinguishable in live mode.

To return to live mode, stop with `Ctrl+C` and run `npm run dev`.

## If something goes wrong

Open the same VS Code terminal where you ran `npm run dev`. Requests print `[SkillBridge]` entries showing when they start, finish, or fail. Details are also saved in `logs/ai.log`, which appears after the first live request. Open that file in VS Code, or open a second terminal in the application folder and watch it with:

```powershell
Get-Content .\logs\ai.log -Tail 20 -Wait
```

Press `Ctrl+C` in that second terminal to stop watching. The log includes time, operation, model, elapsed milliseconds, and Google's error details when available. It excludes the API key, job description, and profile request data. Browser Developer Tools do not show the server's underlying Gemini error; use the application terminal or this file. Earlier failures cannot be reconstructed automatically.

* **Missing key:** add it to `.env.local`, save, and restart.
* **Quota or timeout:** wait and retry. Saved records remain available. Use the explicitly labelled rehearsal mode if needed.
* **Invalid input:** follow the message. Job descriptions must be nonempty and at most 1,500 words.
* **Profile incomplete:** complete the listed fields, save, and continue. Coursework and projects are valid experience; state explicitly if you have none yet.
* **Save failure:** keep the displayed result open and choose the save retry. This does not need another AI call.
* **Port already in use:** stop the earlier server. Use the local URL printed in the terminal if Next.js chooses another port.
