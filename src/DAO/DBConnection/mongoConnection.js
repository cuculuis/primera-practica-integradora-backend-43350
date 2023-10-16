import mongoose from "mongoose";

const mongoURI = "mongodb+srv://luisangel96:0pIuW6sqAL77lKiV@primeraentregaint.hs28yfg.mongodb.net/"

export const cliente = mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DB connected");
    })
    .catch((error) => {
        console.log("Error to connect to the DB", error);
    });