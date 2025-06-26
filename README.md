# DigitalPrime - E-commerce Platform

Uma plataforma de e-commerce moderna e elegante para o mercado angolano, com design inspirado na Apple e funcionalidades completas de checkout e gestão de pedidos.

## Características Principais

- **Design Moderno**: Interface inspirada na Apple com animações suaves
- **Sistema de Checkout**: Processo completo de pedidos com formulário de endereço
- **Métodos de Pagamento**: Pagamento na entrega e transferência bancária
- **Painel Administrativo**: Gestão completa de produtos, pedidos e categorias
- **Base de Dados PostgreSQL**: Armazenamento seguro e escalável
- **Responsivo**: Otimizado para todos os dispositivos

## Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL
- **Base de Dados**: PostgreSQL com Drizzle ORM
- **Build**: Vite + ESBuild
- **UI Components**: Radix UI + shadcn/ui

## Hospedagem no Vercel

### Pré-requisitos

1. Conta no Vercel
2. Base de dados PostgreSQL (recomendado: Neon Database)
3. Código fonte no GitHub/GitLab

### Configuração da Base de Dados

1. Crie uma base de dados PostgreSQL (Neon Database recomendado)
2. Obtenha a string de conexão `DATABASE_URL`
3. Configure as variáveis de ambiente no Vercel:
   - `DATABASE_URL`: String de conexão PostgreSQL
   - `NODE_ENV`: production

### Deploy no Vercel

1. **Conectar Repositório**:
   - Acesse o dashboard do Vercel
   - Clique em "New Project"
   - Importe o repositório do GitHub/GitLab

2. **Configurar Variáveis de Ambiente**:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   NODE_ENV=production
   ```

3. **Configurações de Build**:
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

4. **Deploy**:
   - Clique em "Deploy"
   - O Vercel irá automaticamente construir e hospedar o projeto

### Estrutura de Arquivos para Vercel

```
├── api/
│   └── index.js          # Função serverless para API
├── dist/
│   ├── public/          # Assets estáticos buildados
│   └── server.js        # Servidor buildado
├── vercel.json          # Configuração do Vercel
└── build.js             # Script de build personalizado
```

### Comandos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start

# Sincronizar schema da base de dados
npm run db:push
```

### Configuração de Domínio Personalizado

1. No dashboard do Vercel, acesse o projeto
2. Vá para "Settings" > "Domains"
3. Adicione o seu domínio personalizado
4. Configure os registros DNS conforme as instruções

### Monitorização e Logs

- Acesse o dashboard do Vercel para ver logs de deploy
- Use o painel "Functions" para monitorizar as funções serverless
- Configure alertas para monitorizar a performance

### Troubleshooting

**Problema: Erro de conexão com a base de dados**
- Verifique se a `DATABASE_URL` está corretamente configurada
- Certifique-se de que a base de dados aceita conexões externas

**Problema: Erro de build**
- Verifique se todas as dependências estão no `package.json`
- Confirme que o comando de build está correto

**Problema: Função serverless timeout**
- Optimize as consultas à base de dados
- Considere usar cache para dados frequentemente acessados

## Suporte

Para suporte técnico ou questões sobre hospedagem, consulte a documentação do Vercel ou entre em contacto com a equipa de desenvolvimento.