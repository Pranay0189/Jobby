import { Component } from "react"
import Cookies from "js-cookie"
import { Navigate } from "react-router-dom"

import "./index.css"

class Login extends Component {
  state = {
    username: "",
    errorMsg: "",
    password: "",
    showError: false,
    redirectToHome: false,
  }

  onChangeUsername = (event) => {
    this.setState({ username: event.target.value })
  }

  onChangePassword = (event) => {
    this.setState({ password: event.target.value })
  }

  onSubmitSuccess = (jwtToken) => {
    Cookies.set("jwt_token", jwtToken, { expires: 30 })
    this.setState({ redirectToHome: true })
  }

  onSubmitFailure = (errorMsg) => {
    this.setState({ errorMsg, showError: true })
  }

  submitForm = async (event) => {
    event.preventDefault()

    const { username, password } = this.state
    const userDetails = { username, password }
    const apiUrl = "https://apis.ccbp.in/login"
    const options = {
      method: "POST",
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const { username, redirectToHome, password, showError, errorMsg } =
      this.state
    if (redirectToHome) {
      return <Navigate to="/" />
    }
    return (
      <div className="login-container">
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="login-website-logo"
            alt="website-logo"
          />

          <div className="input-container">
            <label className="input-label" htmlFor="username">
              USERNAME
            </label>
            <input
              autoComplete="off"
              value={username}
              onChange={this.onChangeUsername}
              type="text"
              className="username-input-field"
              id="username"
              placeholder="username"
            />
          </div>

          <div className="input-container">
            <label htmlFor="password" className="input-label">
              PASSWORD
            </label>
            <input
              value={password}
              onChange={this.onChangePassword}
              type="password"
              className="password-input-field"
              id="password"
              placeholder="password"
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default Login
