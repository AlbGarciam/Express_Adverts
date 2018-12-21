  
# NodePop

This is a sample node.js project which connects with a mongoDB database. It uses mongoose to connect the database and the server.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them
* [nodejs](https://nodejs.org/es) - v10.14.1
* [mongoDB](https://docs.mongodb.com/manual/installation) - v4.0.1


### Installing
Install all dependencies of the project.
```
npm install
```

Configure the database. Executing this command will start a MongoDB database at port 2703. You can find the entire configuration in [configuration file](https://github.com/AlbGarciam/Express_Adverts/blob/master/etc/mongo.conf)
```
npm run db
```

Load default values into database
```
npm run fillDatabase
```

Start the cluster
```
npm run cluster
```

### Configuration
#### **Important** 
It is neccessary to replace the private.key and the public.pem files if you are going to use it in a production environment. For testing purposes, you can generate your own keys using [http://travistidwell.com/jsencrypt/demo/](http://travistidwell.com/jsencrypt/demo/)

## Authors

* **Alberto Garcia** - *Initial work* - [AlbGarciam](https://github.com/AlbGarciam)

## License

This project is licensed under the MIT License
