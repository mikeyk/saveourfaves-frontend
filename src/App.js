import "./App.scss";
import React from "react";
import axios from "axios";

import { Button, Popover, Typography, Row, Col } from "antd";
import Areas from "./CityData/Areas";

// import Config from "./Config";
import GoogleAnalyticsTag from "./Components/GoogleAnalyticsTag";
import FAQModal from "./Components/FAQModal";
import AddNewPlaceModal from "./Components/AddNewPlaceModal";
import LogEngagementEvent from "./Logging";
import NeighborhoodCards from "./Components/NeighborhoodCards";
import PlaceFilterDisplay from "./Components/PlaceFilterDisplay";
import ShareOptions from "./Components/ShareOptions";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

const { Title } = Typography;

/*
 * This holds the context of what area (eg, SF, East Bay, etc)
 * is currently enabled
 */
const AreaContext = React.createContext({
  currentArea: null,
  updateArea: () => {}
});

class App extends React.Component {
  constructor(props) {
    super(props);
    // TODO this is janktown routing
    const path = window.location.pathname.slice(1).toLowerCase();
    const currentArea = Areas[path] ? path : "seattle";

    this.state = {
      faqVisible: false,
      shareVisible: true,
      currentArea: currentArea,
      addPlaceVisible: path === "addplace"
    };

    this.selfRef = React.createRef();
  }

  showFAQModal() {
    this.setState({ faqVisible: true });
  }
  hideFAQModal() {
    this.setState({ faqVisible: false });
  }
  showShareModal() {
    this.setState({ shareVisible: true });
  }
  hideShareModal() {
    this.setState({ shareVisible: false });
  }
  hideAddModal() {
    window.history.pushState({}, "", "/");
    this.setState({ addPlaceVisible: false });
  }
  render() {
    return (
      <AreaContext.Provider
        value={{
          currentArea: this.state.currentArea,
          updateArea: newArea => {
            LogEngagementEvent("user-action", "selected-area", newArea);
            window.history.pushState({}, null, "/" + newArea);
            this.setState({ currentArea: newArea });
          }
        }}
      >
        <div>
          <div style={{ marginTop: "0px" }}>
            <FAQModal
              shouldShow={this.state.faqVisible}
              onClose={() => {
                this.hideFAQModal();
              }}
            />
            <AddNewPlaceModal
              shouldShow={this.state.addPlaceVisible}
              onClose={() => {
                this.hideAddModal();
              }}
            />
            <Row className="hero-row">
              <div style={{ maxWidth: "1100px", margin: "0px auto" }}>
                <Row className="top-header" justify="center">
                  <Col span={24} offset={0}>
                    <Title style={{ float: "left", color: "white" }} level={4}>
                      SupportSeattle
                    </Title>
                    <div style={{ float: "right" }}>
                      <a href="#">
                        <Title
                          onClick={() => {
                            this.showFAQModal();
                          }}
                          className="header-link"
                          level={4}
                        >
                          FAQ
                        </Title>
                      </a>
                      <Popover content={<ShareOptions />}>
                        <a>
                          <Title
                            className="header-link header-share-link"
                            level={4}
                          >
                            Tell friends
                          </Title>
                        </a>
                      </Popover>
                      <Button
                        onClick={event => {
                          window.location.href = "/addplace";
                        }}
                        shape="round"
                        className="header-button header-add-place-button"
                      >
                        Add a Place
                      </Button>
                    </div>
                  </Col>
                </Row>

                <Col
                  xs={{ span: 18, offset: 3 }}
                  span={16}
                  offset={4}
                  style={{ textAlign: "center", padding: "20px 0px" }}
                >
                  <Title
                    level={1}
                    style={{ color: "white", textAlign: "center" }}
                  >
                    Your favorite Seattle restaurant might close forever. Help
                    save it.
                  </Title>
                  <div className="header-sans">
                    Gift cards help "flatten the curve" of lost income from
                    COVID-19.
                  </div>
                </Col>
                <Col
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 20, offset: 2 }}
                  lg={{ span: 20, offset: 2 }}
                >
                  <div className="main-results">
                    <div style={{ padding: 20 }}>
                      <AreaContext.Consumer>
                        {value => {
                          return (
                            <PlaceFilterDisplay updateArea={value.updateArea} />
                          );
                        }}
                      </AreaContext.Consumer>
                    </div>
                    <div className="neighborhood-card-container-outer">
                      <AreaContext.Consumer>
                        {value => {
                          return (
                            <NeighborhoodCards
                              currentArea={value.currentArea}
                              updateArea={value.updateArea}
                            />
                          );
                        }}
                      </AreaContext.Consumer>
                    </div>
                  </div>
                </Col>
                <Row className="footer-content">
                  <Col
                    offset={2}
                    xs={18}
                    sm={18}
                    md={9}
                    lg={9}
                    xl={9}
                    style={{ textAlign: "left" }}
                  >
                    <Title level={3}>Our duty as loyal customers</Title>
                    <p>
                      Our small businesses need us more than ever. Even though
                      we can’t leave home, we can still support local
                      restaurants by buying gift cards. It’s basically a
                      mini-loan, so buy one now and make a plan to use it later.
                    </p>
                  </Col>
                  <Col
                    offset={2}
                    xs={18}
                    sm={18}
                    md={9}
                    lg={9}
                    xl={9}
                    style={{ textAlign: "left" }}
                  >
                    <Title level={3}>3 weeks can kill a business</Title>
                    <p>
                      Restaurants have tons of fixed costs: rent, labor, loan
                      repayments, insurance, supplies, repairs – the list goes
                      on. Even successful restaurants have razor thin margins of
                      3-5%, and a third have struggled to pay employees at least
                      once. The “shelter-in-place” ordinance keeping customers
                      at home could tip the balance into bankruptcy.
                    </p>
                  </Col>
                </Row>
              </div>
            </Row>
          </div>
        </div>
        {/* <GoogleAnalyticsTag analyticsID={Config.GoogleAnalyticsID} /> */}
      </AreaContext.Provider>
    );
  }
}

export default App;
