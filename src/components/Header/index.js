import React from "react"
import Cookies from "js-cookie"
import { Link } from "react-router-dom"
import { IoHomeOutline } from "react-icons/io5"
import { HiOutlineBriefcase } from "react-icons/hi"
import { LuLogOut } from "react-icons/lu"
import { useNavigate } from "react-router-dom"
import "./index.css"

const Header = () => {
  const navigate = useNavigate()

  const logout = () => {
    Cookies.remove("jwt_token")
    navigate("/login")
  }

  return (
    <div className="nav-header">
      <div className="nav-content">
        <div className="nav-bar-mobile-logo-container">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              className="website-logo"
              alt="logo"
            />
          </Link>

          <ul className="nav-bar-mobile-icons-container">
            <li>
              <Link to="/">
                <IoHomeOutline className="nav-item-mobile-link" />
              </Link>
            </li>

            <li>
              <Link to="/jobs">
                <HiOutlineBriefcase className="nav-item-mobile-link" />
              </Link>
            </li>

            <li>
              <button className="nav-mobile-btn" type="button" onClick={logout}>
                <LuLogOut />
              </button>
            </li>
          </ul>
        </div>

        <div className="nav-bar-large-container">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              className="website-logo"
              alt="logoo"
            />
          </Link>

          <ul className="nav-menu">
            <li className="nav-menu-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>

            <li className="nav-menu-item">
              <Link to="/jobs" className="nav-link">
                Jobs
              </Link>
            </li>
          </ul>

          <button type="button" className="logout-desktop-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
export default Header
