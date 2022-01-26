## Configurar a aplicação para ser colocada na heroku
1 - Executar um "npm init"
2 - No arquivo package.json criado pelo comando anterior, colocar um comando de start dentro da tag "scripts". Vai ficar assim: 
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app.js"
  },
  3 - no app.js, mudar a porta que é usada como padrão. Utilizar uma variável dde ambiente do node. Vai ficar assim: 
    const PORT = process.env.PORT || 8081
    app.listen(PORT, () => {
    console.log('Servidor Rodando!')
    })


## Criar um banco mongodb grátis em http://mongodb.com
1 - Criar um usuário e uma senha.
2 - Em Network Access, liberar para que o banco seja acessado por qualquer IP
3 - Pegar a URL de conexão e utilizar no app, por exemplo: "mongodb+srv://<username>:<password>@cluster0.fu1c4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

## Deploy na Heroku
Fonte: https://www.youtube.com/watch?v=OVsvdeG_AZc&list=PLJ_KhUnlXUPtbtLwaxxUxHqvcNQndmI4B&index=63
Basicamente: 
1 - Instalar git
2 - Adicionar a pasta "node_modules" no arquivo .gitgnore
3 - Executar:
    3.1 - "git init" na raiz do projeto
    3.2 - "git add ."
    3.3 - 'git commit -am "commit inicial"'

4 - Instalar o Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
5 - Abrir a pasta do projeto eplo CMD. Logar na heroku com "heroku login" - Logar com email e senha da Heroku
6 - Executar heroku create (cria uma nova aplicação na heroku). No meu caso, foi criada uma aplicação com o nome "lit-shelf-83953". 
7 - entrar pelo browse na nova aplicação que foi criada com um nome aleatório "lit-shelf-83953". Ir na aba "Deploy" (https://dashboard.heroku.com/apps/lit-shelf-83953/deploy/heroku-git) e executar dentro no heroku CLI os comandos indicados lá:
    heroku git:clone -a lit-shelf-83953$ cd lit-shelf-83953
    git push heroku master

Executar um "heroku open" que ele vai abrir a sua aplicação