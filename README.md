# Miss Marble

### Setup

```bash
asdf plugin add task
asdf plugin add nodejs
asdf plugin add pnpm

asdf install

task dep
task secret
task db:reset
```

### Run

```bash
task dev
```

### Github secrets

```sh
gpg -a --export-secret-keys deploy-missmarble | cat -e | sed 's/\\$/\\\n/g' | tr -d '\n' > BLACKBOX_PRIVKEY
gpg -a --export deploy-missmarble | cat -e | sed 's/\\$/\\\n/g' | tr -d '\n' > BLACKBOX_PUBKEY
```