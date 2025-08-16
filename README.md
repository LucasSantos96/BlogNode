# 📝 BlogNode - Sistema de Blog em Node.js

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.16.4-green.svg)](https://mongodb.com/)
[![Handlebars](https://img.shields.io/badge/Handlebars-8.0.2-orange.svg)](https://handlebarsjs.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

Um sistema completo de blog desenvolvido em Node.js com autenticação, gerenciamento de postagens e categorias, e interface responsiva.

## 🚀 Funcionalidades

### 👥 Para Visitantes
- ✅ Visualizar postagens na página inicial
- ✅ Navegar por categorias
- ✅ Visualizar postagens individuais
- ✅ Sistema de registro e login
- ✅ Interface responsiva

### 🔧 Para Administradores
- ✅ **CRUD completo de categorias**
  - Criar, listar, editar e deletar categorias
  - Validação de campos obrigatórios
- ✅ **CRUD completo de postagens**
  - Criar, listar, editar e deletar postagens
  - Associação com categorias
  - Validação de campos obrigatórios
- ✅ **Dashboard administrativo**
- ✅ **Sistema de autenticação seguro**

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **Passport.js** - Autenticação
- **bcryptjs** - Criptografia de senhas
- **express-session** - Gerenciamento de sessões
- **connect-flash** - Mensagens flash

### Frontend
- **Handlebars** - Template engine
- **Bootstrap 5** - Framework CSS responsivo
- **Moment.js** - Formatação de datas

## 📁 Estrutura do Projeto

```
BlogNode/
├── config/              # Configurações
│   ├── auth.js         # Configuração do Passport
│   └── db.js           # Configuração do MongoDB
├── helpers/            # Middlewares auxiliares
│   └── eAdmin.js       # Verificação de admin
├── models/             # Modelos do MongoDB
│   ├── Categoria.js    # Modelo de categorias
│   ├── Postagem.js     # Modelo de postagens
│   └── Usuario.js      # Modelo de usuários
├── public/             # Arquivos estáticos
│   ├── css/           # Arquivos CSS (Bootstrap)
│   └── js/            # Arquivos JavaScript
├── routes/             # Rotas da aplicação
│   ├── admin.js       # Rotas administrativas
│   └── usuario.js     # Rotas de usuários
├── views/              # Templates Handlebars
│   ├── admin/         # Páginas administrativas
│   ├── categoria/     # Páginas de categorias
│   ├── postagem/      # Páginas de postagens
│   ├── usuarios/      # Páginas de usuários
│   ├── layouts/       # Layouts principais
│   └── partials/      # Componentes reutilizáveis
├── app.js             # Arquivo principal
├── package.json       # Dependências
└── README.md          # Este arquivo
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- MongoDB (local ou MongoDB Atlas)
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/LucasSantos96/BlogNode.git
cd BlogNode
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados

#### Opção A: MongoDB Local
1. Instale o MongoDB em sua máquina
2. Inicie o serviço do MongoDB
3. O projeto usará automaticamente: `mongodb://localhost/blogapp`

#### Opção B: MongoDB Atlas (Recomendado)
1. Crie uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crie um cluster gratuito
3. Obtenha a string de conexão
4. Configure as variáveis de ambiente (veja seção abaixo)

### 4. Configure as variáveis de ambiente (opcional)
Crie um arquivo `.env` na raiz do projeto:
```env
NODE_ENV=development
MONGODB_URI=sua_url_mongodb_atlas
ADMIN_EMAIL=admin@exemplo.com
```

### 5. Execute o projeto
```bash
npm start
```

O servidor estará rodando em: `http://localhost:8081`

## 🔐 Sistema de Autenticação

### Registro de Usuário
- Nome, email e senha obrigatórios
- Senha mínima de 8 caracteres
- Confirmação de senha
- Criptografia automática com bcrypt

### Login
- Autenticação via email e senha
- Sessões persistentes
- Redirecionamento automático

### Controle de Acesso
- Middleware `eAdmin` para rotas administrativas
- Verificação de privilégios de administrador

## 📊 Modelos de Dados

### Usuario
```javascript
{
  nome: String (obrigatório),
  email: String (obrigatório, único),
  senha: String (obrigatório, criptografada),
  eAdmin: Number (padrão: 0)
}
```

### Categoria
```javascript
{
  nome: String (obrigatório),
  slug: String (obrigatório, único),
  date: Date (padrão: data atual)
}
```

### Postagem
```javascript
{
  titulo: String (obrigatório),
  slug: String (obrigatório, único),
  descricao: String (obrigatório),
  conteudo: String (obrigatório),
  categoria: ObjectId (referência a categorias),
  data: Date (padrão: data atual)
}
```

## 🌐 Rotas Principais

### Públicas
- `GET /` - Página inicial com postagens
- `GET /postagem/:slug` - Visualizar postagem individual
- `GET /categorias` - Listar todas as categorias
- `GET /categorias/:slug` - Postagens de uma categoria
- `GET /usuarios/registro` - Formulário de registro
- `GET /usuarios/login` - Formulário de login

### Administrativas (requer autenticação admin)
- `GET /admin` - Dashboard administrativo
- `GET /admin/categorias` - Gerenciar categorias
- `GET /admin/postagens` - Gerenciar postagens
- `POST /admin/categorias/nova` - Criar categoria
- `POST /admin/postagens/nova` - Criar postagem

## 🚀 Deploy

### Heroku
```bash
# Instalar Heroku CLI
npm install -g heroku

# Login e deploy
heroku login
heroku create seu-blog-node
heroku config:set MONGODB_URI=sua_url_mongodb
heroku config:set NODE_ENV=production
git push heroku main
```

### Railway
1. Conecte o repositório GitHub
2. Configure as variáveis de ambiente
3. Deploy automático

### Render
1. Conecte o repositório
2. Configure MongoDB
3. Deploy automático

### Variáveis de Ambiente para Deploy
```bash
NODE_ENV=production
MONGODB_URI=sua_url_mongodb_atlas
ADMIN_EMAIL=email_do_admin@exemplo.com
```

## 🛠️ Desenvolvimento

### Scripts Disponíveis
```bash
npm start          # Inicia o servidor
npm test           # Executa testes (não configurado)
```

### Estrutura de Desenvolvimento
- **MVC Architecture** - Model-View-Controller
- **Middleware Pattern** - Para autenticação e validação
- **Template Engine** - Handlebars para views
- **Database ORM** - Mongoose para MongoDB

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença ISC. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Lucas Santos**
- GitHub: [@LucasSantos96](https://github.com/LucasSantos96)
- Projeto: [BlogNode](https://github.com/LucasSantos96/BlogNode)

## 🙏 Agradecimentos

- [Express.js](https://expressjs.com/) - Framework web
- [MongoDB](https://mongodb.com/) - Banco de dados
- [Bootstrap](https://getbootstrap.com/) - Framework CSS
- [Handlebars](https://handlebarsjs.com/) - Template engine

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, por favor:

1. Verifique se o problema já foi reportado nas [Issues](https://github.com/LucasSantos96/BlogNode/issues)
2. Crie uma nova issue com detalhes do problema
3. Inclua informações sobre seu ambiente (Node.js, MongoDB, etc.)

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!
