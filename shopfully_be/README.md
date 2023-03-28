## Versions of technologies used

- NodeJS version: 14.21.1

## How to run the application

1. Download the project running the command `git clone https://github.com/Stefano-pixel/ShopFullyTest.git`
2. From the directory shopfully_be run the command `npm install` and wait for all modules to be installed (it may take some time)
3. There are 3 options to run the application:
   - run the command `npm start`, which will start the server (in this case on port 3002)
   - run the command `npm run dev`, which will run the app in the development mode (in this case on port 3002)
   - run the command `npm test`, which will run the tests

## Overview of the project

The NodeJS application exposes 2 rest API: 
   - http://localhost:3002/api/flyers/number, which returns the number of rows of the CSV, where the start_date of every row 
     is older than the current date, the end_date is a later date than the current one and is_published equals to 1.
     Specifically, it returns an object of this type: { "flyers": 300 }.
   - An example of the second API is http://localhost:3002/api/flyers?page=1&limit=100, which returns a list of the first 100 
     objects, where each object is generated from a row in the csv file. Also, in this case the start_date of every object 
     is older than the current date, the end_date is a later date than the current one and is_published equals to 1.
     If in the csv there are 101 rows then the api http://localhost:3002/api/flyers?page=2&limit=100 returns only the 101th flyer.
     If in the csv there are 100 rows then the api http://localhost:3002/api/flyers?page=2&limit=100 returns an empty list. 

In this project streams were used to analyze and transform the csv data so that the system can be scalable and efficient.

### Note
The original file CSV ('flyers_data.csv') provided to me, contains outdated flyers. To fix this problem, I created a function
(createValidRowsInCsv, in flyerUtils.js module) that takes as input the file path of the csv and a range of rows to modify.
The goal of this function is to update the dates of the flyers, so that the start_date is one month older than the current date,
the end_date is one month later than the current date and is_published equals to 1.   
This method is executed before every test to avoid errors due to expired dates.     
In the folder there is the file modifyCsv.js that "fixes" the first 801 rows. To execut it, just run the command `node .\modifyCsv.js`   
in the shopfully_be folder.
