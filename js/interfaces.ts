
//déclaration des interfaces et modèles d'objets pour typescript du projet
export {}
declare global {
    //rendre accessible la propriété "game" dans l'objet window
    interface Window {
        game : Phaser.Game
    }

    //interface pour la configuration du jeu
    interface Config {
        scale: scale,
        scene: Array<any>,
        input: object,
        backgroundColor: string,
        physics: physics
    }

    interface scale {
        mode : number,
        autoCenter : number,
        width: number,
        height: number
    }

    interface physics {
        default: string,
        arcade: object
    }

}