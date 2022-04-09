import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TimerIcon from '@mui/icons-material/Timer';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import DoneIcon from '@mui/icons-material/Done';
import { recetteInterface } from '../interfaces/recetteInterface';
import { Collapse, IconButton, IconButtonProps, styled } from '@mui/material';

interface cardInterface{
    recette: recetteInterface;
    selected: boolean;
    addRecipe: (id: number) => void;
    removeRecipe: (id: number) => void;
}


interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
  }
  
  const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

export default function MediaCard({recette, selected, addRecipe, removeRecipe}: cardInterface) {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
  return (
    <Card sx={{ maxWidth: 345, minWidth: 345, maxHeight: "375px", overflow: "auto" }}>
      <CardMedia
        component="img"
        height="140"
        image={recette.img}
        alt={recette.name}
      />
      <CardContent style={{padding:"8px 8px 0 8px"}}>
        <Typography variant="body1" component="div">
          {recette.name}
        </Typography>
        <Typography variant="body2" component="div">
        {selected && <DoneIcon fontSize="large" color="success" />}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
      <Typography variant="body2" component="div" style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
            <div style={{paddingRight: "6px"}}>
            <TimerIcon fontSize="small"/> {recette.dureePreparation} min | <OutdoorGrillIcon fontSize="small"/> {recette.dureeCuisson} min
            </div>
            <div style={{display: "flex"}}>
            {
              Array.from(Array(recette.difficulte)).map(() => <span style={{display: "flex"}} role="img" aria-label="difficulty">💪</span>)
          }
            </div>

        </Typography>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent style={{padding:"0px 16px"}}>
          <Typography variant="body1" >Description:</Typography>
          <Typography variant="body2" gutterBottom color="text.secondary">
            {recette.description}
          </Typography>
          <Typography paragraph>
            {recette.ingredients.map((ingredient) => <Typography>{ingredient.name}: {ingredient.quantite} {ingredient.unite}</Typography>)}
          </Typography>
        </CardContent>
      </Collapse>
      <CardActions style={{justifyContent: "end"}}>
        <Button variant="outlined" disabled={!selected} size="small" color="error" onClick={()=>removeRecipe(recette.num)}>Retirer</Button>
        <Button variant="outlined" disabled={selected} size="small" color="success" onClick={()=>addRecipe(recette.num)}>Ajouter</Button>
      </CardActions>
    </Card>
  );
}