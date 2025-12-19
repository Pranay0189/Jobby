import React from "react"
import { Component } from "react"
import { TailSpin } from "react-loader-spinner"
import Cookies from "js-cookie"
import "./index.css"
const apistatusConstants = {
  initial: "INITIAL",
  failure: "FAILURE",
  success: "SUCCESS",
  inProgress: "IN_PROGRESS",
}

class ProfileDetails extends Component {
  state = {
    profileData: [],
    apiStatus: apistatusConstants.initial,
  }

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
    this.setState({ apiStatus: apistatusConstants.inProgress })

    const token = Cookies.get("jwt_token")
    const apiUrl = "https://apis.ccbp.in/profile"
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const profileData = {
        name: data.profile_details.name,
        imageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({ apiStatus: apistatusConstants.success, profileData })
    } else {
      this.setState({ apiStatus: apistatusConstants.failure })
    }
  }

  renderProfileView = () => {
    const { profileData } = this.state
    const { name, imageUrl, shortBio } = profileData
    return (
      <div className="profile-success-container">
        <img src={imageUrl} className="profile-img" alt="profile" />
        <h1 className="profile-heading">{name}</h1>
        <p className="profile-desc">{shortBio}</p>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container">
      <TailSpin height="40" width="40" color="blue" radius="1" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <button
        type="button"
        className="failure-btn"
        id="button"
        onClick={this.getProfile}
      >
        Retry
      </button>
    </div>
  )

  render() {
    const { apiStatus } = this.state

    switch (apiStatus) {
      case apistatusConstants.success:
        return this.renderProfileView()
      case apistatusConstants.failure:
        return this.renderFailureView()
      case apistatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}
export default ProfileDetails
