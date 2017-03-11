# Voting App

User Stories :

* Authentication
    * Sign up 
      I can sign up by specifying my `name`, `password`.  
      If the username is already in the database, I get an error.  
      Once the account is successfully created, I'm automatically logged in.

    * Logout
    * Sign in
        I can sign in using the username and password I used to sign up  
        or I can sign in using my github account

* As an authenticated user
    * I can create a poll  
        I can add from 2 to 30 choices

    * The poll is saved in the database  
        I can come back later to access it using its url

          /poll/<poll.id>

    * I can see the aggregate results of my polls
    * I can delete polls that I decide I don't want anymore

* As an unauthenticated or authenticated user
    * I can see and vote on everyone's polls
    * I can see the results of polls in chart form.
    * (only if auth) if I don't like the options on a poll, I can create a new option

https://fcc-voting-arthow4n.herokuapp.com/polls  
http://votingapp.herokuapp.com