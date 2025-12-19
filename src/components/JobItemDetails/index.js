import React from "react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Cookies from "js-cookie"
import { TailSpin } from "react-loader-spinner"
import { BsFillBriefcaseFill, BsStarFill } from "react-icons/bs"
import { BiLinkExternal } from "react-icons/bi"
import { MdLocationOn } from "react-icons/md"

import Header from "../Header"
import SimilarJobItem from "../SimilarJobItem"
import SkillsCard from "../SkillsCard"

import "./index.css"

const apiStatusConstants = {
  initial: "INITIAL",
  failure: "FAILURE",
  success: "SUCCESS",
  inProgress: "IN_PROGRESS",
}

const JobItemDetails = () => {
  const { id } = useParams()
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [similarJobsData, setSimilarJobsData] = useState([])
  const [jobData, setJobData] = useState({})

  useEffect(() => {
    const getJobData = async () => {
      setApiStatus(apiStatusConstants.inProgress)
      const jwtToken = Cookies.get("jwt_token")
      const url = `https://apis.ccbp.in/jobs/${id}`
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: "GET",
      }

      try {
        const response = await fetch(url, options)
        if (response.ok) {
          const data = await response.json()
          const updatedData = getFormattedData(data.job_details)
          const updatedSimilarJobsData = data.similar_jobs.map((eachItem) =>
            getFormattedSimilarData(eachItem)
          )
          setJobData(updatedData)
          setSimilarJobsData(updatedSimilarJobsData)
          setApiStatus(apiStatusConstants.success)
        } else {
          setApiStatus(apiStatusConstants.failure)
        }
      } catch (error) {
        setApiStatus(apiStatusConstants.failure)
      }
    }

    getJobData()
  }, [id])

  const getFormattedSimilarData = (data) => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  const getFormattedData = (data) => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    rating: data.rating,
    title: data.title,
    packagePerAnnum: data.package_per_annum,
    skills: data.skills.map((eachItem) => ({
      imageUrl: eachItem.image_url,
      name: eachItem.name,
    })),
  })

  const renderFailureView = () => (
    <div className="job-item-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="job-item-failure-img"
        alt="failure view"
      />
      <h1 className="job-item-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="jon-item-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="job-item-failure-button"
        onClick={() => window.location.reload()} // Retry by reloading the page
        data-testid="button"
      >
        Retry
      </button>
    </div>
  )

  const renderLoadingView = () => (
    <div className="job-item-loader-container" data-testid="loader">
      <TailSpin color="blue" height="50" width="50" />
    </div>
  )

  const renderJobDetailsView = () => {
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      lifeAtCompany,
      skills,
    } = jobData

    const { description, imageUrl } = lifeAtCompany

    return (
      <div className="job-details-view-container">
        <div className="job-item">
          <div className="logo-title-location-container">
            <div className="logo-title-container">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="company-logo"
              />
              <div className="title-rating-container">
                <h1 className="title-heading">{title}</h1>
                <div className="rating-container">
                  <BsStarFill className="rating-icon" />
                  <p className="rating-heading">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-package-container">
              <div className="location-employee-container">
                <div className="location-container">
                  <MdLocationOn className="location-icon" />
                  <p className="location-heading">{location}</p>
                </div>
                <div className="employee-type-container">
                  <BsFillBriefcaseFill className="brief-case-icon" />
                  <p className="employee-type-heading">{employmentType}</p>
                </div>
              </div>
              <p className="package-heading">{packagePerAnnum}</p>
            </div>
          </div>
          <hr className="line" />
          <div className="description-visit-container">
            <h1 className="description-heading">Description</h1>
            <div className="visit-container">
              <a href={companyWebsiteUrl} className="visit-heading">
                Visit
              </a>
              <BiLinkExternal className="visit-icon" />
            </div>
          </div>
          <p className="description-text">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list-container">
            {skills.map((eachItem) => (
              <SkillsCard skillDetails={eachItem} key={eachItem.name} />
            ))}
          </ul>
          <h1 className="life-at-company-heading">Life at Company</h1>
          <div className="life-at-company-description-image-container">
            <p className="life-at-company-description">{description}</p>
            <img
              src={imageUrl}
              className="life-at-company-image"
              alt="life at company"
            />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobsData.map((eachItem) => (
            <SimilarJobItem jobDetails={eachItem} key={eachItem.id} />
          ))}
        </ul>
      </div>
    )
  }

  const renderJobDetails = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderJobDetailsView()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  return (
    <>
      <Header />
      <div className="job-item-details-container">{renderJobDetails()}</div>
    </>
  )
}

export default JobItemDetails
