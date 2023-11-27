<a href="https://dub.co">
  <img alt="Dub – an open-source link management tool for modern marketing teams to create, share, and track short links." src="https://github.com/steven-tey/dub/assets/28986134/8f70a87f-4f13-426a-9785-a47f77433edd">
  <h1 align="center">Dub</h1>
</a>

<p align="center">
  An open-source link management tool for modern marketing teams to create, share, and track short links.
</p>

<p align="center">
  <a href="https://twitter.com/dubdotco">
    <img src="https://img.shields.io/twitter/follow/dubdotco?style=flat&label=%40dubdotco&logo=twitter&color=0bf&logoColor=fff" alt="Twitter" />
  </a>
  <a href="https://news.ycombinator.com/item?id=32939407"><img src="https://img.shields.io/badge/Hacker%20News-255-%23FF6600" alt="Hacker News"></a>
  <a href="https://github.com/steven-tey/dub/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/steven-tey/dub?label=license&logo=github&color=f80&logoColor=fff" alt="License" />
  </a>
</p>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#local-development"><strong>Local Development</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a>
</p>
<br/>

## Introduction

Dub is an open-source link management tool for modern marketing teams to create, share, and track short links.

## Features

- [Advanced Analytics](https://dub.co/features/analytics)
- [Branded Links](https://dub.co/features/branded-links)
- [QR Codes](https://dub.co/features/qr-codes)
- [Personalization](https://dub.co/features/personalization)
- [Team Collaboration](https://dub.co/features/collaboration)

## Local Development

To develop Dub locally, you will need to clone this repository and set up all the env vars outlined in the [`.env.example` file](https://github.com/steven-tey/dub/blob/main/apps/web/.env.example).

Once that's done, you can use the following commands to run the app locally:

```
pnpm i
pnpm build
pnpm dev
```

We're planning to add a proper, well-documented self-hosting guide for Dub soon – stay tuned!

## Tech Stack

- [Next.js](https://nextjs.org/) – framework
- [Typescript](https://www.typescriptlang.org/) – language
- [Tailwind](https://tailwindcss.com/) – CSS
- [Upstash](https://upstash.com/) – redis
- [Tinybird](https://tinybird.com/) – analytics
- [PlanetScale](https://planetscale.com/) – database
- [NextAuth.js](https://next-auth.js.org/) – auth
- [BoxyHQ](https://boxyhq.com/enterprise-sso) – SSO/SAML
- [Turborepo](https://turbo.build/repo) – monorepo
- [Stripe](https://stripe.com/) – payments
- [Vercel](https://vercel.com/) – deployments

## Contributing

We love our contributors! Here's how you can contribute:

- [Open an issue](https://github.com/steven-tey/dub/issues) if you believe you've encountered a bug.
- Make a [pull request](https://github.com/steven-tey/dub/pull) to add new features/make quality-of-life improvements/fix bugs.

<a href="https://github.com/steven-tey/dub/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=steven-tey/dub" />
</a>

## Repo Activity

![Dub.co repo activity – generated by Axiom](https://repobeats.axiom.co/api/embed/c90805656bae44a62c62b38222270d5f697fcfb1.svg "Repobeats analytics image")

## License

Inspired by [Plausible](https://plausible.io/), Dub is open-source under the GNU Affero General Public License Version 3 (AGPLv3) or any later version. You can [find it here](https://github.com/steven-tey/dub/blob/main/LICENSE.md).
