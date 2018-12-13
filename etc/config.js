
module.exports = {
    port: 8080,
    mongoPath: "127.0.0.1",
    mongoPort: 2703,
    mongoDB: "Express_Adverts",
    jwt: {
        signOptions : {
            expiresIn:  "5s",
            algorithm:  "RS256"
        }
    }
};
