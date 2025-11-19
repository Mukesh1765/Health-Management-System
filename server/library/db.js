import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () =>
            console.log("connected to database")
        );
        await mongoose.connect(
            "mongodb+srv://Mukesh_Sai:Mukesh%402006@cluster0.upla3uf.mongodb.net/health-management-system?retryWrites=true&w=majority&appName=Cluster0"
        );
    } catch (error) {
        console.log(error.message);
    }
};
