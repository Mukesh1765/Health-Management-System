import Patient from "../components/Patient";
import Doctor from "../components/Doctor";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Role = () => {
    const { role } = useContext(AuthContext);

    if (role === "doctor") {
        return <Doctor />;
    }
    return <Patient />;
};

export default Role;
