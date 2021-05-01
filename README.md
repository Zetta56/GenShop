# GenShop

![Home Page](/docs/images/home.PNG)

This is a general-purpose e-commerce app that can be repurposed to fit a specific product type. 
It is built with the MERN stack and uses the [Stripe API](https://stripe.com/docs/api) to handle payments.

# Requirements
1. [npm](https://www.npmjs.com/get-npm)
2. [Node.js](https://nodejs.org/en/download/)
3. Mongo Database(either [local](https://docs.mongodb.com/manual/installation/) or [cloud-based](https://docs.mongodb.com/cloud/))
4. [Stripe Account](https://dashboard.stripe.com/register)
5. [Cloudinary Account](https://cloudinary.com/users/register/free)

# Usage
1. Create the following environment variables for your server, either by making a `.env` file or adding them to your deployment settings:

    `ACCESS_KEY` set to any string. This will be used to authenticate JWT access tokens.
    
    `REFRESH_KEY` set to another string. This will be used to authenticate JWT refresh tokens.
  
    `FRONTEND_URL` set to the client url if client is ran on a separate server (eg. React Development Server). 
   Otherwise, it should be set to the url this project runs on. Used when redirecting from Stripe.
  
    `STRIPE_SECRET` set to the your Stripe account's [secret key](https://stripe.com/docs/keys). Used to create stripe checkout sessions.
    
    `DATABASEURL` set to your [MongoDB instance's URI](https://docs.mongodb.com/guides/server/drivers/).
    
    `CLOUDINARY_URL` set to your Cloudinary account's API Environment variable, found on your dashboard. Used to identify your account to Cloudinary's api.
    
    `CLOUDINARY_FOLDER` set to the folder you want your images to go to on your Cloudinary account. 
    Before you do this, make sure to create the actual folder under the media library tab.
  
    `ADMIN_USERNAME` set to the desired username of your admin user.
  
    `ADMIN_PASSWORD` set to the desirect password of your admin user.
  
    (Optional) `GOOGLE_CLIENTID` set to your [Google API client ID](https://developers.google.com/identity/one-tap/web/guides/get-google-api-clientid).
    Add this if you want to include Google OAuth2.0 authentication.
  
2. Next, add these environment variables to your client:
    
    `REACT_APP_STRIPE_PUBLISHABLE` set to your Stripe account's [publishable key](https://stripe.com/docs/keys). Used to load the stripe client.
    
    (Testing) `REACT_APP_BACKEND_URL` set to your server's url if you intend to run the client on the React Development Server.
    This url will be used to proxy http requests to the server.
    
    (Optional) `REACT_APP_GOOGLE_CLIENTID` set to your [Google API client ID](https://developers.google.com/identity/one-tap/web/guides/get-google-api-clientid).
    Add this if you want to include Google OAuth2.0 authentication.
    
3. Run `npm install` in the root directory to add all server dependencies. 

4. Run `npm run build` to add your admin user and set up the client.

5. Run `npm start` or `node server.js` to start the server. If you want to start the React Development Server, you can also run `npm start` in the client directory.

Note: You only need to repeat step 5 on subsequent runs.
