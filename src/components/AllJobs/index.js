import React from "react"
import { Component } from "react"
import Loader from "react-loader-spinner"
import Cookies from "js-cookie"
import { AiOutLineSearch } from "react-icons/ai"
import Header from "../Header"
import JobItem from "../JobItem"
import "./index.css"

const employmentTypesList = [
  {
    label: "Full Time",
    employmentTypeId: "FULLTIME",
  },
  {
    label: "Part Time",
    employmentTypeId: "PARTTIME",
  },
  {
    label: "Freelance",
    employmentTypeId: "FREELANCE",
  },
  {
    label: "Internship",
    employmentTypeId: "INTERNSHIP",
  },
]

const salaryRangesList = [
  {
    salaryRangeId: "1000000",
    label: "10 LPA and above",
  },
  {
    salaryRangeId: "2000000",
    label: "20 LPA and above",
  },
  {
    salaryRangeId: "3000000",
    label: "30 LPA and above",
  },
  {
    salaryRangeId: "4000000",
    label: "40 LPA and above",
  },
]

const apiStatusConstants = {
  initial: "INITIAL",
  failure: "FAILURE",
  success: "SUCCESS",
  inProgress: "IN_PROGRESS",
}

const apiJobsStatusConstants = {
  initial: "INITIAL",
  failure: "FAILURE",
  success: "SUCCESS",
  inProgress: "IN_PROGRESS",
}

const falureViewImage =
  "https://assets.ccbp.in/frontend/react-js/failure-img.png"

class AllJobs extends Component {
  state = {
    profileData: [],
    jobsData: [],
    checkBoxInputs: [],
    radioInputs: "",
    searchInput: "",
    apiStatus: apiStatusConstants.initial,
    apiJobsStatus: apiJobsStatusConstants.initial,
  }

  componentDidMount = () => {
    this.onGetProfileDetails()
    this.onGetJobDetails()
  }

  onGetProfileDetails = async () => {
    this.setState({ apiStatus: apiStatusConstants.inProgress })
    const jwtToken = Cookies.get("jwt_token")
    const profileApiUrl = "https://apis.ccbp.in/profile"
    const optionsProfile = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: "GET",
    }
    const responseProfile = await fetch(profileApiUrl, optionsProfile)

    if (responseProfile.ok === true) {
      const fetchedDataProfile = [await responseProfile.json()]
      const updatedDataProfile = fetchedDataProfile.map((eachItem) => ({
        name: eachItem.profile_details.name,
        profileImageUrl: eachItem.profile_details.profile_image_url,
        shortBio: eachItem.profile_details.short_bio,
      }))
      this.setState({
        profileData: updatedDataProfile,
        responseSuccess: true,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({ apiStatus: apiStatusConstants.failure })
    }
  }

  onGetJobDetails = async () => {
    this.setState({ apiJobsStatus: apiJobsStatusConstants.inProgress })
    const jwtToken = Cookies.get("jwt_token")
    const { checkBoxInputs, radioInputs, searchInput } = this.state
    const jobsApiUrl = `https://apic.ccbp.in/jobs?employment_type=${checkBoxInputs}&minimum_package=${radioInputs}&search=${searchInput}`
    const optionsJob = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: "GET",
    }
    const responseJobs = await fetch(jobsApiUrl, optionsJob)
    if (responseJobs.ok === true) {
      const fetchedDataJobs = await responseJobs.json()
      const updatedDataJobs = fetchedDataJobs.jobs.map((eachItem) => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobsData: updatedDataJobs,
        apiJobsStatus: apiJobsStatusConstants.success,
      })
    } else {
      this.setState({ apiJobsStatus: apiJobsStatusConstants.failure })
    }
  }

  onGetRadioOption = (event) => {
    this.setState({ radioInputs: event.target.id }, this.onGetJobDetails)
  }

  onGetInputOptions = (event) => {
    const { checkBoxInputs } = this.state
    const inputNotInList = checkBoxInputs.filter(
      (eachItem) => eachItem === event.target.id
    )
    if (inputNotInList.length === 0) {
      this.setState(
        (prevState) => ({
          checkBoxInputs: [...prevState.checkBoxInputs, event.target.id],
        }),
        this.onGetJobDetails
      )
    } else {
      const filteredData = checkBoxInputs.filter(
        (eachItem) => eachItem !== event.target.id
      )
      this.seState(
        (prevState) => ({ checkBoxInputs: filteredData }),
        this.onGetJobDetails
      )
    }
  }

  onGetProfileView = () => {
    const { profileData, responseSuccess } = this.state
    if (responseSuccess) {
      const { name, profileImageUrl, shortBio } = profileData[0]
      return (
        <div className="profile-container">
          <img src={profileImageUrl} className="profile-icon" alt="profile" />
          <h1 className="profile-name">{name}</h1>
          <p className="profile-description">{shortBio}</p>
        </div>
      )
    }
    return null
  }

  onRetryProfile = () => {
    this.onGetProfileDetails()
  }

  onGetProfileFailureView = () => (
    <div className="failure-button-container">
      <button
        className="failure-button"
        type="button"
        onClick={this.onRetryProfile}
      >
        retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onRenderProfileStatus = () => {
    const { apiStatus } = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onGetProfileView()
      case apiStatusConstants.failure:
        return this.onGetProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
  onRetryJobs = () => {
    this.onGetJobDetails()
  }

  onGetJobsFailureView = () => (
    <div className="failure-img-button-container">
      <img className="failure-img" src={falureViewImage} alt="failure view" />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-paragraph">
        we cannot seem to find the page you are looking for
      </p>
      <div className="jobs-failure-button-container">
        <button
          className="failure-button"
          type="button"
          onClick={this.onRetryJobs}
        >
          retry
        </button>
      </div>
    </div>
  )

  onGetJobsView = () => {
    const { jobsData } = this.state
    const noJobs = jobsData.length === 0
    return noJobs ? (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-jons-img"
          alt="no jobs"
        />
        <h1>No jobs found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    ) : (
      <ul className="ul-job-item-container">
        {jobsData.map((eachItem) => (
          <JobItem key={eachItem.id} jobData={eachItem} />
        ))}
      </ul>
    )
  }

  onRenderJobStatus = () => {
    const { apiJobsStatus } = this.state

    switch (apiJobsStatus) {
      case apiJobsStatusConstants.success:
        return this.onGetJobsView()
      case apiJobsStatusConstants.failure:
        return this.onGetJobsFailureView()
      case apiJobsStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onGetChechBokexView = () => (
    <ul className="check-boxex-container">
      {employmentTypesList.map((eachItem) => (
        <li className="li-container" key={eachItem.employmentTypeId}>
          <input
            className="input"
            type="chechbox"
            onChange={this.onGetInputOptions}
            id={eachItem.employmentTypeId}
          />
          <label className="label" htmlFor={eachItem.employmentTypeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onGetRadioButtonsView = () => (
    <ul className="radio-buttons-container">
      {salaryRangesList.map((eachItem) => (
        <li className="li-container" key={eachItem.salaryRangeId}>
          <input
            type="radio"
            className="radio"
            id={eachItem.salaryRangeId}
            name="option"
            onChange={this.onGetRadioOption}
          />
          <llabel className="label" htmlFor={eachItem.salaryRangeId}>
            {eachItem.label}
          </llabel>
        </li>
      ))}
    </ul>
  )

  onEnterSearchInput = (event) => {
    if (event.key === "Enter") {
      this.onGetJobDetails()
    }
  }

  onGetSearchInput = (event) => {
    this.setState({ searchInput: event.target.value })
  }

  onSubmitSearchInput = () => {
    this.onGetJobDetails()
  }

  render() {
    const { searchInput } = this.state

    return (
      <>
        <Header />
        <div className="all-jobs-container">
          <div className="side-bar-container">
            {this.onRenderProfileStatus()}
            <hr className="hr-line" />
            <h1 className="text">Type of Employment</h1>
            {this.onGetChechBokexView()}
            <hr className="hr-line" />
            <h1 className="texr">salary Range</h1>
            {this.onGetRadioButtonsView()}
          </div>

          <div className="jobs-container">
            <div>
              <input
                type="search"
                className="search-input"
                onChange={this.onGetSearchInput}
                onKeyDown={this.onEnterSearchInput}
                value={searchInput}
              />
              <button
                data-testid="searchButton"
                type="button"
                className="search-button"
                onClick={this.onSubmitSearchInput}
              >
                {" "}
                <AiOutLineSearch className="search-icon" />
              </button>
            </div>
            {this.onRenderJobStatus()}
          </div>
        </div>
      </>
    )
  }
}
export default AllJobs
