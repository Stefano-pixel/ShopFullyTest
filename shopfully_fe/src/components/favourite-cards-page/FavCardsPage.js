import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Typography, Drawer, IconButton } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Divider from "@mui/material/Divider";
import { FAVORITE_CARDS_KEY } from "../../constants/config";
import "./FavCardsPage.css";
import logoImage from "../../images/cardimg.png";
import {
  removeFlyerLocally,
  getFlyersLocally,
} from "../../services/flyerServices";

function FavCardsPage({ menuOpen, onMenuClose }) {
  const [selectedIndexes, setSelectedIndexes] = useState([]);

  const handleRemoveFavoriteClick = (index) => {
    const cardToRemove = getFlyersLocally(FAVORITE_CARDS_KEY)[index];
    removeFlyerLocally(FAVORITE_CARDS_KEY, cardToRemove);
    setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
  };

  return (
    <Drawer
      className="drawer"
      anchor="left"
      open={menuOpen}
      onClose={onMenuClose}
      classes={{ paper: "drawer-paper" }}
    >
      <div className="drawer-content">
        <img src={logoImage} alt="logo" className="drawer-logo" />
        <Typography variant="h4" style={{ fontWeight: "bold" }}>
          Favourites
        </Typography>
        <Typography variant="h6">The list of your preferred flyers</Typography>
      </div>
      <Divider />
      <List>
        {getFlyersLocally(FAVORITE_CARDS_KEY).map((card, index) => (
          <ListItem
            key={uuidv4()}
            className={selectedIndexes.includes(index) ? "Mui-selected" : ""}
          >
            <ListItemIcon>
              <IconButton
                key={uuidv4()}
                onClick={() => handleRemoveFavoriteClick(index)}
              >
                <FavoriteIcon sx={{ color: "#FF0000" }} />
              </IconButton>
            </ListItemIcon>
            <ListItemText primary={card.title} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default FavCardsPage;
