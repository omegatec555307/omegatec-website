# Omegatec Website & Domain Setup

[![Deploy Website to GitHub Pages](https://github.com/omegatec555307/omegatec-website/actions/workflows/deploy.yml/badge.svg)](https://github.com/omegatec555307/omegatec-website/actions/workflows/deploy.yml)

The official web frontend for **Omegatec Computers Sdn. Bhd.** is hosted on **GitHub Pages**, continuously validated and deployed via **GitHub Actions CI/CD**, routed through **Cloudflare DNS**, with enterprise email powered by **Zoho Mail**.

- **Website URL:** [https://omegatec.com.my](https://omegatec.com.my)
- **WWW URL:** [https://www.omegatec.com.my](https://www.omegatec.com.my)
- **GitHub Repository:** [https://github.com/omegatec555307/omegatec-website](https://github.com/omegatec555307/omegatec-website)
- **GitHub Actions CI/CD:** [https://github.com/omegatec555307/omegatec-website/actions](https://github.com/omegatec555307/omegatec-website/actions)
- **Router Subdomain:** `router.omegatec.com.my` -> `4f4304547d22.sn.mynetname.net` (MikroTik DDNS)

---

## Directory Overview

| File / Folder | Purpose |
|---|---|
| `dist/` | Clean production frontend build (HTML, logos, CNAME, robots, sitemap) |
| `dist/.github/workflows/deploy.yml` | GitHub Actions CI/CD workflow definition (validation & automated deployment) |
| `deploy_to_github.ps1` | 1-Click deployment script: pushes `dist/` changes to GitHub & triggers CI/CD |
| `update_dns_github_pages.ps1` | Cloudflare DNS deployment script for GitHub Pages + Zoho + MikroTik router |
| `verify_dns.ps1` | Automated health check script for DNS, GitHub Pages reachability & Zoho MX |
| `omegatec.com.my.zone.txt` | BIND zone file backup ready for direct import into Cloudflare |
| `configure_github.ps1` | Helper script to configure or switch GitHub credentials |
| `.github_config.json` | Local configuration (Owner, Repo, Token) - protected by `.gitignore` |

---

## CI/CD Pipeline Workflow

The repository uses GitHub Actions (`.github/workflows/deploy.yml`):

1. **Trigger:** Fires automatically on any `push` to `main` (or via manual `workflow_dispatch` button).
2. **Job 1 (`validate`):** Verifies that essential assets exist (`index.html`, `CNAME`, `omega-logo.png`, `.nojekyll`) to prevent deploying broken builds.
3. **Job 2 (`deploy`):** Packages artifacts and deploys them to GitHub Pages Edge CDN using official GitHub Actions (`actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`).

---

## Updating the Website in the Future

Whenever you edit or add files in `dist/` (e.g. updating phone numbers, adding services, or modifying logos):

1. Edit the files inside the `dist/` folder.
2. Run the deployment script:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\deploy_to_github.ps1
   ```
3. GitHub Actions will automatically validate the files, execute the deployment pipeline, and update the live website within seconds.

---

## DNS Architecture

Managed via Cloudflare (`alec.ns.cloudflare.com`, `kira.ns.cloudflare.com`):

| Type | Name | Target / Content | Proxy Status | Purpose |
|---|---|---|---|---|
| `A` | `@` | `185.199.108.153` | DNS Only (Gray) | GitHub Pages CDN (IPv4) |
| `A` | `@` | `185.199.109.153` | DNS Only (Gray) | GitHub Pages CDN (IPv4) |
| `A` | `@` | `185.199.110.153` | DNS Only (Gray) | GitHub Pages CDN (IPv4) |
| `A` | `@` | `185.199.111.153` | DNS Only (Gray) | GitHub Pages CDN (IPv4) |
| `AAAA` | `@` | `2606:50c0:8000::153` | DNS Only (Gray) | GitHub Pages CDN (IPv6) |
| `AAAA` | `@` | `2606:50c0:8001::153` | DNS Only (Gray) | GitHub Pages CDN (IPv6) |
| `AAAA` | `@` | `2606:50c0:8002::153` | DNS Only (Gray) | GitHub Pages CDN (IPv6) |
| `AAAA` | `@` | `2606:50c0:8003::153` | DNS Only (Gray) | GitHub Pages CDN (IPv6) |
| `CNAME` | `www` | `omegatec555307.github.io` | DNS Only (Gray) | GitHub Pages WWW |
| `CNAME` | `router` | `4f4304547d22.sn.mynetname.net` | DNS Only (Gray) | MikroTik Router DDNS |
| `MX` | `@` | `mx.zoho.com` (10) | N/A | Zoho Mail |
| `MX` | `@` | `mx2.zoho.com` (20) | N/A | Zoho Mail |
| `MX` | `@` | `mx3.zoho.com` (50) | N/A | Zoho Mail |
| `TXT` | `@` | `v=spf1 include:zohomail.com ~all` | N/A | Zoho SPF Record |
| `TXT` | `@` | `zoho-verification=...` | N/A | Zoho Domain Verification |

---

## Health Verification

To verify that all services (GitHub Pages, Cloudflare DNS, and Zoho Mail) are operational, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\verify_dns.ps1
```
