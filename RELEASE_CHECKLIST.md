# Release checklist

## Before commit

- [ ] `npm install` completed and `package-lock.json` updated
- [ ] `npm run lint` has 0 errors
- [ ] `npm test` passes
- [ ] clean build succeeds
- [ ] `npm audit --omit=dev` reviewed
- [ ] `npm pack --dry-run` contains only intended files
- [ ] no real school name, username, QR URL, Secret Key, token, JWT, or session ID in source/build/tests
- [ ] connection test works with a real credential
- [ ] user info works
- [ ] own timetable works
- [ ] at least one master-data operation works
- [ ] exams/homework/absences tested only where account permissions allow
- [ ] trigger manually tested, then activated and verified with polling

## GitHub/npm

- [ ] package repository URL points to the public GitHub repo
- [ ] GitHub Actions `publish.yml` is committed
- [ ] npm Trusted Publisher points to the exact repo and `publish.yml`
- [ ] no `NPM_TOKEN` GitHub secret remains when OIDC is used
- [ ] package publishing access is set to the restrictive 2FA option
- [ ] version bumped appropriately
- [ ] release tag matches the workflow tag pattern

## After release

- [ ] `npm view n8n-nodes-hemmilicious-webuntis version`
- [ ] update package in n8n Community Nodes
- [ ] re-test credential
- [ ] re-test core actions
- [ ] verify trigger workflow
