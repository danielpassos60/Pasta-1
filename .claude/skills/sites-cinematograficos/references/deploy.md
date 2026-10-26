# Publicar: o fluxo HostGator via cPanel

There is no hosting connector here. HostGator shared hosting publishes through cPanel, so the final upload is a manual step the user performs. Everything around it is yours: the zip, the patched tags, the verification, the receipts, and the walkthrough.

Say that plainly the first time it comes up, in one line, without apologizing for it. It is a 60-second job and hiding it would just make the moment confusing when it arrives.

## Step 0: Hosting, if they do not have it yet

The signup link, if one is filled into `config.md`, goes here and nowhere earlier. Remind them that most HostGator plans include a free domain for the first year, so this is the moment to claim it. Any shared plan with cPanel serves this site: it is static files, so there is nothing to be picky about.

Then stop and wait. Buying hosting and registering a domain takes them away for a while, and their next message may simply be that it is done. Do not fill the wait with previews of the steps ahead.

## Step 1: Settle the address, and pick the destination folder

Ask two things, with clickable options:

1. Which domain does the site go on?
2. Is that the main domain of the HostGator account, or an additional one they added?

That second answer decides where the files go, and getting it wrong publishes the site over something else:

- **Main domain** → `public_html`
- **Addon domain** → `public_html/nome-do-dominio` (cPanel creates this folder when the addon domain is added; its exact name shows in Domínios)
- **Subdomain** → the folder shown in cPanel next to that subdomain

If they are not sure, have them open cPanel → Domínios and read what is listed there. Never guess.

A brand-new domain can take a while to start pointing at the hosting. If it was registered minutes ago, say so honestly: the site may need a few hours before the address answers, and that is DNS propagating, not a broken build.

## Step 2: Patch the og tags

`og:image` and `og:url` need absolute URLs. Find the `<!-- DEPLOY STEP -->` comment left during the build and patch both with the chosen live URL. Do this BEFORE zipping, or the shipped page carries dead preview tags.

Patch with the editor tool, never a shell one-liner. A scripted find-and-replace can read the UTF-8 file with the wrong default encoding and mangle every accented character on the page, which on a Portuguese site means every other word. The recovery, if it happens anyway, is in `troubleshooting.md`.

## Step 3: Zip the CONTENTS, not the folder

The zip's top level must be `index.html` itself with `assets/` beside it. Zipping the project folder instead nests everything one level down, and after extraction the live site shows a directory listing or a 404.

Exclude the review folder, raw videos, the skill files, and anything else that should not ship. If the raws were kept outside the deploy folder as instructed, the zip is just the folder's contents as-is.

Windows PowerShell:

```
Compress-Archive -Path .\index.html, .\assets -DestinationPath ..\site.zip -Force
```

Mac and Linux:

```
cd deploy-folder && zip -r ../site.zip index.html assets -x "*.DS_Store"
```

Keep the zip itself out of the deploy folder.

**Check the size before handing it over.** cPanel's file manager has an upload ceiling on shared plans. Run `ls -lh ../site.zip` and confirm it is comfortably small. If it is over about 15 MB, go back to Phase 7 and bring the video down rather than sending the user into a failed upload.

## Step 4: The handoff, written for someone who has never opened cPanel

Give these steps in Portuguese, numbered, with the exact button names they will see. Do not paraphrase the interface. Then wait for their "pronto".

1. Entra no painel da HostGator e abre o **cPanel**.
2. Procura por **Gerenciador de Arquivos** e clica.
3. Abre a pasta **`<a pasta do Passo 1>`**.
4. Se já tiver um arquivo `index.html` ou uma pasta `assets` aí dentro de um site antigo, apaga antes. (Só pergunta isso se a pasta não estiver vazia.)
5. Clica em **Carregar** (ou **Upload**, dependendo da versão) lá em cima.
6. Arrasta o `site.zip` pra tela e espera a barra chegar em 100%.
7. Clica em **Voltar** pra pasta.
8. Clica com o botão direito no `site.zip` e escolhe **Extrair** (ou **Extract**). Confirma.
9. Apaga o `site.zip`, que já cumpriu o papel dele.
10. Abre o site no navegador.

**The two mistakes that happen here,** worth warning about in advance in one short line each: extracting into the wrong folder, and forgetting to hit Extrair after the upload (which leaves the zip sitting there and the address showing nothing).

## Step 5: Verify the live site yourself, before telling them it is done

Their "pronto" is the signal to verify, not the verification.

- The page loads over HTTPS with a 200.
- The video URL itself serves. Fetch it directly.
- The page is genuinely UTF-8: pull it down and confirm the accents render, not mojibake. This is the number one silent failure on a Portuguese site.
- The browser console is clean on the live URL.
- Scrub the hero on the live site: the Blob fetch should make seeking work even without Range support, but confirm it.

```
curl -sI https://o-dominio/ | head -n 12
curl -sI https://o-dominio/assets/hero-scrub.mp4 | head -n 8
curl -s https://o-dominio/ | grep -o 'lang="pt-BR"'
curl -s https://o-dominio/ | head -c 400
```

**HTTPS needs a settling window on a fresh domain.** HostGator issues the free certificate automatically, but on a domain that has never served a site it can take from a few minutes to a few hours. If the browser shows a security warning right after the first publish, that is the certificate still being issued, not a broken site. Tell the user plainly, and if it has not resolved after a couple of hours, point them at cPanel → **SSL/TLS Status**, where they can run **Executar AutoSSL** themselves.

If the address shows a directory listing, the zip was extracted with its folder nested one level down. Have them open the folder that appeared, select everything inside it, and use **Mover** to bring it up one level. That is the most common publish failure and it is a 20-second fix.

## Step 6: The speed receipts (measure, then present)

Right after live verification, measure the live site and record the numbers. These are the proof the site is fast, and the user will need them to answer the one objection every cinematic site gets: "bonito, mas deve ser pesado."

- **Total page weight excluding the video.** A healthy build lands in the tens of KB.
- **Page load time.** A healthy build loads in well under a second.
- **The video's size and its arrival time behind the loading ring.** A single shot arrives in a few seconds on an ordinary connection, all of it while the page is already fully usable.

```
curl -s -o /dev/null -w "TTFB %{time_starttransfer}s, total %{time_total}s, %{size_download} bytes\n" https://o-dominio/
curl -s -o /dev/null -w "video: total %{time_total}s, %{size_download} bytes\n" https://o-dominio/assets/hero-scrub.mp4
```

On Windows call `curl.exe`, and `-o NUL` works in place of `-o /dev/null`. Or open the live URL through the browser tool and read `performance.getEntriesByType('navigation')[0].loadEventEnd` for load time and `performance.getEntriesByType('resource')` for each file's `transferSize`.

**Real measurements only. Never present an estimate as a receipt.**

Present the numbers together with the structural argument: this site is plain static files, no framework, no build step, no server code, so there is no backend to be slow. The video streams in behind a poster and an honest progress ring, and small screens never download the heavy version at all. Record the numbers so the user can quote them to their own client.

## Step 7: The user's real-device test

Hand them the live link and have them test on desktop AND their phone, on mobile data, not on wifi and not on localhost. Ask them to check the scroll at the top and the bottom of the hero specifically, in Chrome, where choppiness shows first. Their eyes and their hardware catch what audits cannot.

## Step 8: Iterating

Every later change is the same short loop: you edit the files, re-zip, and they repeat steps 4 through 5 of the handoff (upload, extract, delete the zip). Batch a whole round of revisions into one zip instead of sending them upstairs for every tweak.

After each publish, re-verify the live page. A stale cache can show the old version, so check a string you know changed, or have them hard-refresh with Ctrl+Shift+R (Cmd+Shift+R on Mac).

## Fallback: FTP, when the file manager will not cooperate

Not the default and not offered unprompted. Reach for it only when the cPanel upload keeps failing, usually on a zip that sits near the size ceiling. The user creates an FTP account in cPanel → **Contas de FTP** scoped to the site's folder only, and pastes the host, user, and password. Then:

```
lftp -u "USUARIO,SENHA" ftp://HOST -e "mirror -R --delete ./deploy-folder /public_html; bye"
```

Say the security tradeoff out loud before asking for anything: those credentials land in the chat. A folder-scoped FTP account that they delete afterward keeps the blast radius small. If they are not comfortable with that, the answer is a smaller zip, not a workaround.
