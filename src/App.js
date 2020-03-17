import React from 'react';
import { Button, Card, Modal, Popover } from 'antd';
import './App.scss';
import AllOptions from './AllOptions.js'
import FAQModal from './FAQModal.js'
import Neighborhoods from './Neighborhoods.js'
import Autosuggest from 'react-autosuggest';
import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

import { Typography, Divider } from 'antd';
import { Row, Col } from 'antd';
import axios from 'axios';
import { FacebookProvider, Share } from 'react-facebook';

import Skeleton from 'react-loading-skeleton';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

const { Title, Paragraph, Text } = Typography;

const FormURL = 'https://forms.gle/w1ekg1coiLSJQfQt6';

class EmailSubscription extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'email': null,
      'emailSubmitted': false,
      'emailError': null,
      'emailSuccess': null
    }
  }

  onEmailChange = (event) => {
    this.setState({
      'email': event.target.value,
      'emailSubmitted': false
    })
  }

  onEmailSubmit = (event) => {
    if (!this.state.email || !this.state.email.length || this.state.email.indexOf('@') == -1) {
      this.setState({
        'emailError': 'Please enter an email.'
      })
      return;
    }

    axios.post('/api/places/submit_email', {
      'email': this.state.email,
      'place_id': this.props.place.placeID
      
    }).then((response) => {
      this.setState({
        'emailError': null,
        'emailSuccess': true
      })
    }).catch((error) => {
      this.setState({
        'emailError': "Sorry, we couldn't save your email."
      })
    })
  }

  render() {
    return (
      <Popover overlayClassName="email-popover" trigger="click" placement="bottomRight" content={
        <div className="email-popover-inner">
          {!this.state.emailSuccess && 
          <>
          <div>
          <input onChange={this.onEmailChange} type="email" value={this.state.email} className="email-popover-input" placeholder="Enter your email" />
          <Button 
            className="email-confirm-button" 
            shape="round" 
            size="default" 
            onClick={this.onEmailSubmit}
            type="default">
              OK
          </Button>
          </div>
          </>}
          {this.state.emailError && 
            <div class='email-popover-error'>{this.state.emailError}</div>}
          {!this.state.emailSuccess && 
          <>
            <p>We'll let the business know you're interested. We promise not to spam you.</p>
            <p>(If you've found their link <a href={FormURL}>let us know</a>)</p>
          </>
          }
          {this.state.emailSuccess && 
            <div class='email-popover-success'>Thanks! We'll let them know.</div>}
        </div>
      }>
          <Button shape="round" size="default" className={this.props.buttonClass} type="default">
            Request Gift Card
          </Button>
      </Popover> 
    )
  }
}

class CallToActionButton extends React.Component {
  render() {
    var place = this.props.place;
    var size = this.props.size;
    const emailBody = "Hi there! I was on SaveYourFave.com and saw that " + place.name + " offers gift certificates over email. I want to support you all, so please let me know how to proceed. Thanks, and stay healthy.";
    const className = (size == "large") ? "large-primary-button" : "secondary-button";
    return(
      <div key={place.placeID}>
          {place.giftCardURL && 
              <Button shape="round" size={size} className={className} type="default" onClick={ (event) => { window.open(place.giftCardURL)}}>
                Get Gift Card
              </Button>
          }
          {!place.giftCardURL && place.emailContact &&
              <Button shape="round" size={size} className={className} type="default" onClick={ (event) => { window.location.href = "mailto:" + place.emailContact + "?subject=Buying a Gift Card%3F&body=" + emailBody}}>
                Get Gift Card
              </Button>
          }
          {(!place.giftCardURL && !place.emailContact) &&
            <EmailSubscription place={this.props.place} buttonClass={className} />
          }
      </div>
    )

  }

}

class NeighborhoodCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'suggestedPlaces': null,
      'selectedNeighborhood': null,
      'offset': 0,
      'fetchOffset': 0,
      'windowWidth': 0,
      'loading': false
    }
    this.ref = React.createRef();
  }
  neighborhoods = Neighborhoods;

  componentDidMount = () => {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this.setState({
      'selectedNeighborhood': this.neighborhoods[0],
    })
    this.fetchSuggestionsForNeighborhood(this.neighborhoods[0], this, 0);
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions = () => {
    this.setState({ windowWidth: window.innerWidth});
  }


  fetchSuggestionsForNeighborhood(neighborhood, ref, fetchOffset) {
    this.setState({'loading': true});
    axios.get('/api/places/by_neighborhood', {
      params: {
        'neighborhood': neighborhood.key,
        'offset': fetchOffset
      },
    }).then((response) => {
      const suggestions = response.data.suggestedPlaces;
      const moreAvailable = response.data.moreAvailable;
      const merged = (this.state.suggestedPlaces || []).concat(suggestions);
      ref.setState( (state, props) => {
        const nextOffset = state.fetchOffset + suggestions.length;
        return {'loading': false, 
          'suggestedPlaces': merged, 'fetchOffset': nextOffset, 'moreAvailable': moreAvailable}
      })
    }).catch((error) => {
      ref.setState({'loading': false});
    });
  }
  loadMoreForCurrentNeighborhood() {
    this.fetchSuggestionsForNeighborhood(
      this.state.selectedNeighborhood,
      this,
      this.state.fetchOffset
    )
  }

  getCardsForCurrentPage() {
    const neighborhoodCards = this.neighborhoods.slice(this.state.offset).map((neighborhood) =>  {
      return(
        <div className="neighborhood-card" style={{textAlign: "center"}}>
          <div 
            className={"neighborhood-card-image" + 
            ((this.state.selectedNeighborhood && (this.state.selectedNeighborhood.key == neighborhood.key)) 
              ? " neighborhood-card-image-selected" :
              "")}
            onClick={(event) => {
              this.setState({
                'selectedNeighborhood': neighborhood,
                'fetchOffset': 0,
                'suggestedPlaces': null
              })
              this.fetchSuggestionsForNeighborhood(neighborhood, this, 0);
            }}>
            <div className={"neighborhood-card-title" + 
              ((this.state.selectedNeighborhood && (this.state.selectedNeighborhood.key == neighborhood.key)) 
                ? " neighborhood-card-title-selected" :
                "")}>
              {neighborhood.name}
            </div>
          </div>
        </div>
      )
    })
    return neighborhoodCards;
  }
  render() {
    return (
      <>
      <div className="explore-neighborhood-section">
        <Title className="section-title" level={4}>Or explore by neighborhood</Title>
      </div>
        <section class="neighborhood-card-container" style={{maxWidth: (this.state.windowWidth >= 576 ? (this.state.windowWidth - 200) : (this.state.windowWidth))}}>
        
        {this.state.offset != 0 && <a
          className={
            "neighborhood-card-arrow neighborhood-card-arrow-left " + (this.state.offset >= this.neighborhoods.length - 1 ? "neighborhood-card-arrow-disabled" : "") 
          }
          onClick={(event) => {
            this.setState({
              'offset': Math.max(0, this.state.offset - 1)
            })
          }}>{"‹"}</a>}
        {this.getCardsForCurrentPage()}
        {(this.state.offset < this.neighborhoods.length - 1) &&
        <a
          className={
            "neighborhood-card-arrow neighborhood-card-arrow-right " + (this.state.offset >= this.neighborhoods.length - 1 ? "neighborhood-card-arrow-disabled" : "") 
          }
          onClick={(event) => {
            this.setState({
              'offset': Math.min(this.neighborhoods.length - 1, this.state.offset + 1)
            })
          }}>›
        </a>}
        </section>
        {(this.state.loading || (this.state.suggestedPlaces && this.state.suggestedPlaces.length > 0)) &&
          <SuggestedPlaceCards 
            passRef={this.ref}
            suggestedPlaces={this.state.suggestedPlaces} 
            moreAvailable={this.state.moreAvailable}
            onLoadMore={() => {
              this.loadMoreForCurrentNeighborhood()}
            } 
            />
        }
        
        {this.state.suggestedPlaces && this.state.suggestedPlaces.length == 0 && this.state.selectedNeighborhood &&
          <p>No results for {this.state.selectedNeighborhood.name}</p>
        }
      </>
    )
  }
}

class SuggestedPlaceCards extends React.Component {
  render() {
    var suggestedPlaceCards;
    if (this.props.suggestedPlaces && this.props.suggestedPlaces.length) {
      suggestedPlaceCards = this.props.suggestedPlaces.map((suggestion) => 
        <div className="suggested-place">
          <Row style={{backgroundSize: "cover", backgroundImage: "url(" + suggestion.imageURL + ")", minHeight: "80px"}}>
          </Row>
          <Row style={{minHeight: "88px"}}>
            <Title className="suggestion-title" style={{textAlign: "center", width: "100%", marginTop: "12px", padding: "0px 6px"}} level={4}>{suggestion.name}</Title>
            <div style={{margin: "0px auto"}}>
              <CallToActionButton place={suggestion} size={"default"} />
            </div>
          </Row>
        </div>
      );
    } else {
      suggestedPlaceCards = [...Array(9).keys()].map((placeholder) => 
        <div className="suggested-place">
          <div style={{marginTop: -4}}>
          <Skeleton height={168} />
          </div>
        </div>
      );
    }
    return(
      <div ref={this.props.passRef}>
      <section class="suggestions-container">
      <Row style={{justifyContent: "center"}}>
        {suggestedPlaceCards}
      </Row>
      </section>
      {this.props.moreAvailable &&
        <div style={{textAlign: "center"}}>
        <Button className="primary-button" shape="round" size="default" onClick={this.props.onLoadMore}>Load More</Button> 
        </div>
      }
      </div>
    )
  }
}

class NearbySpots extends React.Component {
  render() {

    return(
      <>
      <Row style={{textAlign: "center", marginTop: "20px", marginBottom: "20px"}}>
        <Title className="section-title" style={{margin: "auto"}} level={4}>Local Gems Nearby</Title>
      </Row>
      <SuggestedPlaceCards suggestedPlaces={this.props.suggestedPlaces} />
      </>
    )
  }
}

class PlaceResultMain extends React.Component {
  render() {
    var place = this.props.place;
    if (!place) {
      place = {
        "name": "The Snug",
        "address": "2301 Fillmore Street",
        //"giftCardURL": "https://www.toasttab.com/the-snug-san-francisco/giftcards",
        "giftCardURL": null,
        "placeURL": null,
        "emailContact": null,
        "imageURL": "https://lh3.googleusercontent.com/p/AF1QipM09mIPRVymgGeEM5ZSYH21AhYHk-uZQPKrC8c=s1600-w800",
        "placeID": "ChIJ-_7qDsaAhYARKG4Gj6yw2ho"

      }
      return null;
    }
    return (
      <Row className="place-result">
        <Col xs={24} sm={24} md={8} lg={8} xl={8} style={{minHeight: "100px", backgroundPosition: "center center", backgroundSize: "cover", backgroundImage: "url(" + place.imageURL + ")"}}>
        </Col>
        <Col xs={24} sm={24} md={16} lg={16} xl={16} style={{padding: "8px 16px"}}>
        <Row align="center">
          <Col span={14} className="flex-vertical">
            <h2 className="place-title">{place.name}</h2>
          </Col>
          <Col span={10} className="flex-vertical">
            <div style={{ textAlign: "right"}} className="place-address">{place.address}</div>
          </Col>
        </Row>
        <Row style={{minHeight: 80}} align="bottom">
          <Col xs={24} sm={14} md={14} lg={14} xl={14} style={{position: "relative", top: 12}}>
          {place.giftCardURL &&
            <p>{place.name} offers gift cards online. Consider prepaying for a month of spending.</p>}
          {!place.giftCardURL && place.emailContact &&
            <p>Consider prepaying for a month of spending.</p>}
          {!place.giftCardURL && !place.emailContact &&
          <p>We haven't found their gift card link, but we'll tell them you're interested.</p>
          }
          </Col>
          <Col className="flex-vertical" xs={24} sm={10} md={10} lg={10} xl={10}>
            <div className="call-to-action-outer" >
            <CallToActionButton place={place} size="large" />
            </div>
          </Col>
          
        </Row>
        </Col>
      </Row>
    )
  }
}

const placeNames = AllOptions;

class PlaceAutosuggestion extends React.Component {
  maxSuggestions = 8;

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
  
    if (inputLength < 3) {
      return [];
    } else {
      const results = placeNames.filter(place => 
        place.name.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
      ).slice(0, this.maxSuggestions);
      results.push(
        {'special': 'letUsKnowRow'}
      );
      return results;
    }
  };
  
  getSuggestionValue = suggestion => suggestion.name || "";
  
  renderSuggestion = (suggestion) => {
    if (suggestion.special) {
      return(
        <div>
        <div>
          Don't see your fave?
        </div>
        <div>
          <a href={FormURL} target="_new" className="primary-link">Let us know</a>
        </div>
        </div>
      )
    } else {
      return(
        <div>
        <div>
          {suggestion.name}
        </div>
        <div class="autosuggest-address">
          {suggestion.address}
        </div>
        </div>
        )
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: []
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
    this.props.onSearchChanged(newValue);
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  renderInputComponent = inputProps => (
    <div className="react-autosuggest__wrapper">
    <div className="react-autosuggest__left-icon">🍽</div>
    <input {...inputProps} />
    </div>
  );

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: '‍Search for SF coffee spots, restaurants...',
      value,
      onChange: this.onChange
    };

    return (
      <div className="autosuggest-outer">
        <Autosuggest
          suggestions={suggestions}
          focusInputOnSuggestionClick={false}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderInputComponent={this.renderInputComponent}
          onSuggestionSelected={(event, data) => {
            if (data.suggestion.special) {
              window.open(FormURL);
            } else {
              const key = data.suggestion.key;
              this.props.onPlaceSelected(key);
            }
          }}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
      </div>
    );
  }
}

class PlaceFilterDisplay extends React.Component {
  fetchPlaceInfo(scrollElementRef, placeKey) {
    axios.get('/api/places/detail', {
      params: {
        'place_id': placeKey
      },
    }).then((response) => {
      const place = response.data.place;
      const suggestions = response.data.suggestedPlaces;
      this.setState( (state, props) => {
        return {'place': place, 'suggestedPlaces': suggestions}
      })
    })

  }

  constructor(props) {
    super(props);
    this.state = {
      error: null,
    hasFetched: false,
      place: null,
      suggestedPlaces: null
    };
    this.elementRef = React.createRef();
  }

  render() {

    return(
      <div ref={this.elementRef}>
        <PlaceAutosuggestion 
          onPlaceSelected={(placeID) => {
            this.fetchPlaceInfo(this.elementRef, placeID);
          }} 
          onSearchChanged={(newValue) => {
            if (newValue.length === 0) {
              this.setState({place: null, suggestedPlaces: null})
            }
          }}
        />
        <div style={{textAlign: "left"}}>
          <PlaceResultMain place={this.state.place} />
          {this.state.suggestedPlaces && this.state.suggestedPlaces.length > 0 && <NearbySpots suggestedPlaces={this.state.suggestedPlaces} />}
        </div>
      </div>
    )
  }

}

class ShareOptions extends React.Component {

  shareToFB() {
  }
  render() {
    return(
      <div>
          <FacebookProvider appId="202370887681802">
        <Share href="https://saveourfaves.org">
          {({ handleClick, loading }) => (
            <Button onClick={handleClick} shape="round" className='secondary-button'>Facebook</Button>
          )}
        </Share>
      </FacebookProvider>

          <Button 
            style={{marginLeft: 12}}
            shape="round"
            className='secondary-button'
            onClick={() => {
              window.open("https://twitter.com/intent/tweet?url=http://saveourfaves.org")
            }}
          >
            Twitter</Button>
      </div>
    )
  }
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'faqVisible': false,
      'shareVisible': true
    }
    this.selfRef = React.createRef()
  }
  showFAQModal() {
    this.setState({'faqVisible': true});
  }
  hideFAQModal() {
    this.setState({'faqVisible': false});
  }
  showShareModal() {
    this.setState({'shareVisible': true});
  }
  hideShareModal() {
    this.setState({'shareVisible': false});
  }
  render() {
    return (
      <div>
        <div style={{marginTop: "0px"}}>
        <FAQModal shouldShow={this.state.faqVisible} onClose={() => {this.hideFAQModal()} } />
        <Row className="hero-row" >
          <div style={{maxWidth: "1100px", margin:"0px auto"}}>
          <Row className="top-header" >
          <Col span={24} offset={0}>
            <Title style={{float:"left", color: "white"}} level={4}>SaveOurFaves</Title>
          <div style={{float: "right"}}>
            
            <a href="#"><Title onClick={() => { this.showFAQModal()} } style={{color: "white", display: "inline", marginRight: "16px"}} level={4}>FAQ</Title></a>
            <Popover content={<ShareOptions />}>
            <Button shape="round" className="header-button">Tell friends</Button>
            </Popover>
          </div>
          </Col>
          </Row>

          <Col xs={{span: 18, offset: 3}} span={16} offset={4} style={{textAlign: "center", padding: "20px 0px" }}>
            <Title level={1} style={{color: "white", textAlign: "center"}}>Your favorite SF restaurant might close forever. Help save it.</Title>
            <div className="header-sans">Gift cards help "flatten the curve" of lost income from COVID-19.</div>
          </Col>
          <Col sm={{span:20, offset: 2}} md={{span: 20, offset: 2}} lg={{span:20, offset:2}}>
            <div className="main-results">
              <div style={{padding: 20}}>
            <PlaceFilterDisplay  />
            </div>
            <div className="neighborhood-card-container-outer">
            <NeighborhoodCards />
            </div>
            </div>
          </Col>
          <Row className="footer-content">
          <Col offset={2} xs={18} sm={18} md={9} lg={9} xl={9} style={{textAlign: "left"}}>
            <Title level={3}>Our duty as San Franciscans</Title>
            <p>Our city has 12,000 small businesses, employing 359,000 people. They need us more than ever. Even though we can’t leave home, we can still support local restaurants by buying gift cards. It’s basically a mini-loan, so buy one now and make a plan to use it later.
            </p>
          </Col>
          <Col offset={2} xs={18} sm={18} md={9} lg={9} xl={9} style={{textAlign: "left"}}>
            <Title level={3}>3 weeks can kill a business</Title>
            <p>Restaurants have tons of fixed costs: rent, labor, loan repayments, insurance, supplies, repairs – the list goes on. Even successful restaurants have razor thin margins of 3-5%, and a third have struggled to pay employees at least once. The “shelter-in-place” ordinance keeping customers at home could tip the balance into bankruptcy.

            </p>
          </Col>
          </Row>
          </div>
        </Row>
      </div>
      </div>
    );
  }
}

export default App;
