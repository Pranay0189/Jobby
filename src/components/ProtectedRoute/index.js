import { Navigate } from "react-router-dom"
import Cookie from "js-cookie"

const ProtectedRoute = ({ element, ...rest }) => {
  const token = Cookie.get("jwt_token")

  if (token === undefined) {
    return <Navigate to="/login" />
  }

  return element // Render the protected element if authenticated
}

export default ProtectedRoute
