import {
  GrilleMontage
} from "../utils/GrilleMontage.js";
/**
 * Class representant la scène du jeu de la fin
 * @extends Phaser.Scene
 */

export class SceneFinJeu extends Phaser.Scene {
  leScore: number;

  leMeilleurScore: number | string;

  texteScore: Phaser.GameObjects.Text;

  texteMeilleurScore: Phaser.GameObjects.Text;

  texteFinJeu: Phaser.GameObjects.Text;

  texteRejouer: Phaser.GameObjects.Text;

  constructor() {
    super("SceneFinJeu");

    //on va stocker le score dans cette propriété, pour ne pas avoir a faire référence a this.game.jeuDonjon.score à chaque fois
    this.leScore = null;

    //on va stocker le meilleur score dans cette propriété pour éviter d'avoir a faire référence au localstorage trop souvent
    this.leMeilleurScore = null;

    //on va mettre le texte du score dans ca
    this.texteScore = null;

    //on va mettre le meilleur score dans ca
    this.texteMeilleurScore = null;

    //on va mettre le texte de fin du jeu
    this.texteFinJeu = null;

    //on va mettre le texte qui indique au joueur qu'il peut rejouer
    this.texteRejouer = null;
  }

  init() {
    //on va chercher la variable de score
    this.leScore = this.game.jeuDonjon.score;

    //on vérifie si le localstorage existe
    if (localStorage.jeuDonjon != null || localStorage.jeuDonjon != undefined) {
      //on décode en objet js le localstorage
      let score = JSON.parse(localStorage.jeuDonjon);

      //si le score n'est pas null ou undefined
      if (score.meilleurScore != null || score.meilleurScore != undefined) {
        //si le score est plus grand que le meilleur score
        if (this.leScore > score.meilleurScore) {
          //on crée un objet avec le nouveau meilleur score
          let jeuDonjon = {
            meilleurScore: this.leScore,
          };

          //on met dans le localstorage ce nouveau meilleur score
          localStorage.setItem("jeuDonjon", JSON.stringify(jeuDonjon));
        }

        //on assigne à la propriété de classe le meilleur score du local storage
        this.leMeilleurScore = score.meilleurScore;
      }
      //sinon, il n'existe pas
    } else {
      //on créee l'objet pour le localstorage
      let jeuDonjon = {
        meilleurScore: this.leScore,
      };
      //on ajoute l'objet au localstorage
      localStorage.setItem("jeuDonjon", JSON.stringify(jeuDonjon));
    }
  }

  create() {
    //créer un fond a partir de tiles
    let fond: Phaser.GameObjects.TileSprite = this.add.tileSprite(
      0,
      0,
      this.game.config.width,
      this.game.config.height,
      "bloc-crac"
    );
    fond.setOrigin(0, 0);
    fond.setTileScale(fond.tileScaleX * 2, fond.tileScaleY * 2);

    //taille du texte commun
    let tailleTexte = Math.round(45 * GrilleMontage.ajusterRatioX());

    //définition du style commun aux textes
    let styleCommun = {
      fontFamily: "Righteous",
      fontSize: `${tailleTexte}px`,
      fontStyle: "bold",
      color: "#ffffff",
      align: "center",
    };

    //ajouter le texte du titre
    this.texteFinJeu = this.add.text(
      this.game.config.width / 2,
      this.game.config.height / 5,
      "Fin de la partie",
      styleCommun
    );
    this.texteFinJeu.setOrigin(0.5);
    this.texteFinJeu.setColor("#ff0000");

    //ajouter le texte du score
    this.texteScore = this.add.text(
      this.game.config.width / 2,
      this.game.config.height / 2,
      `Score : ${this.leScore}`,
      styleCommun
    );
    this.texteScore.setOrigin(0.5);

    //ajouter le texte du meilleur score
    this.texteMeilleurScore = this.add.text(
      this.game.config.width / 2,
      this.game.config.height / 2.5,
      `Meilleur score : ${this.leMeilleurScore}`,
      styleCommun
    );
    this.texteMeilleurScore.setOrigin(0.5);

    //ajouter le texte qui dit au joueur qu'il peut rejouer
    this.texteRejouer = this.add.text(
      this.game.config.width / 2,
      this.game.config.height / 1.4,
      "Touchez n'importe \n où \n pour recommencer",
      styleCommun
    );
    this.texteRejouer.setOrigin(0.5);
    //réajuster la taille du texte personnalisé
    this.texteRejouer.setFontSize(
      Math.round(40 * GrilleMontage.ajusterRatioX())
    );

    //quand on clique dans l'écran, on recommence
    this.input.once("pointerdown", this.recommencer, this);
  }

  /**
   * Réinitialise le score du jeu et recommence la partie
   */
  recommencer() {
    //on remet le score à 0
    this.game.jeuDonjon.score = 0;
    this.scene.start("SceneJeu");
  }
}