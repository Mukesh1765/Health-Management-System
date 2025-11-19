import { createBrowserRouter } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Error from "./pages/Error";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Role from "./pages/Role";
import Signup from "./pages/Signup";
import RoleLayout from "./components/RoleLayout";

// Patient Pages
import PatientAppointments from "./pages/PatientAppointments";
import BookAppointment from "./pages/BookAppointment";
import Doctors from "./pages/Doctors";
import Profile from "./pages/Profile";

// Doctor Pages
import DoctorDashboard from "./components/Doctor";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorConsultation from "./pages/DoctorConsultation";
import DoctorProfile from "./pages/DoctorProfile";
import Medicines from "./pages/Medicines";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <RoleLayout />,
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: <Home />,
            },

            // --------------------------
            // PUBLIC ROUTES
            // --------------------------
            {
                path: "signup",
                element: <Signup />,
                action: async ({ request }) => {
                    const formData = await request.formData();
                    const name = formData.get("name");
                    const email = formData.get("email");
                    const password = formData.get("password");
                    const confirmPassword = formData.get("confirmPassword");
                    const phone = formData.get("phone");
                    const role = formData.get("role");

                    if (password !== confirmPassword) {
                        return {
                            success: false,
                            message: "Passwords do not match",
                        };
                    }

                    return {
                        success: true,
                        credentials: { name, email, password, phone, role },
                    };
                },
            },
            {
                path: "login",
                element: <Login />,
                action: async ({ request }) => {
                    const formData = await request.formData();
                    const email = formData.get("email");
                    const password = formData.get("password");

                    return { success: true, credentials: { email, password } };
                },
            },

            // --------------------------------
            // PROTECTED ROUTES (AUTH REQUIRED)
            // --------------------------------
            {
                element: <ProtectedRoutes />,
                children: [
                    {
                        path: "role",
                        element: <RoleLayout />,
                        children: [
                            {
                                index: true,
                                element: <Role />,
                            },
                            {
                                path: "appointments",
                                children: [
                                    {
                                        index: true,
                                        element: <PatientAppointments />,
                                    },
                                    { path: "doctors", element: <Doctors /> },
                                    {
                                        path: "book-appointment/:doctorId",
                                        element: <BookAppointment />,
                                    },
                                ],
                            },

                            {
                                path: "profile",
                                element: <Profile />,
                                action: async ({ request }) => {
                                    const formData = await request.formData();
                                    const data = {};

                                    formData.forEach((v, k) => {
                                        try {
                                            data[k] = JSON.parse(v);
                                        } catch {
                                            data[k] = v;
                                        }
                                    });

                                    return { success: true, data };
                                },
                            },
                        ],
                    },

                    // --------------------------
                    // DOCTOR ROUTES
                    // --------------------------
                    {
                        path: "doctor",
                        element: <RoleLayout />,
                        children: [
                            {
                                index: true,
                                element: <DoctorDashboard />, // FIXED
                            },
                            {
                                path: "dashboard",
                                element: <DoctorDashboard />, // FIXED
                            },
                            {
                                path: "appointments",
                                element: <DoctorAppointments />,
                            },
                            {
                                path: "appointments/:id",
                                element: <DoctorConsultation />,
                            },
                            {
                                path: "profile",
                                element: <DoctorProfile />,
                            },
                        ],
                    },

                    // --------------------------
                    // GLOBAL PAGES FOR BOTH ROLES
                    // --------------------------
                    {
                        path: "medicines",
                        element: <Medicines />,
                    },
                ],
            },
        ],
    },
]);

export default routes;
