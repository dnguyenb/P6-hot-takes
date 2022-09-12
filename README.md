P6-hot-takes

Instructions d'installation :

1.  Cloner le repo Frontend https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6

2.  Depuis le dossier frontend :

        - installer @Angular/CLI avec npm install -g @angular/cli
        - npm install
        - npm audit fix s'il ya des erreurs. (Executer ‘npm audit fix --force’ Puis on vérifie avec ‘npm audit’ que tout est ok)
        - Mettre à jour Angular avec ng update @angular/cli
        - ng update @angular/core (au besoin ng update @angular/core --force)
        - ng update rxjs
        - npm run start
        - Rdv sur http://localhost:4200/ => la page de signup / login doit s'afficher.

    lancer le Frontend avec ng serve par la suite.

3.  Depuis le dossier Backend :

    - npm install
    - npm run start
    - nodemon server
    - Rajouter un fichier environnement .env qui inclus 3 constantes:

      - DB_USERNAME = "**\***"
      - DB_PASSWORD = "**\***"
      - TOKEN = "**\***"
