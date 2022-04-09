export interface recetteInterface {
    name: string;
    img: string;
    num: number;
    description: string;
    difficulte: number;
    dureePreparation: number;
    dureeCuisson: number;
    ingredients: ingredientInferface[];
}

export interface ingredientInferface{
    name: string;
    category: string;
    quantite: number;
    unite: string;
    specificite?: string;
}
