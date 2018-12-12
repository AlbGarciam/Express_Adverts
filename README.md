# 



## Usage
1. Start mongo at selected port
  ```
    mongod --dbpath ./database/db --port 2703
  ```
2. Start node server 
  ```
  npm run start
  ```
  
# Express_Adverts

This is a sample node.js project which connects with a mongoDB database. It uses mongoose to connect the database and the server.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them
* [nodejs](https://nodejs.org/es)
* [mongoDB](https://docs.mongodb.com/manual/installation)

### Installing

```
npm install
```
Configure the database
```
npm run db
```
Load default values into database
```
npm run fillDatabase
```

## Authors

* **Alberto Garcia** - *Initial work* - [BertoGmFc](https://github.com/BertoGmFc)

## License

This project is licensed under the MIT License
