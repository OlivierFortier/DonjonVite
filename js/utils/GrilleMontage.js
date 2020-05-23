/**
 * Classe GrilleMontage
 * pour le cours 582-448-MA
 * @author Johanne Massé
 * @version 2020-02-24
 *          
 * Adaptée de : Wiliam Clarkson / Scaling Games in Phaser 3 with an Alignment Grid (Version 26 mai 2018)
 * @see https://phasergames.com/scaling-games-in-phaser-3/?mc_cid=75e8215130&mc_eid=00f650991f
 */


export class GrilleMontage {
	/**
	 * @constructor
	 * @param {object Phaser.Scene} scene				Scène où l'on fait de la mise en page
	 * @param {number} nbColonnes = 3					Nombres de colonnes pour la mise en page
	 * @param {number} nbLignes = 3						Nombres de lignes pour la mise en page
	 * @param {number hexadecimal} couleur = 0xff0000	Couleur de la grille affichée
	 * @param {number} epaisseurTrait = 2				Épaisseur du trait des lignes de la grille affichée
	 */
	constructor(scene, nbColonnes = 3, nbLignes = 3, couleur = 0xff0000, epaisseurTrait = 2) {
		if ((scene instanceof Phaser.Scene) != true) {
			console.log("Attention - il n'y a pas de scène! La grille de montage ne peut pas être instanciée...");
			//On sort donc du constructeur
			return;
		}

		//Enregistrer dans des propriétés d'instance les valeurs passées en paramètres
		this.scene = scene;
		this.nbLignes = nbLignes;
		this.nbColonnes = nbColonnes;
		this.couleur = couleur;
		this.epaisseurTrait = epaisseurTrait;

		//On va aussi enregistrer les valeurs pour la largeur et la hauteur du jeu
		this.h = game.config.height;
		this.w = game.config.width;

		//On va créer d'autres propriétés d'instances utiles:

		//cw : "cellule width" - la largeur d'une cellule
		//   : largeur de la scène divisée par le nombre de colonnes
		this.cw = this.w / this.nbColonnes;

		//ch : "cellule height" - la hauteur d'une cellule
		//   : hauteur de la scène divisée par le nombre de lignes		
		this.ch = this.h / this.nbLignes;

	}


	/**
	 * Retourne la largeur d'une colonne
	 */
	get largeurColonne() {
		return this.w / this.nbColonnes;
	}

	/**
	 * Retourne la hauteur d'une ligne
	 */
	get hauteurLigne() {
		return this.h / this.nbLignes;
	}

	/**
	 * Retourne la proportion maximale pour cadrer un objet dans une cellule
	 */
	get proportionMaximale() {
		return Math.min(this.w / this.nbColonnes, this.h / this.nbLignes);
	}


	/**
	 * Place un objet par rapport à la position d'une cellule dans la grille
	 * l'objet est placé au centre de la cellule
	 * @param {integer} cX - No de la colonne
	 * @param {integer} cY - No de la ligne
	 * @param {object Phaser.Objects}   obj - Objets du jeu à placer
	 */
	placerColonneLigne(cX, cY, obj) {
		//Identifier les coordonnées X et Y au centre des cellules
		// en enlevant la moitié de la hauteur et de la largeur de la cellule
		let posX = (this.cw * cX) - this.cw / 2;
		let posY = (this.ch * cY) - this.ch / 2;
		obj.x = posX;
		obj.y = posY;
	}

	/**
	 * Place un objet par rapport à l'index d'une cellule
	 * l'objet est placé au centre de la cellule
	 * @param {integer} index - Index de la cellule tel qu'affiché dans la grille
	 * @param {object Phaser.Objects}   obj - Objets du jeu à placer
	 */
	placerIndexCellule(index, obj) {
		//Identifier la position de la cellule en terme de colonne et de la ligne
		let cX = (index % this.nbColonnes) + 1;
		let cY = Math.floor(index / this.nbColonnes) + 1;

		//Placer dans la bonne colonne et ligne
		this.placerColonneLigne(cX, cY, obj);
	}


	/**
	 * Crée une représentation visuelle de la grille
	 * principalement pour la planification et le débogage
	 */
	afficherGrille() {
		this.grille = this.scene.add.graphics();
		//On met une grille sous forme d'un quadrillé
		this.grille.lineStyle(this.epaisseurTrait, this.couleur);

		this.grille.beginPath();

		for (let i = 0; i < this.w; i += this.cw) {
			this.grille.moveTo(i, 0);
			this.grille.lineTo(i, this.h);
		}
		for (let i = 0; i < this.h; i += this.ch) {
			this.grille.moveTo(0, i);
			this.grille.lineTo(this.w, i);
		}
		this.grille.strokePath();

		//Montrer les index des cellules
		this.afficherIndex();
	}

	/**
	 * Affiche les index de chaque cellule
	 * principalement pour la planification et le débogage
	 */
	afficherIndex() {
		//Variable pour indiquer la valeur du premier index
		let index = 0;
		for (let i = 1; i <= this.nbLignes; i++) {
			for (let j = 1; j <= this.nbColonnes; j++) {
				let indexTxt = this.scene.add.text(0, 0, index, {
					color: "red",
					font: "bold 32px Arial"
				});
				indexTxt.setOrigin(0.5, 0.5);
				this.placerColonneLigne(j, i, indexTxt);
				index++;
			}
		}
	}

	//*** QUELQUES MÉTHODES POUR DIMENSIONNER DES OBJETS ***

	/**
	 * Mettre une objet du jeu à l'échelle selon la largeur d'une colonne
	 * @param {object Phaser.Objects}   obj - Objets du jeu à placer
	 * @param {Number} pourcentage = 1 Pourcentage à affecter à l'échelle de l'objet
	 */
	mettreEchelleLargeurColonne(obj, pourcentage = 1) {
		obj.displayWidth = this.largeurColonne * pourcentage;
		obj.scaleY = obj.scaleX;
	}

	/**
	 * Mettre une objet du jeu à l'échelle selon la hauteur d'une ligne
	 * @param {object Phaser.Objects}   obj - Objets du jeu à placer
	 * @param {Number} pourcentage = 1 Pourcentage à affecter à l'échelle de l'objet
	 */
	mettreEchelleHauteurLigne(obj, pourcentage = 1) {
		obj.displayHeight = this.hauteurLigne * pourcentage;
		obj.scaleX = obj.scaleY;
	}

	/**
	 * Mettre une objet du jeu à l'échelle selon la dimension maximale d'un objet dans une cellule
	 * @param {object Phaser.Objects}   obj - Objets du jeu à placer
	 * @param {Number} pourcentage = 1 Pourcentage à affecter à l'échelle de l'objet
	 */
	mettreEchelleProportionMaximale(obj, pourcentage = 1) {
		obj.displayWidth = this.proportionMaximale * pourcentage;
		obj.scaleY = obj.scaleX;
	}


	//*** MÉTHODES ET PROPRIÉTÉ STATIQUES POUR DIMENSIONNER DES OBJETS SELON DIMENSION DU JEU***
	//Récupérer le ratio sur l'axe des X entre la dimension horizontale planifiée du jeu et la dimension réelle
	static ajusterRatioX(largeurJeu = 576) {
		return (game.config.width / largeurJeu);
	}

	//Récupérer le ratio sur l'axe des Y entre la dimension verticale planifiée du jeu et la dimension réelle
	static ajusterRatioY(hauteurJeu = 1024) {
		return (game.config.height / hauteurJeu);
	}

	//Récupérer le ratio minimum 
	static ajusterRatioMin(largeurJeu = 576, hauteurJeu = 1024) {
		let ratioX = (game.config.width / largeurJeu);
		let ratioY = (game.config.height / hauteurJeu);
		let ratioMin = Math.min(ratioX, ratioY);
		return ratioMin;
	}

	/**
	 * Mettre une objet du jeu à l'échelle selon la largeur réelle du jeu
	 * @param {object Phaser.Objects}   obj - Objets du jeu à placer
	 * @param {Number} pourcentage = -  1 Pourcentage à affecter à l'échelle de l'objet
	 */
	static mettreEchelleLargeurJeu(obj, pourcentage = 1) {
		obj.displayWidth = game.config.width * pourcentage;
		obj.scaleY = obj.scaleX;
	}

	/**
	 * Mettre une objet du jeu à l'échelle selon la hauteur réelle du jeu
	 * @param {object Phaser.Objects}   obj - Objets du jeu à placer
	 * @param {Number} pourcentage = 1 - Pourcentage à affecter à l'échelle de l'objet
	 */
	static mettreEchelleHauteurJeu(obj, pourcentage = 1) {
		obj.displayHeight = game.config.height * pourcentage;
		obj.scaleX = obj.scaleY;
	}

	/**
	 * Mettre une objet du jeu à l'échelle proportionnellement à la largeur du jeu
	 * @param {object Phaser.Objects}   obj - Objets du jeu à placer
	 * @param {Number} largeurJeu = 576 - Largeur de conception du jeu pour calculer le ratio/Pourcentage à affecter à l'échelle de l'objet
	 */
	static mettreEchelleRatioX(obj, largeurJeu = 576) {
		let ratioX = (game.config.width / largeurJeu);
		obj.scaleX = obj.scaleY = ratioX;
	}

	/**
	 * Mettre une objet du jeu à l'échelle proportionnellement à la hauteur du jeu
	 * @param {object Phaser.Objects}   obj - Objets du jeu à placer
	 * @param {Number} hauteurJeu = 1024 - Largeur de conception du jeu pour calculer le ratio/Pourcentage à affecter à l'échelle de l'objet
	 */
	static mettreEchelleRatioY(obj, hauteurJeu = 1024) {
		let ratioY = (game.config.height / hauteurJeu);
		obj.scaleY = obj.scaleX = ratioY;
	}


	/**
	 * Mettre une objet du jeu à l'échelle proportionnellement au ratio minimum entre le ratio horizontal et vertical
	 * @param {object Phaser.Objects}   obj - Objets du jeu à placer
	 * @param {Number} largeurJeur = 576 - Largeur de conception du jeu pour calculer le ratio/Pourcentage horizontal
	 * * @param {Number} largeurJeur = 1024 - Largeur de conception du jeu pour calculer le ratio/Pourcentage vertical
	 */
	static mettreEchelleRatioMin(obj, largeurJeu = 576, hauteurJeu = 1024) {
		let ratioX = (game.config.width / largeurJeu);
		let ratioY = (game.config.height / hauteurJeu);
		let ratioMin = Math.min(ratioX, ratioY);
		obj.scaleX = obj.scaleY //= ratioMax;
	}

	//*** MÉTHODES STATIQUES POUR PLACER DES OBJETS DANS LES 4 COINS DU JEU***

	/**
	 * Placer objet dans le coin supérieur gauche du jeu
	 * @param {object Phaser.Objects}   obj - Objets du jeu à placer
	 */
	static alignerCoinSuperieurGauche(obj) {

		obj.setOrigin(0, 0);
		obj.x = 0;
		obj.y = 0;

	}

	/**
	 * Placer objet dans le coin supérieur droit du jeu
	 * @param {object Phaser.Objects}   obj - Objets du jeu à placer
	 */
	static alignerCoinSuperieurDroit(obj) {
		obj.setOrigin(1, 0);
		obj.x = game.config.width;
		obj.y = 0;
	}

	/**
	 * Placer objet dans le coin inférieur gauche du jeu
	 * @param {object Phaser.Objects}   obj - Objets du jeu à placer
	 */
	static alignerCoinInferieurGauche(obj) {
		obj.setOrigin(0, 1);
		obj.x = 0;
		obj.y = game.config.height;

	}

	/**
	 * Placer objet dans le coin inférieur gauche du jeu
	 * @param {object Phaser.Objects}   obj - Objets du jeu à placer
	 */
	static alignerCoinInferieurDroit(obj) {
		obj.setOrigin(1, 1);
		obj.x = game.config.width;
		obj.y = game.config.height;
	}
}