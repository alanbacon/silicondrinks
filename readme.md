

# To Deploy

```
cd ./app
npm install
npm run www-build-devel

cd ..
docker build -t eu.gcr.io/silicon-rhino-drinks/drinks_app ./

gcloud config set project silicon-rhino-drinks
docker push eu.gcr.io/silicon-rhino-drinks/drinks_app
```

# To Run Locally

Two terminals needed
```
cd ./app
npm install
npm run www-build-devel
```

```
cd ./app
npm run server
```

OR After following the deployment steps:

```
docker run -p 80:80 --name drinks_app_container eu.gcr.io/silicon-rhino-drinks/drinks_app 
```

# Current Deployment

[http://silicondrinks.alanbacon.dev](http://silicondrinks.alanbacon.dev)
or
[34.89.31.82](http://34.89.31.82)


# Features Implemented

 - Login as a user (without any authentication)
 - Add comments to events as that user.

# Compromises:

The focus was on creating a deployed system capable of leaving comments, in doing so there were a number of compromises, to name a few:

 - used an in memory mongo db => no persistence between instances
 - no tests written
 - no proper NGINX or apache server (and therefore no SSL termination)
 - the schema often uses the name field as the unique (primary) key,
 - database interactions are not very efficient, I usually like to group together requests into a `bulk` command.
 - API endpoints have very little validation.
 - Can only import events from upstream system once because the merge operation for a single event will be quite complicated.
 - Could have used websockets to update the page automatically when someone else leaves a comment.
 

