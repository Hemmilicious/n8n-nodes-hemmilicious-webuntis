# Upgrade existing repository from 0.1.0 to this 0.2.0 candidate

Target repository:

`/Users/michaelhemmersbach/Desktop/Untis`

## Recommended procedure

1. Commit or back up the current repository.
2. Copy the contents of this package over the existing repository.
3. Keep the existing `.git/` directory.
4. Keep the existing `package-lock.json`.
5. Run:

```bash
npm install
npm run lint
npm test
rm -rf dist tsconfig.tsbuildinfo
npm run build
npm audit --omit=dev
npm pack --dry-run
```

6. Test with a real WebUntis credential before publishing.
7. Commit only after those checks pass.

Do not publish this candidate blindly. WebUntis permissions and response shapes differ by school/module/account.
