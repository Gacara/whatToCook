import React, { useState } from "react"
import data from "../data.json";
import Card from "../components/card";
import { Theme, useTheme } from '@mui/material/styles';
import { recetteInterface } from "../interfaces/recetteInterface";
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Modal, OutlinedInput, Select, SelectChangeEvent, Slider, TextField, Typography } from "@mui/material";
import { flatten, uniq } from "lodash";
import Course from "../components/course";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 400,
    minWidth: 300,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export default function Home(){
    const theme = useTheme();
    const {recettes} = data;
    const ingredients = listIngredients();
    const [recetteSaved, setRecetteSaved] = useState<recetteInterface[]>([]);
    const [ingredientsFiltered, setIngredientsFiltered] = useState<string[]>([]);
    const [searchRecette, setSearchRecette] = useState<string>("");
    const [open, setOpen] = React.useState(false);
    const [filtrer, setFiltrer] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [nbRecette, setNbRecette] = React.useState<string>('1');

    const handleRecetteChange = (event: SelectChangeEvent) => {
        recetteAleatoire(event.target.value);
        setNbRecette(event.target.value);
    };
    
    function listIngredients(){
        const allIngredients = flatten(recettes.map((rec) => rec.ingredients));
        return uniq(allIngredients.map((ing) => ing.name));
      };


    function addRecipe(id: number){
        let newRecettes = [...recetteSaved];
        const allId = newRecettes.map((r) => r.num);
        if(allId.includes(id)) return;
        
        const currentRec = recettes.find((r) => r.num === id);
        if(currentRec) newRecettes = [...newRecettes, currentRec];
        setRecetteSaved(newRecettes);
    }

    function removeRecipe(id: number){
        let newRecettes = [...recetteSaved];
        const allId = newRecettes.map((r) => r.num);
        console.log({allId}, {id}, !allId.includes(id))
        if(!allId.includes(id)) return;
        newRecettes = newRecettes.filter((rec) => rec.num !== id);
        setRecetteSaved(newRecettes);
    }

    
function getStyles(name: string, personName: string[], theme: Theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const handleChange = (event: SelectChangeEvent<typeof ingredientsFiltered>) => {
    const {
      target: { value },
    } = event;
    setIngredientsFiltered(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  function filterRecette(){
      const ingredientsUsed = ingredientsFiltered.length > 0 ? ingredientsFiltered : ingredients;
      if(filtrer) return recetteSaved.filter((rec) => rec.name.includes(searchRecette) && flatten(rec.ingredients.filter((ing)=>ingredientsUsed.includes(ing.name))).length > 0);
      return recettes.filter((rec) => rec.name.includes(searchRecette) && flatten(rec.ingredients.filter((ing)=>ingredientsUsed.includes(ing.name))).length > 0);
  }
  function getRandomArrayElements(count: number) {
    const filtreredRecettes = filterRecette();
    var shuffled = filtreredRecettes.slice(0), i = filtreredRecettes.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

  function recetteAleatoire(count: string){
    const recetteAleatoire = getRandomArrayElements(parseInt(count, 10));

    setRecetteSaved(recetteAleatoire);
  }
    return (
        <div style={{width: "100%"}}>
            <Grid container spacing={2} style={{marginBottom: "16px"}}>
            <Grid item xs={12} sm={6} md={4}>
                <p 
                onClick={() => setFiltrer(!filtrer)}
                style={{cursor: "pointer"}}
                >
                    Nombre de recettes: <b>{recetteSaved.length}</b> (<span style={{color: "#1976d2"}}>{`${filtrer ? "tout" : "filtrer"}`}</span>)
                </p>
            </Grid>
            <Grid item xs={12} sm={6} md={4} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                Générer
            <FormControl style={{padding: "0 6px"}}>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={nbRecette}
                    onChange={handleRecetteChange}
                >
                    {
                        Array.from(Array(filterRecette().length+1).keys()).map((value) =>  <MenuItem value={value}>{`${value}`}</MenuItem>)
                    }
                </Select>
                </FormControl>
                recettes
            </Grid>
            </Grid>

        <Grid container spacing={2} style={{marginBottom: "16px"}}>
        <Grid item xs={12} sm={6} md={4} style={{paddingTop: "0", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <FormControl sx={{ m: 1, width: 300 }}>
                <TextField id="outlined-basic" label="Recettes" variant="outlined" value={searchRecette} onChange={(e) => setSearchRecette(e.target.value)}/>
            </FormControl>
        </Grid>
  <Grid item xs={12} sm={6} md={4} style={{paddingTop: "0", display: "flex", justifyContent: "center", alignItems: "center"}}>
  <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-name-label">Ingredients</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={ingredientsFiltered}
          onChange={handleChange}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
          >
          {ingredients.map((ingredient) => (
              <MenuItem
              key={ingredient}
              value={ingredient}
              style={getStyles(ingredient, ingredientsFiltered, theme)}
              >
              {ingredient}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  </Grid>

  <Grid item xs={12} sm={6} md={4} style={{paddingTop: "0", display: "flex", justifyContent: "center", alignItems: "center"}}>
    <FormControl sx={{ m: 1, width: 300, }}>
    <Button variant="outlined" style={{height: "56px", padding: 0}} onClick={handleOpen}>Générer la liste de courses</Button>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
        {
           <Course recettes={recetteSaved}/>
        }
            </Box>
        </Modal>
      </FormControl>
  </Grid>

  </Grid>

       
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} style={{ justifyContent: "center"}}>            
            {
                filterRecette().map((recette, index) => <Grid
                item
                xs={6}
                sm={4}
                md={4}
                key={index}
                style={{
                    display: "flex",
                    justifyContent: "center",
                }} 
                >
                         <Card
                         selected={recetteSaved.map((rec)=>rec.num).includes(recette.num)}
                         recette={recette}
                         addRecipe={addRecipe}
                         removeRecipe={removeRecipe}
                         />
                     </Grid>)
            }
          </Grid>
        </div>
    );
}