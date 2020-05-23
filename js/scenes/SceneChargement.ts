import {
  GrilleMontage
} from "../utils/GrilleMontage.js";

/**
 * Class representant la scène du jeu qui charge les médias.
 * @extends Phaser.Scene
 */

export class SceneChargement extends Phaser.Scene {
  barre: any;

  texteProgression: any;

  constructor() {
    super("SceneChargement");

    this.barre = null; //La barre pour illustrer le % de chargement
    this.texteProgression = null; //Le texte pour afficher le % de chargement
  }

  preload() {
    //on créée la barre de chargement, et on va ajuster son scaleX selon la progression du chargement
    this.barre = this.add.rectangle(
      0,
      this.game.config.height / 2,
      this.game.config.width,
      this.game.config.height * 0.15,
      0xff0040
    );
    this.barre.setOrigin(0, 0.5);

    //taille du texte pour le chargement
    let tailleTexte = Math.round(64 * GrilleMontage.ajusterRatioX());

    //créer le texte qui affiche le pourcentage de progression, dans le milieu de l'écran
    this.texteProgression = this.add.text(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "0%", {
        fontFamily: "Righteous",
        fontSize: `${tailleTexte}px`,
        fontStyle: "bold",
        color: "#808080",
        align: "center",
      }
    );
    this.texteProgression.setOrigin(0.5);

    //on écoute l'événement de progres de load, et on apelle la fonction qui affiche la progression
    this.load.on("progress", this.afficherProgression, this);

    //Partie du chemin commun aux images...
    this.load.setPath("medias/img/");

    //Charger les images du jeu

    //provient de itch.io : libre de droits
    this.load.image("pillier", "pillier.png");

    //provient de itch.io : libre de droits
    this.load.image("tapis", "tapis.png");

    //provient de itch.io : libre de droits
    this.load.image("plancher", "tilePlancher.png");

    //provient de itch.io : libre de droits
    this.load.image("trou", "trou.png");

    //provient de itch.io : libre de droits
    this.load.spritesheet("perso", "chars.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    //provient de itch.io : libre de droits
    this.load.spritesheet("centaure", "chars.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    //provient de itch.io : libre de droits
    this.load.spritesheet("slime", "./slime-Sheet.png", {
      frameWidth: 32,
      frameHeight: 28,
    });

    //provient de itch.io : libre de droits
    this.load.spritesheet("coeurs", "vie.png", {
      frameWidth: 17,
      frameHeight: 17,
    });

    //créé par moi avec aseprite
    //charger le bouton pour mettre en plein écran ou pas
    this.load.spritesheet("pleinEcranBtn", "plein-ecran.png", {
      frameWidth: 64,
      frameHeight: 64
  })

    //créé par moi avec aseprite
    this.load.image("piece-or", "./piece-or.png");

    //créé par moi avec aseprite
    this.load.image("bloc-crac", "cracked-block.png");

    //Partie du chemin commun aux sons...
    this.load.setPath("medias/sons/");

    //provient de itch.io : libre de droits
    this.load.audio("blessure", ["blessure.mp3", "blessure.ogg"]);

    //provient de freesound.org : libre de droit
    this.load.audio("mort", ["mort.mp3", "mort.ogg"]);

    //provient de itch.io : libre de droits
    this.load.audio("musique-jeu", [
      "09 Fire in the Hole.mp3",
      "09 Fire in the Hole.ogg",
    ]);

    //provient de freesound.org : libre de droit
    this.load.audio("point", ["point.mp3", "point.ogg"]);

    //chargement du plugin de swipe
    this.load.plugin(
      "Phaser3Swipe",
      "../../js/plugin/Phaser3Swipe.min.js",
      true
    );
  }

  /**
   * Permet de mettre à jour le scaleX de la barre de progres
   * @param pourcentage parametre qui est recu par défaut par la fonction de rappel
   */
  afficherProgression(pourcentage) {
    this.texteProgression.text = Math.floor(pourcentage * 100) + " %";
    this.barre.scaleX = pourcentage;
  }

  create() {
    this.scene.start("SceneIntro");
  }
}