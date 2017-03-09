# Build a Voting App

User Stories :

* Authentication
    * Sign up  
      I can sign up by specifying my `name`, `email`, `password`.  
      If the username is already in the database, I get an error.
      Once the account is successfully created, I'm automatically logged in.

    * Logout
    * Sign in
        I can sign in using the email and password I used to sign up  
        or I can sign in using my github account

* As an authenticated user
    * I can create a poll  
        The name of the poll is unique per user  
        I can add any number of choices

    * The poll is saved in the database  
        I get a feedback to share the poll  
        I come back later to access it using its url

          Congratulations! Your poll has been posted to http://<url>/<user.id>/<pollname>

    * I can see the aggregate results of my polls
    * I can delete polls that I decide I don't want anymore

* As an unauthenticated or authenticated user
    * I can see and vote on everyone's polls
    * I can see the results of polls in chart form. (This could be implemented using Chart.js or Google Charts.)
    * (only if auth) if I don't like the options on a poll, I can create a new option
    
http://votingapp.herokuapp.com