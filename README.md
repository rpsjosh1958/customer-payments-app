# Customer Payments Web Application

## Overview
A web application that displays customer payments in a tabular format. Each payment can be viewed to detail in a modal popup.

## Setup
Open `index.html` in a browser.

## Known Issues
### CORS (Cross-Origin Resource Sharing) Issues
- **Blocked by CORS Policy**: If you encounter an error related to being blocked by CORS policy, it means the server does not include the appropriate CORS headers, and the browser blocks the request for security reasons. Therefore not allowing the web app to retrieve the needed data from the API URL.

## Fixing CORS Issues
**Using CORS Anywhere Heroku Link**: If encountering CORS issues, use the `cors-anywhere` Heroku link to bypass the CORS policy. That is; insert "https://cors-anywhere.herokuapp.com/" before the APPI URL. This is only used for development purposes and is just a demo which will have to be reactivated after a certain time. But when using this method the CORS issue was resolved and thus data was retrieved from the API URL.