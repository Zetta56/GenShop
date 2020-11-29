# GenShop
This is a general-purpose e-commerce app that can be repurposed to fit a specific product type. 
It is built with the MERN stack and uses the [Stripe API](https://stripe.com/docs/api) to handle payments.

# Requirements
1. npm
2. node.js

# Usage
1. Create the following environment variables for your server, either by making a `.env` file or adding them to your deployment settings:

    `ACCESS_KEY` set to any string
    
    `REFRESH_KEY` set to another string
  
    `FRONTEND_URL` set to the client url if client is ran on a separate server (eg. React Development Server). 
   Otherwise, it should be set to the url this project runs on. Used when redirecting from Stripe.
  
    `STRIPE_SECRET` set to the your Stripe account's [secret key](https://stripe.com/docs/keys).
    
    `DATABASEURL` set to your [MongoDB instance's url](https://docs.mongodb.com/guides/server/drivers/).
  
    `ADMIN_USERNAME` set to the desired username of your admin user.
  
    `ADMIN_PASSWORD` set to the desirect password of your admin user.
  
    (Optional) `GOOGLE_CLIENTID` set to your [Google API client ID](https://developers.google.com/identity/one-tap/web/guides/get-google-api-clientid).
    Add this if you want to include Google OAuth2.0 authentication.
  
2. Next, add these environment variables to your client:
    
    `REACT_APP_STRIPE_PUBLISHABLE` set to your Stripe account's [publishable key](https://stripe.com/docs/keys).
    
    (Testing) `REACT_APP_BACKEND_URL` set to your server's url. Set this if you intend to run the client on a React Development Server.
    This url will be used to proxy your requests to the server.
    
    (Optional) `REACT_APP_GOOGLE_CLIENTID` set to your [Google API client ID](https://developers.google.com/identity/one-tap/web/guides/get-google-api-clientid).
    Add this if you want to include Google OAuth2.0 authentication.
    
3. Run `npm install` in your root to add all dependencies. 

4. Run `npm run build` to add your admin user and set up the client.

5. Run `npm start` or `node server.js` to start the server. If you want to start the React Development Server, you can also run `npm start` in the client directory.

Note: You only need to repeat step 5 on subsequent runs.
