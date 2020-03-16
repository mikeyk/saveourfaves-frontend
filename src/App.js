import React from 'react';
import { Button, Card, Modal, Popover, AutoComplete } from 'antd';
import './App.scss';
import  AllOptions from './AllOptions.js'
import { Typography, Divider } from 'antd';
import { Row, Col } from 'antd';
import axios from 'axios';
import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import { FacebookProvider, Share } from 'react-facebook';

const { Meta } = Card;


const { Title, Paragraph, Text } = Typography;
const { Option } = AutoComplete;

class CallToActionButton extends React.Component {

  render() {
    var place = this.props.place;
    var size = this.props.size;
    const emailBody = "Hi there! I was on SaveYourFave.com and saw that " + place.name + " offers gift certificates over email. I want to support you all, so please let me know how to proceed. Thanks, and stay healthy.";
    return(
      <>
          {place.giftCardURL && 
              <Button shape="round" size={size} className="large-primary-button" type="default" onClick={ (event) => { window.open(place.giftCardURL)}}>
                See Gift Cards
              </Button>
          }
          {!place.GiftCardURL && place.emailContact &&
              <Button shape="round" size={size} className="large-primary-button" type="default" onClick={ (event) => { window.location.href = "mailto:" + place.emailContact + "?subject=Buying a Gift Card%3F&body=" + emailBody}}>
                Email them
              </Button>
          }
      </>
    )

  }

}

class NeighborhoodCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'suggestedPlaces': null,
      'selectedNeighborhood': null
    }
  }
  render() {
    const neighborhoods = [
      {"name": "Mission", key: "mission"},
      {"name": "SoMa", key: "soma"},
      {"name": "Pac Heights", key: "pac_heights"},
    ]
    const neighborhoodCards = neighborhoods.map((neighborhood) =>  {
      return(
        <Col xs={24} sm={24} md={6} lg={4} xl={4}>
          <Card 
            bordered={true}
            hoverable={true}
            onClick={(event) => {
              axios.get('/api/places/by_neighborhood', {
                params: {
                  'neighborhood': neighborhood.key
                },
              }).then((response) => {
                const suggestions = response.data.suggestedPlaces;
                this.setState( (state, props) => {
                  return {'suggestedPlaces': suggestions, 'selectedNeighborhood': neighborhood.name}
                })
              })
            }}
            cover={<img alt="example" style={{objectFit: 'contain'}} src="https://vanguardproperties.com/cms/resources/mission-dolores-basilica-w680.jpg" />}>
                  <Meta title={neighborhood.name} description="" />

          </Card>
        </Col>
      )
    })
    return (
      <>
      <div style={{marginBottom: "20px", marginTop: "20px", textAlign: "center"}}>
        <Title level={4}>Explore neighborhood spots with gift cards</Title>
      </div>
        <Row gutter={8} style={{marginBottom: "20px"}}>
          {neighborhoodCards}
        </Row>
        {this.state.suggestedPlaces && this.state.suggestedPlaces.length > 0 && 
          <SuggestedPlaceCards suggestedPlaces={this.state.suggestedPlaces} />
        }
        {this.state.suggestedPlaces && this.state.suggestedPlaces.length == 0 && this.state.selectedNeighborhood &&
          <p>No results for {this.state.selectedNeighborhood}</p>
        }
      </>
    )
  }
}

class SuggestedPlaceCards extends React.Component {

  textForDetails(suggestion) {
    if (suggestion.giftCardURL) {
      return "SELLS ONLINE";
    } else if (suggestion.emailContact) {
      return "OFFERS VIA EMAIL";
    }
  }
  render() {
    const suggestedPlaceCards = this.props.suggestedPlaces.map((suggestion) => 
        <div className="suggested-place">
          <Row style={{backgroundSize: "cover", backgroundImage: "url(" + suggestion.imageURL + ")", minHeight: "110px"}}>
          </Row>
          <Row style={{minHeight: "110px"}}>
            <Title className="place-title" style={{textAlign: "center", width: "100%", marginTop: "12px", padding: "0px 6px"}} level={4}>{suggestion.name}</Title>
            <div className="suggestion-details">
              {this.textForDetails(suggestion)}
            </div>
            <div style={{margin: "0px auto"}}>
              <CallToActionButton place={suggestion} size={"default"} />
            </div>
          </Row>
        </div>
    );
    return(
      <Row gutter={[16, 16]} className="suggestions-container">
        {suggestedPlaceCards}
      </Row>
    )
  }
}

class NearbySpots extends React.Component {
  render() {

    return(
      <>
      <Row style={{textAlign: "center", marginTop: "20px", marginBottom: "20px"}}>
        <Title style={{margin: "auto"}} level={4}>Other spots nearby with gift certificates</Title>
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
      // return null;
      place = {
        "name": "The Snug",
        "address": "2301 Fillmore Street",
        //"giftCardURL": "https://www.toasttab.com/the-snug-san-francisco/giftcards",
        "giftCardURL": null,
        "placeURL": null,
        "emailContact": "m@mikek.co",
        "imageURL": "https://lh3.googleusercontent.com/p/AF1QipM09mIPRVymgGeEM5ZSYH21AhYHk-uZQPKrC8c=s1600-w800"
      }
      return null;
    }
    var cardStyle = 'marginBottom: 20px';
    return (
      <Row className="place-result" style=>
        <Col xs={24} sm={24} md={8} lg={8} xl={8} style={{minHeight: "100px", backgroundSize: "cover", backgroundImage: "url(" + place.imageURL + ")"}}>
        </Col>
        <Col xs={24} sm={24} md={16} lg={16} xl={16} style={{padding: "8px 16px"}}>
        <Row>
          <Col span={14} className="flex-vertical">
            <h2 className="place-title">{place.name}</h2>
          </Col>
          <Col span={10} className="flex-vertical">
            <div style={{ textAlign: "right"}} className="place-address">{place.address}</div>
          </Col>
        </Row>
        <Row style={{marginTop: 6}}>
          <Col xs={14} sm={14} md={14} lg={14} xl={14}>
          <div style={{}}>
          {place.giftCardURL &&
            <div>Yay, they sell gift cards online, so help save your fave!</div>}
          {!place.giftCardURL && place.emailContact &&
          <p>{place.name} sells gift cards over email. Contact them today to show your support.</p>}
          {!place.giftCardURL && !place.emailContact &&
          <p>We don’t know if {place.name} sells gift cards online.
          Visit their <a href="{place.placeURL}" target="_blank">website</a> to ask, and <a href="TODO">let us know</a> if we missed something.
          </p>}
          </div>
          </Col>
          <Col className="flex-vertical" xs={10} sm={10} md={10} lg={10} xl={10}>
            <div style={{textAlign: "right", marginLeft: "20px"}}>
            <CallToActionButton place={place} size="large" />
            </div>
          </Col>
          
        </Row>
        </Col>
      </Row>
    )
  }
}

class PlaceFilterDisplay extends React.Component {
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
      <div style={{ textAlign: "center"}}>
        <Title level={4} style={{ textAlign: "center"}}>Support that brunch spot, that perfect latte, that bar burger...</Title>
        <AutoComplete 
          style={{ maxWidth: "400px", width: "100%", marginBottom: "20px"}}
          onFocus={() => {return;} }
          defaultActiveFirstOption={false}
          placeholder="Enter your favorite place"
          onSelect={ (value, option) => {
            var that = this;
            document.activeElement.blur();
            axios.get('/api/places/detail', {
              params: {
                'place_id': option.key
              },
            }).then((response) => {
              const place = response.data.place;
              const suggestions = response.data.suggestedPlaces;
              const topOffset = that.elementRef.current.getBoundingClientRect().top;
              window.setTimeout(() => {
                scroll.scrollTo(topOffset);
              }, 0);
              this.setState( (state, props) => {
                return {'place': place, 'suggestedPlaces': suggestions}
              })
            })
          }}
          onChange= { (value) => {
            this.setState({'place': null, 'suggestedPlaces': null});
          }}
          filterOption={(inputValue, option) => {
            return inputValue.length >= 0 && option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }  }
        >
          {AllOptions}
        </AutoComplete>
        <div ref={this.elementRef} style={{textAlign: "left"}}>
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
            <Button onClick={handleClick} className='secondary-button'>Facebook</Button>
          )}
        </Share>
      </FacebookProvider>

          <Button 
            style={{marginLeft: 12}}
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
        <Typography>
        <FAQModal shouldShow={this.state.faqVisible} onClose={() => {this.hideFAQModal()} } />
        <Row className="hero-row" >
          <div style={{maxWidth: "1200px", margin:"0px auto"}}>
          <Row className>
          <Col span={2} offset={2}>
            <Title style={{color: "white"}} level={4}>SaveOurFaves</Title>
          </Col>
          <Col span={6} offset={12} style={{textAlign: "right"}}>
            
            <a href="#"><Title onClick={() => { this.showFAQModal()} } style={{color: "white", display: "inline", marginRight: "8px"}} level={4}>FAQs</Title></a>
            <Popover content={<ShareOptions />}>
            <Button className="secondary-button">Share</Button>
            </Popover>
          </Col>
          </Row>

          <Col span={12} offset={6} style={{textAlign: "left", paddingTop: "40px" }}>
            <Title level={1} style={{color: "white", textAlign: "center"}}>Gift cards help local businesses survive the COVID-19 crisis</Title>
          </Col>
          <Col sm={{span:20, offset: 2}} md={{span: 20, offset: 2}}>
            <div className="main-results">
            <PlaceFilterDisplay  />
            <NeighborhoodCards />
            </div>
          </Col>
          </div>
        </Row>
        <Row>
          <Col span={16} offset={4} style={{textAlign: "left"}}>
          </Col>
        </Row>
        </Typography>
      </div>
      </div>
    );
  }
}

export default App;
