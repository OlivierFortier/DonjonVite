//Importation des scripts et classes nécessaires
import "./lib/phaser.min.js";
import {
  SceneChargement
} from "./scenes/SceneChargement.js";
import {
  SceneIntro
} from "./scenes/SceneIntro.js";
import {
  SceneJeu
} from "./scenes/SceneJeu.js";
import {
  SceneFinJeu
} from "./scenes/SceneFinJeu.js";

//On crééra le jeu quand la page HTML sera chargée
window.addEventListener(
  "load",
  function () {
    //On définit avec des variables les dimensions du jeu sur desktop
    let largeur: number = 576;
    let hauteur: number = 1024;

    //On fait 2 vérifications la première pour "Mobile" et la seconde pour "Tablet"
    //Et si on est sur un mobile (tablette ou téléphone), on re-dimensionne le jeu
    if (
      navigator.userAgent.includes("Mobile") ||
      navigator.userAgent.includes("Tablet")
    ) {
      //console.log("Le jeu est lu sur un mobile... on change les dimensions...");
      largeur = Math.min(window.innerWidth, window.innerHeight);
      hauteur = Math.max(window.innerWidth, window.innerHeight);
    }

    // Object pour la configuration du jeu - qui sera passé en paramètre au constructeur
    const config: Config = {
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: largeur,
        height: hauteur,
      },
      scene: [SceneChargement, SceneIntro, SceneJeu, SceneFinJeu],
      input: {
        //limiter les pointeurs à 1
        activePointers: 1,
      },
      backgroundColor: "black",
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
    };

    //en typescript, ca écrit une erreur, mais ce n'en est pas une.
    //c'est a cause que je dois respecter la structure que vous avez établie pour le tp,
    //mais avec le gabarit typescript officiel de phaser, la plupart des erreurs sont éliminées
    WebFont.load({
      google: {
        families: ["Righteous"],
      },

      //  L'événement 'active' PRÉ-DÉFINI signifie que toutes les polices demandées sont chargées et rendues
      //  Quand cet événement sera distribué, on crééra le jeu
      active: function () {
        console.log("La police de caractère est chargée");

        // Création du jeu comme tel - comme objet global pour qu'il soit accessible à toutes les scènes du jeu
        window.game = new Phaser.Game(config);

        window.game.jeuDonjon = {
          score: 0, //Score de la partie courante
        };
      },
    });
  },
  false
);