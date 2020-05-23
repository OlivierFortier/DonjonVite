import { GrilleMontage } from "../utils/GrilleMontage.js";
/**
 * Class representant la scène du jeu de la fin
 * @extends Phaser.Scene
 */
export class SceneIntro extends Phaser.Scene {
    constructor() {
        super("SceneIntro");
        //initialisation des propriétés de classes
        //contiendra la roue des couleurs phaser hsv
        this.hsv = null;
        //contiendra le numéro de la roue des couleurs
        this.numCouleur = 0;
        //contiendra le texte du titre
        this.texteTitreJeu = null;
        //contiendra le texte d'info du jeu
        this.texteInfoJeu = null;
        //contiendra le texte qui dit au joueur comment commencer la partie
        this.texteJouerJeu = null;
    }
    create() {
        //initialisation de la roue des couleurs
        this.hsv = Phaser.Display.Color.HSVColorWheel();
        //on ajoute les tiles qui composent le fond
        let fond = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, "bloc-crac");
        //configuration du fond
        fond.setOrigin(0, 0);
        //configuration de l'échelle du fond
        fond.setTileScale(fond.tileScaleX * 2, fond.tileScaleY * 2);
        //Le style du texte commun
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
        //taille du texte pour le titre
        let tailleTexteTitre = Math.round(60 * GrilleMontage.ajusterRatioX());
        //ajouter le texte du titre
        this.texteTitreJeu = this.add.text(this.game.config.width / 2, this.game.config.height / 5, "Donjon Vite", styleCommun);
        this.texteTitreJeu.setOrigin(0.5, 0.5);
        //ajuster la taille du titre en plus grand
        this.texteTitreJeu.setFontSize(tailleTexteTitre);
        //ajouter le texte d"info
        this.texteInfoJeu = this.add.text(this.game.config.width / 2, this.game.config.height / 2.50, "Bougez de gauche a droite pour éviter les obstacles dans le donjon ! \n \n Flèches du clavier & 'swipe' sur mobile pour bouger", styleCommun);
        this.texteInfoJeu.setOrigin(0.5, 0.5);
        //ajouter le texte qui informe le joueur qu'il peut cliquer dans l'écran pour commencer le jeu
        this.texteJouerJeu = this.add.text(this.game.config.width / 2, this.game.config.height / 1.4, "cliquer dans l'écran \n pour commencer", styleCommun);
        this.texteJouerJeu.setOrigin(0.5, 0.5);
        //commencer le jeu lorsqu'on clique dans l'écran
        this.input.once("pointerdown", this.commencer, this);
    }
    /**
     * Animation de la couleur du texte
     * @see https://phaser.io/examples/v3/view/display/tint/rainbow-text
     */
    update() {
        //petite animation de texte pour changer la couleur
        //on initialise les couleurs, et a chaque update elles sont refaites
        let hautTexte = this.hsv[this.numCouleur].color;
        let basTexte = this.hsv[359 - this.numCouleur].color;
        //on change la teinte du texte selon les couleur
        this.texteJouerJeu.setTint(hautTexte, hautTexte, basTexte, basTexte);
        //on change la couleur du titre
        this.texteTitreJeu.setTint(basTexte, hautTexte, hautTexte, basTexte);
        //on cycle a travers la roue des couleurs
        this.numCouleur++;
        //si on arrive à 360, on reviens au début (à 0)
        if (this.numCouleur === 360) {
            this.numCouleur = 0;
        }
    }
    /**
     * Commence la scène de jeu
     */
    commencer() {
        this.scene.start("SceneJeu");
    }
}
