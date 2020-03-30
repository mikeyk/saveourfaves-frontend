import React from "react";
import { Modal } from "antd";
import Constants from "../Constants";

class FAQEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  getBody = () => {
    return { __html: this.props.body };
  };

  render() {
    return (
      <>
        <h3
          style={{ cursor: "pointer" }}
          onClick={event => this.setState({ expanded: !this.state.expanded })}
        >
          {this.props.title}
        </h3>
        {this.state.expanded && (
          <p dangerouslySetInnerHTML={this.getBody()}></p>
        )}
      </>
    );
  }
}

function FAQModal(props) {
  function renderLink(url, text, target) {
    target = target || "_blank";
    return "<a target='" + target + "' href='" + url + "'>" + text + "</a>";
  }

  function addPlaceLink(text) {
    return renderLink(Constants.AddPlaceURL, text, "_self");
  }

  const consumerFAQs = [
    {
      title: "What is SaveYourVenue?",
      body:
        "SaveYourVenue is a directory of London restaurants and coffee shops that offer donations and online gift cards for purchase. It’s our hope that by providing this resource, we’ll be able to mobilize loyal customers to provide much-needed support for their favourite places in town. We also link to staff donation sites, if they are available."
    },
    {
      title: "Why isn’t my favourite business on your site?",
      body:
        "Please help us add your fave London food & beverages spots " +
        addPlaceLink("here") +
        ". We're open to adding more small business categories if this catches on."
    },
    {
      title:
        "How else can I support our local businesses beyond purchasing a gift card?",
      body:
        "Delivery and pickup are great options! Some restaurants that don’t normally offer delivery have started to offer curbside pickup, and others have closed temporarily. Check their website or social media for the latest info, or browse the " + renderLink("https://projects.sfchronicle.com/2020/restaurant-delivery/", "San Francisco Chronicle's list") +
        " of Bay Area restaurants offering takeout. <br />" +
        "Tip generously if you can (even for delivery/pickup), since employees are doing extra work and putting their health at risk. <br />" +
        "Encourage the government to get involved. Sign this " +
        renderLink("https://www.change.org/p/boris-johnson-call-to-the-government-to-support-uk-s-hospitality-industry-through-the-coronavirus-crisis-1d701225-9896-4089-a0fc-ce6ffde93203", "petition") +
        " to encourage the Government to support UK's hospitality industry through the Coronavirus crisis. Please call your UK MPs. Demand that small businesses are part the stimulus plan."
    },
    {
      title: "Why is this just for the London? Can you do this for my city?",
      body:
        "As London residents, we started this project for our community. You can also check " + renderLink("https://www.opentable.co.uk/gifts/search","OpenTable") + " to find gift cards and vouchers for restaurants in your city."
    },
    {
      title: "Who built this? And why?",
      body:
        "We’re Chris Ciszak and Camila Del Popolo -- a couple duo in London. During Coronavirus pandemic we wanted to be as valuable to our community as possible. After starting " + renderLink("https://www.herobuddy.org", "herobuddy.org") + " to support those most at-risk, we decided to help our local businesses. We’re no longer going out because of COVID-19 (London is locked down), so we started buying gift cards to help support our favourite cafes and restaurants during this unpredictable time. SaveYourVenue is our simple way to make it easier for people to help local businesses through this difficult time. We wanted to thank Kaitlyn & Mike Krieger for open sourcing this initiative as well as James Bowater and " + 
        renderLink("https://www.cityam.com/", "CityAM") +
        " for their support throughout this journey. You can contact us with any questions about the site at " +
        renderLink("mailto:info@saveyourvenue.org", "info@saveyourvenue.org") +
        /*" and see more about why we decided to start it " +
        renderLink(
          "",
          "here"
        ) + */
        "."
    }
  ];
  const bizFAQs = [
    {
      title: "Why isn’t my business showing up in your search results?",
      body:
        "Please help us add your London food/beverage business " +
        addPlaceLink("here") +
        ". We're open to adding more small business categories if this catches on."
    },
    {
      title:
        "My business offers gift certificates, but your site says we don’t",
      body: "Please let us know the details " + addPlaceLink("here") + "."
    },
    {
      title:
        "I'm running a GoFundMe for my staff, and I'd like to list it on your site",
      body:
        "Please drop us a note via email at " +
        renderLink("mailto:info@saveourfaves.org", "info@saveourfaves.org")
    },
    {
      title: "How can I start offering online gift cards?",
      body:
        "The first step is to check with your POS provider. Many offer their own gift card features (e.g. Square, Toast, ShopKeep), and others integrate with specific third-party providers. If your POS provider doesn’t offer gift cards or integrate with third-party providers, there are some reasonable standalone eGift Card apps like GiftPro, Enjovia or Vouchable. If you’re considering other options, make sure that your business receives the fee for the gift card as soon as the customer purchases the card (otherwise that won’t help you during the crisis). Some services may also ask customers to pay an additional fee when they buy a gift card but be sure it’s a small amount."
    },
    {
      title: "How can I encourage customers to buy gift cards?",
      body:
        "People are looking for ways they can support their favourite businesses, so don’t be afraid to let them know that gift cards will help. Reach out to your community on Facebook, Twitter, and Instagram, and use your email list to get in touch with your customers. Ask them to consider buying a gift card for one month of spending to help you weather this storm and keep paying staff, so that you can continue offering great food/coffee/etc. for years to come."
    }
  ];
  return (
    <Modal
      title="FAQs"
      visible={props.shouldShow}
      onOk={props.onClose}
      width="80%"
      onCancel={props.onClose}
      footer={<span></span>}
    >
      <h2>For Restaurant-goers</h2>
      {consumerFAQs.map(faq => (
        <FAQEntry key={faq.title} title={faq.title} body={faq.body} />
      ))}
      <h2>For Businesses</h2>
      {bizFAQs.map(faq => (
        <FAQEntry key={faq.title} title={faq.title} body={faq.body} />
      ))}
    </Modal>
  );
}

export default FAQModal;
