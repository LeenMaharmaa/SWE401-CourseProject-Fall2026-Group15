# SkillBridge AI

SkillBridge helps job seekers understand a job description, compare their background with a role, improve experience wording, and prepare for interviews.

## Team

SWE 401 Software Engineering, Abu Dhabi University, Fall 2026.

| Member | Student ID |
| --- | --- |
| Aisha Omar Qassem | 1099168 |
| Leen Mohammed Maharma | 1098395 |
| Zeinab Ahmad Dardab | 1093356 |

The team developed the project collaboratively using a shared workstation.

## Problem

Job seekers can struggle to understand technical requirements and explain how their skills and experience relate to a job. SkillBridge brings these preparation tasks into one application.

## Key features

* Analyze job descriptions into required and optional skills, with terminology explanations.
* Calculate an explained compatibility score using the saved profile.
* Improve experience wording, then edit and confirm the suggestion.
* Generate interview questions, suggested answers, and preparation notes.
* Save profiles and preparation results, reopen history, and delete records.

## Technologies

Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, SQLite, Zod, and the Google GenAI SDK.

## Prerequisites

* Node.js 24 or later and npm.
* A Gemini API key and internet access for generation.
* A modern desktop browser.

## Installation

Open a terminal in the `implementation` folder:

```powershell
npm install
```

## Configuration

Create the local configuration file once:

```powershell
Copy-Item .env.example .env.local
```

Get a key from [Google AI Studio](https://aistudio.google.com/apikey), then edit `.env.local`:

```dotenv
GEMINI_API_KEY=your_actual_key
GEMINI_MODEL=gemini-3.5-flash-lite
```

Keep the key private. If the file already exists, edit it instead of overwriting it.

## Run locally

From the `implementation` folder:

```powershell
npm run dev
```

Open [localhost:3000](http://localhost:3000), create an account, and complete the profile. Stop with `Ctrl+C`. SQLite is created automatically; no separate database server is needed.

## Test and build

```powershell
npm run typecheck
npm test
npm run build
```

Stop the development server before building. To run the production build, use `npm start`.

## Methodology

The project follows system prototyping under RAD, connecting requirements, UML design, implementation, and focused testing. The detailed analysis and design are covered in the course report.

For the presentation steps and troubleshooting, see the [demo guide](docs/demo-guide.md).
