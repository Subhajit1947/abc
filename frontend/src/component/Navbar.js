import React from 'react'
import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { useKeycloak } from "@react-keycloak/web";
function Navbar() {
  const { keycloak, initialized } = useKeycloak();
  console.log(keycloak.authenticated)
  
  return (
    <div style={{
      height: "4rem", display: "flex", flexDirection: "row", justifyContent: "space-between",
      alignItems: "center", margin: "10px", backgroundColor: "#e3e8ea"
    }}>
      
        <>
          <div></div>
          <div></div>
          <div>

            
            {!keycloak.authenticated && (
              <button
                type="button"
                className="text-blue-800"
                onClick={() => keycloak.login()}
              >
                Login
              </button>
            )}

            {!!keycloak.authenticated && (
              <>
              <Link to={'/'}><Button variant="contained">Home</Button></Link>
              <Link to={'/todo'}><Button variant="contained">createlist</Button></Link>
              <button
                type="button"
                className="text-blue-800"
                onClick={() => keycloak.logout()}
              >
                Logout ({keycloak.tokenParsed.preferred_username})
              </button>
              </>
            )}
          </div>
      </> 

    </div>
  )
}

export default Navbar