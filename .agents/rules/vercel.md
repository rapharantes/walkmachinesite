# Configurações de Deploy Vercel

- **Usuário / Conta Vercel**: `rapha.arantes@gmail.com`
- **Conta Proibida**: Não utilizar `comercialtagdigital@gmail.com`.
- **Projeto na Vercel**: `walkmachine-site`
- **URL do Projeto**: `https://vercel.com/raphael-arantes-projects/walkmachine-site`
- **URL de Deployments**: `https://vercel.com/raphael-arantes-projects/walkmachine-site/deployments`
- **Scope / Time**: `raphael-arantes-projects`
- **Deploy Root**: `Site/` (com `outputDirectory: "dist"`) ou `dist/`

## 🔄 Fluxo de Deploy Obrigatório
- Em cada tarefa ou alteração finalizada, executar imediatamente:
  ```bash
  git add -A
  git commit -m "<mensagem descritiva>"
  git push origin main
  ```
- O repositório oficial no GitHub (`https://github.com/rapharantes/walkmachinesite.git`) aciona automaticamente a Vercel na branch `main`.
