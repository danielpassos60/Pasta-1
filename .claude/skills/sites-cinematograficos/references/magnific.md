# Magnific: the tool map and the money talk

Every image and every video in this pipeline comes from Magnific. This file holds the exact call shapes so no build has to guess them. Prompts sent to Magnific are written in English (see the language contract in `SKILL.md`); everything the user reads stays Portuguese.

## The tools, by job

| Job | Tool | Notes |
|---|---|---|
| Check plan and credits | `account_balance` | Returns `plan.tier` and `credits.available`. Call it in the Phase 1 scan and again before every spend. |
| Price a call before spending | `simulate_cost` | Free, read-only. `{tool: "images_generate", arguments: {...the exact args you plan...}}`. Pass `arguments: {}` to get a tool's required args back. |
| List image models | `images_models_list` | Gives slugs, `resolutions`, and `qualities`. Needed before naming a resolution. |
| Generate an image | `images_generate` | Start frames and supporting stills. |
| List video models | `video_models_list` | Gives slugs, durations, resolutions, aspect ratios. Copy slugs verbatim. |
| Draft the video brief | `video_plan` | **Required before `video_generate`.** Returns a brief, open questions, a recommended model slug, and a prompt draft. |
| Generate a video | `video_generate` | Image-to-video off the approved start frame. |
| Wait for a render | `creations_wait` | Long-polls up to 25 seconds. Loop it rather than hammering status calls. |
| Get the file URL | `creations_get` | Returns `url` (full res) and `previewUrl`. `url` is what you download. |
| Import a local file | `creations_request_upload` → PUT → `creations_finalize_upload` | The upload bridge. See below. |
| Import a public image URL | `creations_upload_image` | One step, when the file is already on the open web. |
| Put a logo onto a shot | `images_retouch` | Needs a mask creation the same pixel size, white where the change goes. |
| Cut a subject out | `images_remove_background` | Transparent PNG. |

**Not used in this pipeline, on purpose:** `video_concatenate`. Chained segments are joined with the single-encode ffmpeg concat in `ffmpeg-recipes.md`, because the scrub hero needs a specific keyframe interval that a service-side concat does not produce. Joining first and re-encoding after adds a generation loss for nothing.

## The starting frame

```
images_generate({
  prompt: "<the English start-frame prompt from prompt-laws.md>",
  aspectRatio: "16:9",
  mode: "auto",              // or a slug from images_models_list if the user named a model
  resolution: "<from images_models_list.resolutions for the chosen model>",
  count: 1
})
```

Preflight it first with `simulate_cost` and tell the user the credits before it runs.

**Variants come from `count`, never from repeated calls.** Three options of one prompt is one call with `count: 3`. Three separate calls cost the same credits and take three times as long.

**The output is opaque.** There is no alpha channel. If a supporting still needs a transparent background, chain `images_remove_background` after.

## The video

Two calls, in this order, always.

```
video_plan({
  prompt: "<the raw concept, verbatim>",
  aspectRatioHint: "16:9",
  durationHint: 6,
  styleHint: "cinematic"
})
```

Read what it returns: the recommended slug and the open questions. Then write your OWN prompt from the laws in `prompt-laws.md` and generate. The plan resolves the model and surfaces problems; it does not replace the designed prompt.

```
video_generate({
  video: {
    clips: [{
      slug: "<slug copied verbatim from video_models_list>",
      prompt: "<the English motion prompt from prompt-laws.md>",
      duration: 6,
      resolution: "1080p",
      aspectRatio: "16:9",
      keyframes: {
        start: { type: "image", url: "<creation identifier of the approved start frame>" }
      }
    }]
  }
})
```

**The identifier trap, and it will bite.** `keyframes.start.url` takes an asset URL or a creation **`identifier`**. It does NOT take `webUrl`. Passing the browser-facing `webUrl` from a creation object fails or silently produces the wrong thing. Use `identifier` every time.

**`duration` is required whenever `slug` is set.** Omitting it with an explicit slug is rejected.

**Start frames and references are mutually exclusive.** A clip with `keyframes.start` cannot also carry `references[]`. Pick one. For this pipeline it is always the start frame.

**Audio: do not fight it.** Some models add sound and some do not. The page mutes the video and the Phase 7 re-encode strips the track with `-an`, so a generated audio track costs nothing but bytes. Only reach for `withSoundEffects: false` or `noMusic` when `video_models_list` says the chosen model supports them.

Then poll and fetch:

```
creations_wait({ identifiers: ["<id>"], timeoutSeconds: 25 })   // loop until terminal
creations_get({ identifier: "<id>" })                            // read .url
```

Download `.url` to the local review folder with `curl -L -o review/hero-bruto.mp4 "<url>"`, then inspect it per Phase 6.

## The upload bridge (local file into Magnific)

Needed twice: when the user supplies a real product photo to use as a start frame, and on every chained segment after the first.

1. `creations_request_upload({ mimeType: "image/png" })` returns a presigned PUT URL and a `path`.
2. PUT the raw bytes to that URL from the shell: `curl -X PUT --upload-file frame-final.png "<presigned-url>"`. No auth header, no form encoding, raw bytes.
3. `creations_finalize_upload({ path: "<path from step 1>", visible: false })` returns the creation. Its `identifier` is what goes into `keyframes.start.url` on the next segment.

`visible: false` keeps working frames out of the user's Magnific library. Use it for chaining frames; leave it default for anything the user might want to keep.

Size ceilings: raster images 25 MB, SVG 10 MB, video 200 MB.

Chaining frames must be full-quality PNGs extracted with the exact ffmpeg command in `ffmpeg-recipes.md`. Review-grade jpgs carry compression artifacts that the next generation amplifies.

## Cost preflighting, and how to talk about money

**Never quote a credit number you have not preflighted in this session.** Magnific's pricing differs by model and changes over time. A number written into a skill file goes stale and turns into a lie told confidently. `simulate_cost` is free and takes a second, so there is no excuse.

The order, every time:

1. `account_balance` for what they have.
2. `simulate_cost` on the exact call you plan.
3. Tell them the number in Portuguese, plainly, before it runs.

**The honest-costs talk (give it during setup, repeat before spending).**

- Cada imagem custa alguns créditos. Cada vídeo custa bem mais, e o valor muda conforme o modelo.
- Dá pra saber o preço exato de qualquer geração antes de gastar, e isso é de graça. Eu sempre checo antes.
- O plano e o saldo atual saem direto da sua conta, então o número que eu te passo é o real, não um chute.
- A hospedagem é uma conta separada e só entra lá no final, quando o site estiver pronto pra ir pro ar.

**The model choice is the user's, made with real numbers.** Video model prices spread widely for the same shot. Preflight the same planned video across the top two or three from `video_models_list` and present the real credits for each, one line on what the price buys, and the balance remaining. Recommend one. A cheaper model can turn a small balance from one shot into several, which changes the video gate from frightening into a normal creative decision. Their money, their choice, made before anything is spent.

## Rendering results in chat

On clients with the Magnific UI widgets, `creations_show({identifiers: [...]})` renders the generated media inline and is the right way to show the user an image or a video. In Claude Code that widget may not be available. When it is not, download the file with `curl` and show the user the local file path, or open it for them. Never stop at a bare URL and call it shown: the video gate means the user actually watched it.
