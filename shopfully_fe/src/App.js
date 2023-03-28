import { useState, useEffect } from "react";
import Popup from "./components/popup/Popup";
import labels from "./constants/labels";
import { fetchNumberOfFlyers } from "./services/flyerServices";
import AppRouter from "./components/app-router/AppRouter";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function App() {
  const [numCards, setNumCards] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState([false, ""]);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    // Call API to get number of cards and set the state
    const fetchData = async () => {
      try {
        const data = await fetchNumberOfFlyers();
        setNumCards(data && data.flyers);
        setIsLoading(false);
        setIsError(false);
        if (data.flyers === 0) setIsEmpty(true);
      } catch (error) {
        setIsError([true, error.message]);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh", // Make the container full height
          }}
        >
          <Box
            flexGrow={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <CircularProgress />
          </Box>
        </div>
      ) : isError[0] ? (
        <Popup
          title={labels.ERROR_POPUP.title}
          severity={labels.ERROR_POPUP.severity}
          message={isError[1]}
          nameButton={labels.ERROR_POPUP.nameButton}
        />
      ) : isEmpty ? (
        <Popup
          title={labels.EMPTY_RESPONSE_POPUP.title}
          severity={labels.EMPTY_RESPONSE_POPUP.severity}
          message={labels.EMPTY_RESPONSE_POPUP.message}
          nameButton={labels.EMPTY_RESPONSE_POPUP.nameButton}
        />
      ) : (
        <AppRouter numCards={numCards} numCardsPerPage={100} />
      )}
    </div>
  );
}

export default App;
