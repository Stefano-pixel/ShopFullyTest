import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { fetchCardsPerPage } from "../../services/flyerServices";
import CardFlyer from "../card-flyer/CardFlyer";
import Popup from "../popup/Popup";
import labels from "../../constants/labels";
import CircularProgress from "@mui/material/CircularProgress";

function CardsPage({ pageNumber, cardsPerPage }) {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState([false, ""]);
  useEffect(() => {
    // Set loading state to true before fetching data
    setIsLoading(true);

    // Call API to get number of cards and set the state
    const fetchData = async () => {
      try {
        const data = await fetchCardsPerPage(pageNumber, cardsPerPage);
        setCards(data);
        setIsLoading(false); // Update loading state
      } catch (error) {
        console.error(error);
        setIsError([true, error.message]);
        setIsLoading(false); // Update loading state
      }
    };
    fetchData();
  }, [pageNumber, cardsPerPage]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </div>
      ) : isError[0] ? (
        <Popup
          title={labels.ERROR_POPUP.title}
          severity={labels.ERROR_POPUP.severity}
          message={isError[1]}
          nameButton={labels.ERROR_POPUP.nameButton}
        />
      ) : (
        cards.map((card) => (
          <CardFlyer
            key={uuidv4()}
            cardData={card}
            className="card"
          ></CardFlyer>
        ))
      )}
    </div>
  );
}

export default CardsPage;
