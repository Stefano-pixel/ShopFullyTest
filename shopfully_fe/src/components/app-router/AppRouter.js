import { v4 as uuidv4 } from "uuid";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMemo } from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import ReactPaginate from "react-paginate";
import FavCardsPage from "../favourite-cards-page/FavCardsPage";
import CardsPage from "../cards-page/CardsPage";
import labels from "../../constants/labels";
import "./AppRouter.css";

function AppRouter({ numCards, numCardsPerPage }) {
  const navigate = useNavigate();
  const numPages = useMemo(
    () => Math.ceil(numCards / numCardsPerPage),
    [numCards, numCardsPerPage]
  );
  const [menuOpen, setMenuOpen] = useState(false);

  //Generate an array of Routes for each page
  const cardRoutes = useMemo(() => {
    // Generate an array of page numbers
    const pageNumbers = [...Array(numPages).keys()].map((i) => i + 1);
    return pageNumbers.map((page) => {
      if (page === 1)
        return (
          <Route
            key={uuidv4()}
            path={"/"}
            element={
              <CardsPage pageNumber={page} cardsPerPage={numCardsPerPage} />
            }
          />
        );
      return (
        <Route
          key={uuidv4()}
          exact
          path={`/${page}`}
          element={
            <CardsPage pageNumber={page} cardsPerPage={numCardsPerPage} />
          }
        />
      );
    });
  }, [menuOpen, numCards, numCardsPerPage]);

  const handleButtonClick = (path) => {
    navigate(path);
  };

  const handleMenuOpen = (event) => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // Make the container full height
      }}
    >
      <AppBar position="sticky" className="full-width-appbar">
        <Toolbar>
          <IconButton
            key={uuidv4()}
            onClick={handleMenuOpen}
            edge="start"
            sx={{ color: "white" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, color: "white" }}
          >
            ShopFully
          </Typography>
        </Toolbar>
      </AppBar>

      <FavCardsPage menuOpen={menuOpen} onMenuClose={handleMenuClose} />

      <Box
        flexGrow={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Routes>
          {cardRoutes}
          <Route
            key={uuidv4()}
            exact
            path="/favorite"
            element={<FavCardsPage />}
          />
        </Routes>
      </Box>

      <Box py={2}>
        <ReactPaginate
          pageCount={numPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={(data) => {
            const selectedPage = data.selected;
            handleButtonClick(
              selectedPage === 0 ? "/" : `/${selectedPage + 1}`
            );
          }}
          containerClassName={"pagination"}
          activeClassName={"active"}
          previousLabel={labels.PAGINATE_REACT.previousButton}
          nextLabel={labels.PAGINATE_REACT.nextButton}
        />
      </Box>
    </div>
  );
}

export default AppRouter;
