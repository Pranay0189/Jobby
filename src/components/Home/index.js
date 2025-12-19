import React from "react"
import { Link } from "react-router-dom"
import Header from "../Header"
import "./index.css"

const Home = () => {
  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-heading">
            Find The Job That Fits You The Best...
          </h1>
          <p className="home-description">
            Millions of people are searching for jobs, salary informations,
            company, reviews. Find the job that fits your abilities and
            potential
          </p>

          <Link to="/jobs">
            <button type="button" className="jobs-btn">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}
export default Home
