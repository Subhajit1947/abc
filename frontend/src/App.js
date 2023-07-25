import Home from "./component/Home"
import Navbar from "./component/Navbar";
import {BrowserRouter,Route,Routes} from "react-router-dom"
import Create_todo from "./component/Create_todo";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak123"
import PrivateRoute from "./PrivateRoute";
function App() {
  
  return (
    <ReactKeycloakProvider authClient={keycloak} >
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>}/>
          <Route path="/todo" element={<PrivateRoute><Create_todo/></PrivateRoute>}/>
        </Routes>
      </BrowserRouter>
    </ReactKeycloakProvider>
  );
}

export default App;
