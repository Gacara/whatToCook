import React, { useState } from "react";
import { Divider, List, ListItem } from "@mui/material";
import { entries, flatten, uniq, uniqBy } from "lodash";
import { ingredientInferface, recetteInterface } from "../interfaces/recetteInterface";
import CloseIcon from '@mui/icons-material/Close';

interface ingredientByCategoryInterface {
    [key: string]: ingredientInferface[];
}

interface courseInterface{
    recettes: recetteInterface[]
}

export default function Course({recettes}: courseInterface){

    const allFlattenIngredients = flatten(recettes.map((recette)=> recette.ingredients.map((ingredient) => ingredient)));
    const formatedIngredientsList = formatIngredientsList(allFlattenIngredients);
    const [deletedIngredients, setDeletedIngredients] = useState<string[]>([]);

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

    function filterByIngredient(ingredients: ingredientInferface[]){
        const newIngredientByCategoryInterface = ingredients.filter((ingredient) => !deletedIngredients.includes(ingredient.name));
        return newIngredientByCategoryInterface;
    }

    return (
        <List>
            {
              Object.entries(defineIngredientsByCategory(formatedIngredientsList)).map(([key, value])=>
              <>
                {
                    filterByIngredient(value).length > 0 && <b style={{padding: "3px 0"}}>Rayon: {key}</b>
                }
            
              {
                  
                  filterByIngredient(value).map((ingredient)=><ListItem disablePadding style={{display: "flex", justifyContent: "space-between"}}>
                  <div>
                    {ingredient.name} {ingredient.specificite || ""} : {ingredient.quantite} {ingredient.unite}
                  </div>
                  <CloseIcon fontSize="small" onClick={()=> setDeletedIngredients([...deletedIngredients, ingredient.name])} />
              </ListItem>)
              
              }
               <Divider style={{paddingTop: "10px"}} />
              </>
           
              )
            }
        </List>
    );
}