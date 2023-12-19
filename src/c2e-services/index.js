import React, { useEffect, useState } from "react"
import "./style.css"
import navigationIcon from "../assets/navigation-icon.svg"
import searchIcon from "../assets/search-icon.svg"
import crossIcon from "../assets/cross-icon.svg"
import plusIcon from "../assets/plus-icon.svg"
import minusIcon from "../assets/minus-icon.svg"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import Accordion from "react-bootstrap/Accordion"

const C2eServices = () => {
  const [licensedData, setLicensedData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [openAccordion, setOpenAccordion] = useState(null)
  const [filteredData, setFilteredData] = useState([])

  const host = "."

  const handleAccordionToggle = (eventKey) => {
    setOpenAccordion(openAccordion === eventKey ? null : eventKey)
  }

  useEffect(() => {
    initLoadC2eMedia()
  }, [])

  const deleteList = async (ceelisting_id) => {
    try {
      const ok = window.confirm(
        "WARNING!! It will remove All Licenses and ALL C2Es for this Listing. Continue?"
      )

      if (ok) {
        await axios.delete(host + `/c2e-listings/${ceelisting_id}`)
        window.alert("Listing deleted successfully!")
        initLoadC2eMedia()
      }
    } catch (error) {
      console.error("Error deleting listing:", error)
      window.alert("Error deleting listing.")
    }
  }

  const initLoadC2eMedia = async () => {
    try {
      const response = await axios.get(host + "/c2e-listings/manage")
      const data = response.data

      setLicensedData(data)

      if (data.length === 0) {
        console.log("empty data received")
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const filterData = (data, term) => {
    const lowerCaseSearchTerm = term.toLowerCase()
    return data.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerCaseSearchTerm) &&
        item.parentid !== null
    )
  }

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value
    setSearchTerm(newSearchTerm)
    setFilteredData(filterData(licensedData, newSearchTerm))
  }

  return (
    <div className="containers">
      <div className="title-withIcon">
        <img src={navigationIcon} alt="icon" />
        <p className="c2e-text">C2E Listings</p>
      </div>
      <div className="inner-container">
        <div className="search-field">
          <input
            type="search"
            placeholder="search"
            id="searchInput"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <img src={searchIcon} alt="search icon" />
        </div>

        <div id="license_not_found" style={{ display: "none" }}>
          <div className="alert alert-warning" role="alert">
            <h4 className="alert-heading">No C2E listings found!</h4>
          </div>
        </div>

        {searchTerm.length === 0 ? (
          <Accordion onSelect={handleAccordionToggle}>
            {licensedData.map((item, index) => {
              if (item.parentid) {
                return null
              }
              return (
                <>
                  <Accordion.Item
                    key={index}
                    eventKey={index.toString()}
                    className={
                      openAccordion === index.toString() ? "open-accordion" : ""
                    }
                  >
                    <Accordion.Header>
                      <div className="bookbtn">
                        {`${item.title} (${item.identifiertype}: ${item.identifier})`}
                        <img
                          src={
                            openAccordion === index.toString()
                              ? minusIcon
                              : plusIcon
                          }
                          alt="plus icon"
                        />
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="cardTitle">Title</div>
                      <div className="allCardds">
                        {licensedData.map((data) => {
                          const license_terms =
                            data.ceelicense_usage !== null &&
                            data.ceelicense_usage.hasOwnProperty(
                              "hasDefinedTerm"
                            )
                              ? data.ceelicense_usage.hasDefinedTerm.name
                              : "---"
                          return (
                            data.rootparentid === item.id &&
                            data.level > 1 && (
                              <div className="chapterCard" key={data.id}>
                                <strong className="chapter-title">
                                  {data.title}
                                </strong>
                                <small className="info-detail">
                                  <div className="chapter-info">
                                    Listing ID / SKU
                                  </div>
                                  &nbsp;:
                                  {data.ceelisting_id}
                                </small>
                                <div className="d-flex">
                                  <small className="info-detail">
                                    <div className="chapter-info">
                                      Usage Type
                                    </div>
                                    &nbsp;: {data.ceelicense_type}
                                  </small>
                                  &nbsp;<strong>|</strong>&nbsp;
                                  <small className="info-detail">
                                    <div className="chapter-info">
                                      Usage Terms
                                    </div>
                                    &nbsp;: {license_terms}
                                  </small>
                                </div>
                                <div className="d-flex">
                                  <small className="info-detail">
                                    <div className="chapter-info">Price</div>:{" "}
                                    {data.price}
                                  </small>
                                  &nbsp;<strong>|</strong>&nbsp;
                                  <small className="info-detail">
                                    <div className="chapter-info">
                                      Total Licenses
                                    </div>
                                    &nbsp;: {data.totallicenses}
                                  </small>
                                </div>
                                <button type="button" className="remove-btn" onClick={deleteList()}>
                                  <img src={crossIcon} alt="arrowIcon" />
                                  Remove Listing
                                </button>
                              </div>
                            )
                          )
                        })}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </>
              )
            })}
          </Accordion>
        ) : (
          <div className="allCardds">
            {filteredData.map((data) => (
              <div className="chapterCard" key={data.id}>
                <strong className="chapter-title">{data.title}</strong>
                <small className="info-detail">
                  <div className="chapter-info">Listing ID / SKU</div>
                  &nbsp;:
                  {data.ceelisting_id}
                </small>
                <div className="d-flex">
                  <small className="info-detail">
                    <div className="chapter-info">Usage Type</div>
                    &nbsp;: {data.licensetype}
                  </small>
                  &nbsp;<strong>|</strong>&nbsp;
                  <small className="info-detail">
                    <div className="chapter-info">Usage Terms</div>
                    &nbsp;: {data.license_terms}
                  </small>
                </div>
                <div className="d-flex">
                  <small className="info-detail">
                    <div className="chapter-info">Price</div>: {data.price}
                  </small>
                  &nbsp;<strong>|</strong>&nbsp;
                  <small className="info-detail">
                    <div className="chapter-info">Total Licenses</div>
                    &nbsp;: {data.ceelisting_id}
                  </small>
                </div>
                <button type="button" className="remove-btn" onClick={deleteList()}>
                  <img src={crossIcon} alt="arrowIcon" />
                  Remove Listing
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default C2eServices
