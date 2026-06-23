![Postman logo](https://assets.getpostman.com/common-share/postman-github-logo.png 'Postman logo')

# Postman Zendesk Support Center

The Zendesk Guide theme that powers the [Postman Support Center](https://support.postman.com).
Internally referred to as the **post-zen** theme, it targets the Zendesk Guide Themes (v2)
API and is maintained by the Postman Product Engineering team.

The theme is composed of Handlebars templates, a single stylesheet, a JavaScript file
(primarily for interactions), and a set of static assets.

## Table of contents

- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local development](#local-development)
- [Code style](#code-style)
- [Deployment](#deployment)
- [Security](#security)
- [License](#license)

## Project structure

When a theme is imported into Zendesk Guide, the platform looks for the following
top-level files and folders:

| Path | Purpose |
| --- | --- |
| [`templates/`](templates/) | Handlebars markup for each page type (home, article, section, search, etc.). |
| [`style.css`](style.css) | All theme styles. |
| [`script.js`](script.js) | Main theme script, used mainly for interactions. |
| [`assets/`](assets/) | Static assets (images, fonts, scripts) served from the Zendesk CDN (`theme.zdassets.com`). |
| [`manifest.json`](manifest.json) | Theme metadata and the settings exposed in the Zendesk theming UI. |
| [`settings/`](settings/) | Default files backing `file`-type variables declared in `manifest.json`. |
| [`translations/`](translations/) | Localized strings used by the templates. |

### Templates

Zendesk Guide renders markup with [Handlebars](https://handlebarsjs.com/). Each page type
has its own template in [`templates/`](templates/).

### Styles

All styles live in [`style.css`](style.css) at the repository root. Templates and CSS can
reference theme settings via Handlebars expressions (for example, `{{settings.brand_color}}`),
which means the theme only renders correctly when served through Zendesk or ZAT — opening
the files directly in a browser will not work.

### Assets

Add images, fonts, and other static files to [`assets/`](assets/) and reference them from
your CSS and templates. Assets are uploaded to the Zendesk CDN. See the Zendesk
documentation on [theme assets](https://support.zendesk.com/hc/en-us/articles/115012399428)
for details.

### Manifest

[`manifest.json`](manifest.json) holds theme metadata and defines the settings that can be
edited from the Zendesk theming UI. See the Zendesk docs on
[theme settings and the manifest](https://support.zendesk.com/hc/en-us/articles/115012547687).

### Settings

Any variable declared with `"type": "file"` in `manifest.json` must have a matching default
file in [`settings/`](settings/), named after the variable's `identifier`. For example, a
variable for a section background image:

```json
{
  "settings": [
    {
      "label": "Images",
      "variables": [
        {
          "identifier": "background_image",
          "type": "file",
          "description": "background image description",
          "label": "background image label"
        }
      ]
    }
  ]
}
```

Zendesk will use the file named `background_image` in [`settings/`](settings/) as the
default, and editors can upload their own from the settings panel.

## Prerequisites

- **Node.js** — the version pinned in [`.nvmrc`](.nvmrc) / the `engines` field of
  [`package.json`](package.json). With [nvm](https://github.com/nvm-sh/nvm) installed, run
  `nvm use`. Node is required for the formatting scripts; it is not required for the preview
  itself.
- **Ruby** — required by ZAT (see below). On macOS, the system Ruby may be too old; install a
  current version with a version manager (e.g. [Homebrew](https://brew.sh): `brew install ruby`)
  and ensure its `gem` binaries are on your `PATH`.
- **Zendesk App Tools (ZAT)** — the CLI used to preview the theme:

  ```bash
  gem install zendesk_apps_tools
  ```

  See the [ZAT installation guide](https://developer.zendesk.com/documentation/apps/zendesk-app-tools-zat/installing-and-using-zat/)
  for platform-specific instructions.
- **A Zendesk account** with theme/admin access and a Zendesk **API token**.

## Local development

Install dependencies and start a live preview:

```bash
npm install
npm run dev          # runs: zat theme preview
```

`zat theme preview` uploads your local files to a temporary preview slot and serves changes
from a local server (default port `4567`) with live reload. To view the theme, open the
preview URL printed in the terminal:

- **Start preview:** `https://<your-subdomain>/hc/admin/local_preview/start`
- **Stop preview:** `https://<your-subdomain>/hc/admin/local_preview/stop`

While preview mode is active, browse your Help Center normally and it will render your local
[`templates/`](templates/), [`style.css`](style.css), and [`script.js`](script.js). Saving a
file refreshes the preview automatically.

### Authentication

ZAT reads credentials from a `.zat` file in the repository root (or prompts for them on
first run). Create the file with **your own** Zendesk subdomain, email, and API token:

```json
{
  "subdomain": "https://your-subdomain.zendesk.com",
  "username": "you@example.com/token",
  "password": "<your-zendesk-api-token>"
}
```

> [!IMPORTANT]
> The `.zat` file contains a secret and is listed in [`.gitignore`](.gitignore). **Never
> commit it or share its contents.** Use a Zendesk API token (not your account password),
> and revoke/rotate the token immediately if it is ever exposed.

## Code style

Formatting is enforced with [Prettier](https://prettier.io/) (config in
[`.prettierrc.json`](.prettierrc.json)):

```bash
npm run prettier:verify   # check formatting
npm run prettier:write    # apply formatting
```

Please run `prettier:verify` before opening a pull request.

## Deployment

Production deploys are handled by the
[Zendesk GitHub integration](https://support.zendesk.com/hc/en-us/articles/4408832476698-Setting-up-the-GitHub-integration-with-your-help-center-theme),
which syncs the published branch to the live theme. Avoid editing the live theme directly in
the Zendesk UI, as those changes are not tracked in this repository and can be overwritten.

## Security

This is a public repository. Please help keep it safe:

- **Never commit secrets** — API tokens, credentials, or the `.zat` file. Review your diff
  before every commit.
- **Do not include customer data** or internal-only information in templates, assets, or
  commit messages.
- **Report vulnerabilities privately.** Do not open a public GitHub issue for security
  concerns. Instead, disclose them through Postman's responsible disclosure process described
  at the [Postman Trust Center](https://www.postman.com/trust/).

## License

[Apache License 2.0](LICENSE)
