import { Divider, List, ListItem } from "@mui/material";
import { entries, flatten, uniq, uniqBy } from "lodash";
import React from "react";
import { ingredientInferface, recetteInterface } from "../interfaces/recetteInterface";

interface ingredientByCategoryInterface {
    [key: string]: ingredientInferface[];
}

interface ingredientQuantityInterface {
    [key: string]: number;
}

interface courseInterface{
    recettes: recetteInterface[]
}

export default function Course({recettes}: courseInterface){

    const allFlattenIngredients = flatten(recettes.map((recette)=> recette.ingredients.map((ingredient) => ingredient)));
    const formatedIngredientsList = formatIngredientsList(allFlattenIngredients);

    function defineIngredientsByCategory(ingredients: ingredientInferface[] |[]){
        let ingredientsByCategory: ingredientByCategoryInterface = {};

        ingredients.forEach((ingredient)=>{
          const categoryName = ingredient.category || 'inconnu';
          if(ingredientsByCategory[categoryName]){
            ingredientsByCategory[categoryName] = [...ingredientsByCategory[categoryName], ingredient];
          } else {
            ingredientsByCategory[categoryName] = [ingredient];
          }
        })

        return ingredientsByCategory
    };

    function formatIngredientsList(allIngredients: ingredientInferface[]){
        const allIngredientsName = uniqBy(allIngredients, "name").map((ingredient) => ingredient.name);
        let mergedIngredients: ingredientInferface[] | [] = [];
        allIngredientsName.forEach((ingredientName) => {
            const ingredientsToAdd = allIngredients.filter((ingredient) => ingredient.name === ingredientName);
            if(ingredientsToAdd.length > 0){
                const newIngredientQuantity = ingredientsToAdd.reduce(
                    (previousValue, currentValue) => previousValue + currentValue.quantite,
                    0
                  );
                const newIngredient: ingredientInferface = {
                    name: ingredientsToAdd[0].name,
                    category: ingredientsToAdd[0].category,
                    unite: ingredientsToAdd[0].unite,
                    quantite: newIngredientQuantity,
                    specificite: ingredientsToAdd[0].specificite
                };
                mergedIngredients = [...mergedIngredients, newIngredient]
            }

        })

        return mergedIngredients;
    }


    return (
        <List>
            {
              Object.entries(defineIngredientsByCategory(formatedIngredientsList)).map(([key, value])=>
              <>

              <b style={{padding: "3px 0"}}>Rayon: {key}</b>

              {
                  
                  value.map((ingredient)=><ListItem disablePadding>
                  {ingredient.name} {ingredient.specificite || ""} : {ingredient.quantite} {ingredient.unite}
              </ListItem>)
              
              }
               <Divider style={{paddingTop: "10px"}} />
              </>
           
              )
            }
        </List>
    );
}