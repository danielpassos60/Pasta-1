# Config

The few things that change between one distribution of this skill and another. Read this before Phase 1 and use whatever is filled in. **Anything still showing a `{{PLACEHOLDER}}` is not filled in: skip it silently and never show a placeholder to the user.**

## Signup links

**Magnific** (shared in Phase 1 when the user has no account):

```
{{LINK_MAGNIFIC}}
```

**HostGator** (shared in Phase 10, only when the user does not already have hosting):

```
{{LINK_HOSTGATOR}}
```

When a link here is an affiliate or partner link, say so plainly in one line beside it: it supports the creator at no extra cost to the user. Never hide it, and never oversell it. When a link is a plain link, say nothing about it.

## Author

```
{{NOME_DO_CANAL}}
```

Used only if the user asks where the skill came from. Never volunteered, never worked into the site, and never mentioned during the build.

## Defaults that can be tuned

| Setting | Value | Why it is here |
|---|---|---|
| Default tier | Tier 1 | A single continuous shot. Safe on a limited plan and on a first build. |
| Hero video budget | under 8 MB | The cPanel upload ceiling on shared hosting. See Phase 7. |
| Total zip budget | under 15 MB | Same reason. |
| Default hero resolution | 1080p | 720p is an acceptable fallback on a scrubbed video, since it is never played at speed. |
| Default CTA | WhatsApp (`wa.me`) | What most Brazilian small businesses actually want. Confirm with the user, never assume. |

Changing a number here is fine. Changing the pipeline, the phase order, or the language contract is not: those live in `SKILL.md` and they hold every run.
