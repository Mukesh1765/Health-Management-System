import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import usePresence from "./assets/UsePresence";

export default function App() {
    usePresence();
    return <RouterProvider router={routes} />;
}

