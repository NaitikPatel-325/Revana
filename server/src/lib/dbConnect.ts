import mongoose from "mongoose";
export const dbConnect = async () => {
    try{
        await mongoose.connect("mongodb+srv://prajapatihet52:toSUK71vDTkL68iF@jscribecluster.mxchz.mongodb.net/",{
            dbName : "Revana",
        });
        console.log("connection established");
    } catch(error){
        console.log("error connecting to database");
    }
}