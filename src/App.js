import React from 'react';
import { Button, Card, Modal, Popover } from 'antd';
import './App.scss';
import AllOptions from './AllOptions.js'
import Neighborhoods from './Neighborhoods.js'
import Autosuggest from 'react-autosuggest';

import { Typography, Divider } from 'antd';
import { Row, Col } from 'antd';
import axios from 'axios';
import { FacebookProvider, Share } from 'react-facebook';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

const { Title, Paragraph, Text } = Typography;

const FormURL = 'http://TODO';


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
          <Button shape="round" size="default" className="large-primary-button" type="default">
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
            <EmailSubscription place={this.props.place} />
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
      'fetchOffset': 0
    }
  }

  neighborhoods = Neighborhoods;

  fetchSuggestionsForNeighborhood(neighborhood, offset, ref) {
    axios.get('/api/places/by_neighborhood', {
      params: {
        'neighborhood': neighborhood.key,
        'offset': offset
      },
    }).then((response) => {
      const suggestions = response.data.suggestedPlaces;
      const moreAvailable = response.data.moreAvailable;
      ref.setState( (state, props) => {
        return {'suggestedPlaces': suggestions, 'fetchOffset': offset, 'moreAvailable': moreAvailable}
      })
    })
  }
  loadMoreForCurrentNeighborhood() {
    const offset = this.state.fetchOffset + this.state.suggestedPlaces.length;
    this.fetchSuggestionsForNeighborhood(
      this.state.selectedNeighborhood,
      offset,
      this
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
                'fetchOffset': 0
              })
              this.fetchSuggestionsForNeighborhood(neighborhood, 0, this);
            }}
            style={{backgroundImage: "url(" +
              neighborhood.image
             + ")"}}>

          </div>
          <div className={"neighborhood-card-title" + 
            ((this.state.selectedNeighborhood && (this.state.selectedNeighborhood.key == neighborhood.key)) 
              ? " neighborhood-card-title-selected" :
              "")}>
          {neighborhood.name}
          </div>
        </div>
      )
    })
    return neighborhoodCards;
  }
  render() {
    return (
      <>
      <div style={{marginBottom: "20px", marginTop: "20px", textAlign: "center"}}>
        <Title className="section-title" level={4}>Explore by Neighborhood</Title>
      </div>
        <section class="neighborhood-card-container">
        
        {this.state.offset != 0 && <a
          className={this.state.offset == 0 ? "neighborhood-card-arrow neighborhood-card-arrow-disabled" : "neighborhood-card-arrow"}
          style={{position: "absolute", left: 0, top: 50}}
          onClick={(event) => {
            this.setState({
              'offset': Math.max(0, this.state.offset - 1)
            })
          }}>{"<"}</a>}
        {this.getCardsForCurrentPage()}
        {(this.state.offset < this.neighborhoods.length - 1) &&
        <a
          style={{fontSize: "1.5em", position: "absolute", right: 0, top: 50}}
          onClick={(event) => {
            this.setState({
              'offset': Math.min(this.neighborhoods.length - 1, this.state.offset + 1)
            })
          }}>>
        </a>}
        </section>
        {(this.state.suggestedPlaces && this.state.suggestedPlaces.length > 0) && 
          <SuggestedPlaceCards 
            suggestedPlaces={this.state.suggestedPlaces} 
            moreAvailable={this.state.moreAvailable}
            onLoadMore={() => {
              this.loadMoreForCurrentNeighborhood()}
            } 
            />
        }
        
        {this.state.suggestedPlaces && this.state.suggestedPlaces.length == 0 && this.state.selectedNeighborhood &&
          <p>No results for {this.state.selectedNeighborhood}</p>
        }
      </>
    )
  }
}

class SuggestedPlaceCards extends React.Component {
  render() {
    const suggestedPlaceCards = this.props.suggestedPlaces.map((suggestion) => 
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
    return(
      <div>
      <section class="suggestions-container">
      <Row style={{justifyContent: "center"}}>
        {suggestedPlaceCards}
      </Row>
      </section>
      {this.props.moreAvailable &&
        <div style={{textAlign: "center"}}>
        <a onClick={this.props.onLoadMore}>Load More</a> 
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
    }
    var cardStyle = 'marginBottom: 20px';
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
          <p>Their gift card link isn't up yet, but tell them you're interested.</p>
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
  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
  
    return inputLength < 3 ? [] : placeNames.filter(place => 
      place.name.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
    );
  };
  
  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  getSuggestionValue = suggestion => suggestion.name;
  
  // Use your imagination to render suggestions.
  renderSuggestion = suggestion => (
    <div>
    <div>
      {suggestion.name}
    </div>
    <div class="autosuggest-address">
      {suggestion.address}
    </div>
    </div>
  );

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
      placeholder: '‍Search for your fave',
      value,
      onChange: this.onChange
    };

    // Finally, render it!
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
            const key = data.suggestion.key;
            this.props.onPlaceSelected(key);
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

class FAQModal extends React.Component {
  render() {
    return(
    <Modal
      title="FAQs"
      visible={this.props.shouldShow}
      onOk={this.handleFAQDismiss}
      width="80%"
      onCancel={this.props.onClose}
      footer={<span></span>}
    >
      <h2>For Consumers</h2>
      <h3>Why isn’t my favorite business on your site?</h3>
      <p>We put this site together over a weekend and had to take a few shortcuts.
      We currently focus on food and beverage businesses in San Francisco, including restaurants, coffee shops, and bakeries. Bars that don’t serve restaurant food aren’t on our site (yet), because most don’t offer gift cards. If your favorite bar offers gift cards, [let us know].
      We also started with businesses that get great reviews online, but we are happy to include any restaurant, coffee shop, bar, or bakery. If you’d like a business to be listed on our site, [let us know].</p>
      <h3>How else can I support our local businesses?</h3>
      <p>Delivery and pickup are great options! Some restaurants that don’t normally offer delivery have started to offer curbside pickup during the pandemic. 
      Some places are staying open. Check their social media or website to see what extra precautions they’re taking (e.g. frequent sanitization of all surfaces, removing tables so guests sit further apart, etc.). Obviously make sure you’re not experiencing any symptoms and haven’t been exposed to anyone with the virus.
      Tip generously, since employees are doing extra work and putting their health at risk.
      Honor your reservations or cancel 48 hours in advance. Restaurants buy food and schedule staff based on reservations, so now isn’t the time to be flaky.</p>
      <h3>Why is this just for San Francisco? Can you do this for my city?</h3>
      <p>This is a side project for us, so we started where we live. Tweet to let us know if you want this in your city too: @mikeyk @kaitlyntrigger. If there’s enough demand we’ll consider adding.</p>
      <h3>Who built this? And why?</h3>
      <p>We’re Kaitlyn & Mike Krieger -- a husband and wife duo in San Francisco. We’re going out less often because of COVID, so we started buying gift cards to help our favorite cafes and restaurants with cash flow. SaveYourFave is our simple way to spread the word and make it easier for people to help local businesses through this difficult time.</p>


      <h2>For businesses</h2>
      <h3>Why isn’t my business showing up in your search results?</h3>
      <p>We put this site together over a weekend and had to take a few shortcuts. 
      We currently focus on food and beverage businesses in San Francisco, including restaurants, coffee shops, and bakeries. Bars that don’t serve food aren’t on our site (yet), because most don’t offer gift cards. If your bar offers gift cards, [let us know].
      We also started with businesses that get great reviews Google, but we are happy to include any restaurant, coffee shop, bar, or bakery. If you’d like to be listed on our site, [let us know].</p>
      <h3>My business offers gift certificates, but your site says we don’t</h3>
      <p>Please let us know the details [here]</p>
      <h3>How can I start offering online gift cards?</h3>
      <p>The first step is to check with your POS provider. Many offer their own gift card features (e.g. Square, Toast, ShopKeep), and others integrate with specific third-party providers.
      If your POS provider doesn’t offer gift cards or integrate with third-party providers, there are some reasonable standalone eGift Card apps like GiftUp or GiftFly. If you’re considering other options:
      Make sure that they’ll send your business the money as soon as the customer purchases the card. Some apps like Yiftee keep the money until the customer redeems the card. That won’t help you during the COVID crisis.
      Some services ask customers to pay an additional fee when they buy a gift card. Be sure it’s a small amount.</p>
    </Modal>
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

          <Col span={16} offset={4} style={{textAlign: "center", padding: "20px 0px" }}>
            <Title level={1} style={{color: "white", textAlign: "center"}}>Your favorite café might close because of COVID-19. Help save it.</Title>
            <div className="header-sans">Gift cards help "flatten the curve" of lost cash flow.</div>
          </Col>
          <Col sm={{span:20, offset: 2}} md={{span: 20, offset: 2}} lg={{span:20, offset:2}}>
            <div className="main-results">
            <PlaceFilterDisplay  />
            <NeighborhoodCards />
            </div>
          </Col>
          <Row className="footer-content">
          <Col offset={2} xs={18} sm={18} md={9} lg={9} xl={9} style={{textAlign: "left"}}>
            <Title level={3}>Our duty as San Franciscans</Title>
            <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
            </p>
          </Col>
          <Col offset={2} xs={18} sm={18} md={9} lg={9} xl={9} style={{textAlign: "left"}}>
            <Title level={3}>Just 10 days can kill a business</Title>
            <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
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
