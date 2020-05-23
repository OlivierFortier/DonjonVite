//Importation des fichiers classes ou fichiers nécessaires
import { GrilleMontage } from "../utils/GrilleMontage.js";
/**
 * Class representant la scène du jeu comme tel
 */
export class SceneJeu extends Phaser.Scene {
    //#endregion
    constructor() {
        super("SceneJeu");
        //#region Propriétés ou objets du jeu
        //le score qui sera affiché à l'écran
        this.texteScore = null;
        //le temps écoulé qui sera affiché à l'écran
        this.texteTemps = null;
        //le temps écoulé de la partie en cours
        this.tempsEcoule = 0;
        //référence au timer du mouvement
        this.tempsMouvement = [null, null];
        //flag pour detection de collision
        this.colliderActif = true;
        //initialisation du délai
        this.delai = 3000;
        //le plancher qui bouge
        this.plancher = null;
        //les obstacles à éviter
        this.obstacles = null;
        //les bonus du jeu a toucher
        this.bonus = null;
        //joueur
        this.leJoueur = null;
        //animation de blessure
        this.animBlesse = null;
        //animation de mort
        this.animMort = null;
        //les sons du jeu et la musique
        this.sonMusique = null;
        this.sonBlessure = null;
        this.sonMort = null;
        this.sonPoint = null;
        //vie du joueur
        this.imgVie = null;
        this.nbVie = null;
        //voie actuelle sur laquelle le personnage se tiens
        this.voieActuelle = 10;
        //Les flèches du clavier / plus tard les swipes
        this.flecheDroite = null;
        this.flecheGauche = null;
        //grille de montage
        this.laGrille = null;
        //multiplicateur de vitesse
        this.multiVitesse = 0;
        this.vitesse = 400 * GrilleMontage.ajusterRatioY() + this.multiVitesse; //Vitesse pour les éléments du jeu
        //la vitesse du plancher
        this.vitPlancher = 5.5 + this.multiVitesse;
        //on va mettre le bouton pour naviguer en plein écran dans cette propriété
        this.boutonPleinEcran = null;
        //initialiser le plugin de swipe
        this.leSwipe = null;
        //#endregion
    }
    init() {
        //initialiser une grille pour aligner des objets dans la scène
        this.laGrille = new GrilleMontage(this, 3, 5);
        //config du plancher
        this.plancher = this.add.tileSprite(0, 0, this.game.config.width, //le plancher prends toute la largeur
        this.game.config.height, //le plancher prends toute la hauteur
        "plancher");
        this.plancher.setOrigin(0, 0);
        this.plancher.setScrollFactor(0); //on ne veut pas que le plancher bouge en suivante le personnage
        //initialiser les obstacles et ennemis du jeu
        this.obstacles = this.physics.add.group();
        //initialiser les bonus du jeu (piece or)
        this.bonus = this.physics.add.group();
        //initialiser les sons
        this.sonMusique = this.sound.add("musique-jeu", {
            loop: true,
            volume: 0.2,
        });
        this.sonBlessure = this.sound.add("blessure", {
            loop: false,
            volume: 0.7,
        });
        this.sonMort = this.sound.add("mort", {
            loop: false,
            volume: 0.8,
        });
        this.sonPoint = this.sound.add("point", {
            loop: false,
            volume: 0.8,
        });
        //initialiser les voies gauche et droite et centre
        //(en utilisant des rectangles invisibles, le personnage va bouger vers ces objets)
        this.voieGauche = this.add.rectangle(0, 0, 50, 50);
        this.voieCentre = this.add.rectangle(0, 0, 50, 50);
        this.voieDroite = this.add.rectangle(0, 0, 50, 50);
        this.laGrille.placerIndexCellule(9, this.voieGauche);
        this.laGrille.placerIndexCellule(10, this.voieCentre);
        this.laGrille.placerIndexCellule(11, this.voieDroite);
        //config du joueur
        this.leJoueur = this.physics.add.sprite(0, 0, "perso", 0);
        this.leJoueur.setCollideWorldBounds(true);
        this.leJoueur.setOrigin(0.5, 0.5);
        this.leJoueur.depth = 4;
        //placer et mettre à l'échelle le joueur
        this.leJoueur.setDisplaySize(this.laGrille.largeurColonne * 0.75, this.laGrille.hauteurLigne * 0.75);
        this.leJoueur.setOffset(0, 8);
        this.laGrille.placerIndexCellule(10, this.leJoueur);
        //initialiser la vie du joueur (0 = vie complète , 4 = plus de vie | c'est a cause de l'ordre des sprites)
        this.nbVie = 0;
        this.imgVie = this.add.sprite(0, 0, "coeurs", this.nbVie);
        this.laGrille.placerIndexCellule(12, this.imgVie);
        this.imgVie.setDisplaySize(this.laGrille.largeurColonne * 0.5, this.laGrille.hauteurLigne * 0.5);
        this.imgVie.depth = 10;
        //config fleches clavier
        //ajouter swipe gauche et droit pour controles mobile
        this.flecheDroite = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.flecheGauche = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    }
    create() {
        //Définir l'animation idle du joueur
        this.anims.create({
            key: "animPersoIdle",
            frames: this.anims.generateFrameNumbers("perso", {
                start: 0,
                end: 3,
            }),
            frameRate: 8,
            repeat: -1,
        });
        //définir l'animation de saut du joueur (pour changer de voie)
        this.anims.create({
            key: "animPersoSaut",
            frames: this.anims.generateFrameNumbers("perso", {
                start: 4,
                end: 7,
            }),
            frameRate: 12,
        });
        //animation de blessure du joueur
        this.animBlesse = this.tweens.create({
            targets: this.leJoueur,
            alpha: {
                from: 1,
                to: 0
            },
            yoyo: true,
            duration: 100,
            repeat: 5,
        });
        //animation de mort du joueur
        this.animMort = this.tweens.create({
            targets: this.leJoueur,
            angle: {
                from: 0,
                to: 360
            },
            yoyo: false,
            duration: 100,
            repeat: 5,
        });
        //lorsqu'une animation du joueur est terminée, on revient à l'animation d'idle
        this.leJoueur.on("animationcomplete", () => {
            this.leJoueur.anims.play("animPersoIdle");
        });
        //partir l'animation idle du joueur
        this.leJoueur.anims.play("animPersoIdle");
        //gérer les collisions entre le joueur et les obstacles
        //en typescript, ca écrit une erreur, mais ce n'en est pas une.
        //c'est a cause que je dois respecter la structure que vous avez établie pour le tp,
        //mais avec le gabarit typescript officiel de phaser, la plupart des erreurs sont éliminées
        this.physics.add.overlap(this.leJoueur, this.obstacles, this.verifierCollisionObstacle, null, this);
        //gérer les collisions entre le joueur et les bonus
        //en typescript, ca écrit une erreur, mais ce n'en est pas une.
        //c'est a cause que je dois respecter la structure que vous avez établie pour le tp,
        //mais avec le gabarit typescript officiel de phaser, la plupart des erreurs sont éliminées
        this.physics.add.overlap(this.leJoueur, this.bonus, this.verifierCollisionBonus, null, this);
        //animation de la slime
        this.anims.create({
            key: "animSlimeIdle",
            frames: this.anims.generateFrameNumbers("slime", {
                start: 0,
                end: 7,
            }),
            frameRate: 7,
            repeat: -1,
            yoyo: true,
        });
        //animation du centaure
        this.anims.create({
            key: "animCentaureIdle",
            frames: this.anims.generateFrameNumbers("centaure", {
                start: 16,
                end: 20,
            }),
            frameRate: 7,
            repeat: -1,
            yoyo: false,
        });
        //commencer à choisir les obstacles, ennemis, bonus
        this.choisirObstacles();
        this.time.addEvent({
            delay: this.delai * 1.5,
            callback: this.choisirEnnemis,
            callbackScope: this,
        });
        this.time.addEvent({
            delay: this.delai * 1.2,
            callback: this.choisirBonus,
            callbackScope: this,
        });
        //augmenter le temps à chaque seconde
        this.time.addEvent({
            callbackScope: this,
            callback: this.compterTemps,
            repeat: -1,
            delay: 1000,
        });
        //ajouter les styles pour les textes
        let tailleTexteCommun = Math.round(25 * GrilleMontage.ajusterRatioX());
        let styleCommun = {
            fontFamily: "Righteous",
            fontSize: `${tailleTexteCommun}px`,
            fontStyle: "bold",
            color: "#ffffff",
            align: "center",
            wordWrap: {
                width: this.game.config.width * 0.75,
            },
        };
        //créer le texte de score
        this.texteScore = this.add.text(0, 0, "score", styleCommun);
        this.texteScore.setOrigin(0.5, 0.5);
        this.texteScore.depth = 11;
        this.laGrille.placerIndexCellule(14, this.texteScore);
        //créer le texte de temps écoulé
        this.texteTemps = this.add.text(0, 0, "test", styleCommun);
        this.texteTemps.setOrigin(0.5, 0.5);
        this.texteTemps.depth = 11;
        this.laGrille.placerIndexCellule(13, this.texteTemps);
        //jouer la musique
        this.sonMusique.play();
        //configurer le swipe
        this.leSwipe = this.plugins.get("Phaser3Swipe");
        this.leSwipe.charger(this);
        this.events.on("swipe", this.bougerJoueur, this);
        //vérifier l'orientation de l'écran si on est pas sur ordi
        if (!this.sys.game.device.os.desktop === true) {
            this.verifierOrientation();
            //lors de la rotation de l'écran, appeler cette méthode
            this.scale.on("resize", this.verifierOrientation, this);
        }
        //gestion du mode plein écran si on est pas sur IOS
        if (!this.sys.game.device.os.iOS) {
            //si le mode plein écran est disponible
            if (this.sys.game.device.fullscreen.available) {
                //alors on affiche un bouton qui permet de basculer en plein écran
                this.boutonPleinEcran = this.add.image(0, 0, "pleinEcranBtn", 0);
                //on place le bouton dans la grille en haut a droite
                this.laGrille.placerIndexCellule(2, this.boutonPleinEcran);
                //on met a l'échelle le bouton
                GrilleMontage.mettreEchelleRatioMin(this.boutonPleinEcran);
                //on rends le bouton interactif
                this.boutonPleinEcran.setInteractive({
                    useHandCursor: true
                });
                //mettre le bouton par dessus tout
                this.boutonPleinEcran.depth = 200;
                //Gestionnaire d'événement sur le bouton
                this.boutonPleinEcran.on("pointerup", this.mettreOuEnleverPleinEcran, this);
            }
        }
    }
    /**
     * Permet d'afficher le jeu en mode plein écran ou de l'enlever de ce mode
     */
    mettreOuEnleverPleinEcran() {
        //permet de basculer en mode plein écran et hors de celui-ci
        if (!this.scale.isFullscreen) {
            this.scale.startFullscreen();
        }
        else {
            this.scale.stopFullscreen();
        }
    }
    /**
     * Fait écouler le temps
     */
    compterTemps() {
        this.tempsEcoule += 1;
    }
    update() {
        //booléen pour connaitre si le jeu est terminé ou pas
        let finduJeu;
        //quand il ne reste plus de vie, la partie est terminée
        if (this.nbVie >= 4) {
            finduJeu = true;
            this.finJeu();
        }
        //détruire les obstacles & bonus quand ils sont hors de la scène
        [...this.bonus.getChildren(), ...this.obstacles.getChildren()].forEach((obstacle) => {
            if (obstacle.y >= this.game.config.height + obstacle.displayHeight) {
                obstacle.destroy();
            }
        });
        //tant que ce n'est pas la fin du jeu, on exécute ce code
        if (!finduJeu) {
            //mise a jour du texte
            this.majTexte();
            //mise a jour de la position du fond et des obstacles et bonus
            this.bougerObstacles();
            this.bougerJoueur();
        }
    }
    /**
     * Permet de contrôler le mouvement du joueur de gauche à droite. Avec le clavier ou bien le "swipe"
     * @param direction parametre utilisé par le plugin de swipe pour donner une direction
     */
    bougerJoueur(direction) {
        //controles du joueur
        //le mouvement est limité en 3 voies ou il faut éviter les objets & ennemis
        //bouger à droite , soit avec le clavier ou le swipe sur mobile
        if (Phaser.Input.Keyboard.JustDown(this.flecheDroite) ||
            (direction != null && direction.right)) {
            let nouvelleVoie = this.voieActuelle;
            //si il est dans la voie centrale, bouger vers la voie de droite
            if (this.voieActuelle === 10) {
                this.leJoueur.anims.play("animPersoSaut");
                this.physics.moveToObject(this.leJoueur, this.voieDroite, 60, 100);
                nouvelleVoie = 11;
            }
            //si il est dans la voie de gauche, bouger vers la voie centrale
            else if (this.voieActuelle === 9) {
                this.leJoueur.anims.play("animPersoSaut");
                this.physics.moveToObject(this.leJoueur, this.voieCentre, 60, 100);
                nouvelleVoie = 10;
            }
            //arrêter le mouvement et actualiser la voie après 0.10 secondes
            this.tempsMouvement[0] = setTimeout(() => {
                this.changementVoie(nouvelleVoie);
            }, 100);
            //bouger à gauche, soit avec le clavier ou le swipe sur mobile
        }
        else if (Phaser.Input.Keyboard.JustDown(this.flecheGauche) ||
            (direction != null && direction.left)) {
            let nouvelleVoie = this.voieActuelle;
            //si il est dans la voie centrale, bouger vers la voie de gauche
            if (this.voieActuelle === 10) {
                this.leJoueur.anims.play("animPersoSaut");
                this.physics.moveToObject(this.leJoueur, this.voieGauche, 60, 100);
                nouvelleVoie = 9;
            }
            //si il est dans la voie de droite, bouger vers la voie centrale
            else if (this.voieActuelle === 11) {
                this.leJoueur.anims.play("animPersoSaut");
                this.physics.moveToObject(this.leJoueur, this.voieCentre, 60, 100);
                nouvelleVoie = 10;
            }
            //arrêter le mouvement et actualiser la voie après 0.10 secondes
            this.tempsMouvement[1] = setTimeout(() => {
                this.changementVoie(nouvelleVoie);
            }, 100);
        }
    }
    /**
     * Fais défiler la scène et les obstacles
     */
    bougerObstacles() {
        //faire bouger le plancher
        this.plancher.tilePositionY -= this.vitPlancher;
        //faire bouger les obstacles & bonus
        this.obstacles.setVelocityY(this.vitesse);
        this.bonus.setVelocityY(this.vitesse);
    }
    /**
     * Effectue la mise à jour du texte affiché
     */
    majTexte() {
        //mettre à jour le temps
        this.texteTemps.setText("Temps : " + this.tempsEcoule);
        //mettre à jour le score
        this.texteScore.setText("Score : " + this.game.jeuDonjon.score);
    }
    /**
     * Effectue le changement de voie du personnage
     * @param laVoie le numéro de la voie où on envoie le personnage
     */
    changementVoie(laVoie) {
        this.leJoueur.body.velocity.x = 0;
        this.voieActuelle = laVoie;
    }
    /**
     * Fais apparaitre les bonus dans la scène
     */
    choisirBonus() {
        const pieceOr = this.bonus.create(0, 0, "piece-or");
        pieceOr.nom = "piece-or";
        pieceOr.depth = 2;
        //obtenir une voie aléatoire pour placer les obstacles aléatoirement
        let voieAleatoire = Phaser.Math.RND.integerInRange(0, this.laGrille.nbColonnes - 1);
        //placer l'obstacle
        this.laGrille.placerIndexCellule(voieAleatoire, pieceOr);
        //le mettre en dehors de la scène pour qu'il semble entrer normalement dans le champs de vision
        pieceOr.y = 0 - pieceOr.height;
        //rapeller la fonction apres le délai
        this.time.addEvent({
            delay: this.delai,
            callback: this.choisirBonus,
            callbackScope: this,
        });
    }
    /**
     * Fais apparaitre les obstacles dans la scène
     */
    choisirObstacles() {
        //tableau contenant les obstacles possibles
        const lesObstacles = ["pillier", "tapis", "trou"];
        //choisir un obstacle aléatoirement dans les obstacles possibles
        const nomObstacle = Phaser.Utils.Array.GetRandom(lesObstacles);
        let unObstacle = this.obstacles.create(0, 0, nomObstacle);
        unObstacle.nom = nomObstacle;
        //changer la profondeur des éléments selon l'élément et mettre à l'échelle différemment
        switch (unObstacle.nom) {
            case "pillier":
                unObstacle.depth = 3;
                unObstacle.displayWidth = this.laGrille.largeurColonne * 0.3;
                unObstacle.displayHeight = this.laGrille.hauteurLigne * 0.5;
                break;
            case "tapis":
                unObstacle.depth = 1;
                //unObstacle.setSize(this.laGrille.largeurColonne * 0.5, this.laGrille.hauteurLigne * 0.5,true)
                this.laGrille.mettreEchelleHauteurLigne(unObstacle);
                break;
            case "trou":
                unObstacle.depth = 0;
                // unObstacle.displayWidth = this.laGrille.largeurColonne * 0.5
                // unObstacle.displayHeight = this.laGrille.hauteurLigne * 0.5
                this.laGrille.mettreEchelleProportionMaximale(unObstacle);
                break;
        }
        //obtenir une voie aléatoire pour placer les obstacles aléatoirement
        let voieAleatoire = Phaser.Math.RND.integerInRange(0, this.laGrille.nbColonnes - 1);
        //placer l'obstacle
        this.laGrille.placerIndexCellule(voieAleatoire, unObstacle);
        //le mettre en dehors de la scène pour qu'il semble entrer normalement dans le champs de vision
        unObstacle.y = 0 - unObstacle.height;
        //rapeller la fonction apres le délai
        this.time.addEvent({
            delay: this.delai,
            callback: this.choisirObstacles,
            callbackScope: this,
        });
    }
    /**
     * Fais apparaitre les ennemis dans la scène
     */
    choisirEnnemis() {
        //tableau contenant les obstacles possibles
        const lesEnnemis = ["slime", "centaure"];
        //choisir un obstacle aléatoirement dans les obstacles possibles
        const nomEnnemi = Phaser.Utils.Array.GetRandom(lesEnnemis);
        let unEnnemi = this.obstacles.create(0, 0, nomEnnemi);
        unEnnemi.nom = nomEnnemi;
        //changer la configuration de l'élément selon ce qu'il est
        switch (unEnnemi.nom) {
            case "slime":
                unEnnemi.depth = 2;
                //unEnnemi.setSize(this.laGrille.largeurColonne * 0.5, this.laGrille.hauteurLigne * 0.5,true)
                unEnnemi.displayWidth = this.laGrille.largeurColonne * 0.3;
                unEnnemi.displayHeight = this.laGrille.hauteurLigne * 0.3;
                unEnnemi.anims.play("animSlimeIdle");
                break;
            case "centaure":
                unEnnemi.depth = 3;
                //unEnnemi.setSize(this.laGrille.largeurColonne * 1, this.laGrille.hauteurLigne * 1,true)
                unEnnemi.displayWidth = this.laGrille.largeurColonne * 0.75;
                unEnnemi.displayHeight = this.laGrille.hauteurLigne * 0.5;
                unEnnemi.anims.play("animCentaureIdle");
                break;
        }
        //obtenir une voie aléatoire pour placer les obstacles aléatoirement
        let voieAleatoire = Phaser.Math.RND.integerInRange(0, this.laGrille.nbColonnes - 1);
        //placer l'obstacle
        this.laGrille.placerIndexCellule(voieAleatoire, unEnnemi);
        //le mettre en dehors de la scène pour qu'il semble entrer normalement dans le champs de vision
        unEnnemi.y = 0 - unEnnemi.height;
        //rapeller la fonction apres le délai
        this.time.addEvent({
            delay: this.delai,
            callback: this.choisirEnnemis,
            callbackScope: this,
        });
    }
    /**
     * méthode de rappel pour les collisions entre le joueur et les bonus du jeu (piece or)
     * @param leJoueur référence au gameobject du joueur
     * @param element référence au gameobject avec lequel le joueur entre en collision
     */
    verifierCollisionBonus(leJoueur, element) {
        if (element.nom === "piece-or") {
            //jouer le son
            this.sonPoint.play();
            //augmenter pointage
            this.game.jeuDonjon.score += 100;
            //détruire l'élément
            element.destroy();
        }
    }
    /**
     * éthode de rappel pour les collisions entre le joueur et les éléments du jeu (obstacles ou ennemis)
     * @param leJoueur référence au gameobject du joueur
     * @param element référence au gameobject avec lequel le joueur entre en collision
     */
    verifierCollisionObstacle(leJoueur, element) {
        if (this.colliderActif) {
            if (element.nom === "pillier") {
                //faire jouer le son
                this.sonBlessure.play();
                //faire perdre une vie au joueur
                if (this.nbVie < 4)
                    this.nbVie++;
                this.colliderActif = false;
                this.animBlesse.play();
                //invulnérabilité du joueur pendant environ 1 seconde , pour laisser une chance quand il est malpris apres avoir foncé dans un truc
                //ajouter animation pour que ca paraisse
                this.time.addEvent({
                    delay: 1500,
                    callback: this.changerEtatCollider,
                    callbackScope: this,
                });
            }
            if (element.nom === "tapis") {
                //augmenter la vitesse du jeu!!!
                if (this.delai >= 1000) {
                    this.colliderActif = false;
                    this.delai -= 50;
                    this.multiVitesse += 0.1;
                    this.time.addEvent({
                        delay: 1500,
                        callback: this.changerEtatCollider,
                        callbackScope: this,
                    });
                }
            }
            if (element.nom === "slime") {
                //jouer le son de blessure
                this.sonBlessure.play();
                //faire perdre une vie au joueur
                if (this.nbVie < 4)
                    this.nbVie++;
                this.colliderActif = false;
                this.animBlesse.play();
                //invulnérabilité du joueur pendant environ 1 seconde , pour laisser une chance quand il est malpris apres avoir foncé dans un truc
                //ajouter animation pour que ca paraisse
                this.time.addEvent({
                    delay: 1500,
                    callback: this.changerEtatCollider,
                    callbackScope: this,
                });
            }
            if (element.nom === "centaure") {
                this.nbVie = 4;
                this.colliderActif = false;
                //invulnérabilité du joueur pendant environ 1 seconde , pour laisser une chance quand il est malpris apres avoir foncé dans un truc
                //ajouter animation pour que ca paraisse
                this.time.addEvent({
                    delay: 1500,
                    callback: this.changerEtatCollider,
                    callbackScope: this,
                });
            }
            if (element.nom === "trou") {
                this.nbVie = 4;
                this.colliderActif = false;
                //invulnérabilité du joueur pendant environ 1 seconde , pour laisser une chance quand il est malpris apres avoir foncé dans un truc
                //ajouter animation pour que ca paraisse
                this.time.addEvent({
                    delay: 1500,
                    callback: this.changerEtatCollider,
                    callbackScope: this,
                });
            }
            //mettre à jour la jauge de vie
            this.imgVie.setFrame(this.nbVie);
        }
    }
    /**
     * Ramène l'état initial du collider
     */
    changerEtatCollider() {
        this.colliderActif = true;
    }
    /**
     * Initie la fin du jeu
     */
    finJeu() {
        //jouer le son de mort
        if (!this.sonMort.isPlaying) {
            this.sonMort.play();
        }
        //jouer l'animation de mort du perso
        this.animBlesse.pause();
        this.animMort.play();
        //réinitialiser les variables
        this.tempsEcoule = 0;
        //this.game.jeuDonjon.score = 0;
        this.voieActuelle = 10;
        this.delai = 3000;
        //réinitialiser le collider
        this.colliderActif = true;
        //vider la référence au timer du mouvement
        this.tempsMouvement = this.tempsMouvement.map((timer) => (timer = null));
        //faire arrêter le plancher
        this.plancher.tilePositionY = 0;
        this.multiVitesse = 1;
        //faire arrêter les obstacles
        this.obstacles.setVelocityY(0);
        this.bonus.setVelocityY(0);
        //apres un bref délai, fin du jeu
        this.time.addEvent({
            delay: 1500,
            callback: this.allerFinJeu,
            callbackScope: this,
        });
    }
    /**
     * Permet d'aller à la scene de fin du jeu
     */
    allerFinJeu() {
        this.sonMusique.stop();
        this.scene.start("SceneFinJeu");
    }
    /**
     * Vérifie l'orientation de l'écran, et met le jeu en pause si elle n'est pas valide
     */
    verifierOrientation() {
        if (window.orientation === 90 || window.orientation === -90) {
            //On met le jeu en pause et on arrête le son
            this.scene.pause(this);
            this.sound.pauseAll();
            //On affiche la balise <div>
            document.getElementById("orientation").style.display = "flex";
        }
        else {
            //On repart le jeu et le son
            this.scene.resume(this);
            this.sound.resumeAll();
            //On enlève l'affichage de la balise <div>
            document.getElementById("orientation").style.display = "none";
        }
    }
}
