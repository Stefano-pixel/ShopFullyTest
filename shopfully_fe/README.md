## Versions of technologies used

- NodeJS version: 14.21.1
- ReactJS version: 18.2.0

## How to run the application

1. Download the project by cloning the repository with the command `git clone https://github.com/Stefano-pixel/ShopFullyTest.git`
2. From the directory shopfully_fe run the command `npm install` and wait for all modules to be installed (it may take some time).
3. Run the backend application following the instructions that you can find inside the folder shopfully_be.
4. Run the command `npm start`, which will run the app in the development mode.
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser
  
## Overview of the project

When the application starts, it retrieves the number of flyers available. If there aren't any flyers, then an information popup will appear   
informing the user that there aren't any flyers available. If there are connection problems, then an error popup will appear,   
otherwise the flyers will appear in the form of cards and will be distributed by pages. Each page can contain a maximum of 100 flyers.   
To improve the user experience and performance of the web application the pagination was used, so when the user changes  
the page, new data is fetched from the server.   
In this web application the loading state was managed. Indeed when the application does an api call, a spinner loading is shown   
during the loading period.   
Many components (like the App Bar, the cards, the side windows for the favorite cards etc...) of the application are made   
with Material UI version 5.   
Every card contains an image, the retailer, the title and the category. If one of these titles is too long to be displayed, a tooltip    
is available to show the full title. Every card has a heart button that allows to add that card to the favorite cards. This information   
is stored by default in the local storage, but if the local storage is not supported, it uses cookies as fallback.   
All the cards added to the favorites are available in the side window. To open the side window, just click on the menu icon in the upper left corner.   
By clicking on the heart button of the item shown in the side window, it is possible to remove the item from favorites.



