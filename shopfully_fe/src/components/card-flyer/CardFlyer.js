import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { FAVORITE_CARDS_KEY } from "../../constants/config";
import "./CardFlyer.css";
import {
  addFlyerLocally,
  getFlyersLocally,
  removeFlyerLocally,
} from "../../services/flyerServices";
import myImage from "../../images/cardimg.png";
import FavoriteIcon from "@mui/icons-material/Favorite";

function CardFlyer({ cardData }) {
  const favoriteCards = getFlyersLocally(FAVORITE_CARDS_KEY);
  let isFavorite = favoriteCards.some((item) =>
    Object.keys(item).every((key) => Object.is(item[key], cardData[key]))
  );

  const [favorite, setFavorite] = useState(isFavorite);

  const handleAddFavoriteClick = () => {
    addFlyerLocally(FAVORITE_CARDS_KEY, cardData);

    setFavorite(true);
  };

  const handleRemoveFavoriteClick = () => {
    removeFlyerLocally(FAVORITE_CARDS_KEY, cardData);
    setFavorite(false);
  };

  const wrapWithTooltip = (text) => (
    <Tooltip
      title={text}
      sx={{
        tooltip: {
          maxWidth: "none", // Remove the default max-width
          wordWrap: "break-word", // Break long words to fit in the tooltip
        },
      }}
    >
      <span>{text}</span>
    </Tooltip>
  );

  return (
    <Card className="BeerListItem-main-card" key={uuidv4()}>
      <div>
        <CardMedia
          component="img"
          image={myImage}
          alt="Image"
          height="100%"
          style={{ objectFit: "cover" }}
        />
        <CardContent>
          <Typography className="card-text">
            {wrapWithTooltip(cardData.retailer)}
          </Typography>
          <Typography
            className="card-text"
            variant="h6"
            style={{ fontWeight: "bold" }}
          >
            {wrapWithTooltip(cardData.title)}
          </Typography>

          <Typography className="card-text">
            {wrapWithTooltip(cardData.category)}
          </Typography>
        </CardContent>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          {favorite ? (
            <IconButton key={uuidv4()} onClick={handleRemoveFavoriteClick}>
              <FavoriteIcon sx={{ color: "#FF0000" }} />
            </IconButton>
          ) : (
            <IconButton key={uuidv4()} onClick={handleAddFavoriteClick}>
              <FavoriteIcon />
            </IconButton>
          )}
        </div>
      </div>
    </Card>
  );
}

export default CardFlyer;
