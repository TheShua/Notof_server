const mongoose = require('mongoose');

mongoose
    .connect(process.env.MONGO_DB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }
    ).then((response) => {
        console.log("The DB connection succeed to " + response.connection.name)
    }).catch((err) => {
        console.log("An error occurred during the DB connection")
    });