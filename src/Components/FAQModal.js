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
      title: "What is SupportSeattle?",
      body:
        "SupportSeattle is a directory of Seattle area restaurants, coffee shops, and local businesses and their delivery/takeout information and gift card purchase options . It’s our hope that by providing this resource, we’ll be able to mobilize loyal customers to provide much-needed support for their favorite places in town. We also link to staff donation sites, if they are available."
    },
    {
      title: "Why isn’t my favorite business on your site?",
      body:
        "Please help us add your favorite Seattle business (including restaurants, coffee shops, breweries, hairdressers, boutiques, etc) " +
        addPlaceLink("here")
    },
    {
      title:
        "How else can I support our local businesses beyond purchasing a gift card?",
      body:
        "Delivery and pickup are great options! Some restaurants that don’t normally offer delivery have started to offer curbside pickup, and others have closed temporarily. Check their website or social media for the latest info, or browse the " +
        renderLink(
          "https://projects.sfchronicle.com/2020/restaurant-delivery/",
          "San Francisco Chronicle's list"
        ) +
        " of Bay Area restaurants offering takeout. <br />" +
        "Tip generously if you can (even for delivery/pickup), since employees are doing extra work and putting their health at risk. <br />"
    },
    {
      title: "Are there similar resources for other cities?",
      body:
        "Yes! There are other great sites you can find here: " +
        renderLink("https://saveourfaves.org/", "SaveOurFaves") +
        ", " +
        renderLink("https://helpmainstreet.com/", "Help Main Street") +
        ", " +
        renderLink("https://givelocal.co/", "GiveLocal") +
        ", and " +
        renderLink(
          "https://rallyforrestaurants.com/",
          "Rally for Restaurants"
        ) +
        "."
    },
    {
      title: "Are you going to expand to other Seattle area cities?",
      body:
        "Depending on demand for our resource, we will consider expanding further in the Seattle metro area. Stay tuned!"
    },

    {
      title: "Who built this? And why?",
      body:
        "We’re a volunteer engineering team of employees/friends from Microsoft. We’re no longer going out because of COVID-19 (Seattle is under a “shelter in place” ordinance), so we started buying gift cards to help support our favorite local businesses during this unpredictable time. SupportSeattle is our simple way to make it easier for people to help local businesses through this difficult time. We based this site off of the open source code provided by Mike Krieger, the co-founder of SaveOurFaves in San Francisco."
    }
  ];
  const bizFAQs = [
    {
      title: "Why isn’t my business showing up in your search results?",
      body:
        "Please help us add your Seattle local business " + addPlaceLink("here")
    },
    {
      title:
        "My business offers gift certificates, but your site says we don’t",
      body: "Please let us know the details " + addPlaceLink("here") + "."
    },
    {
      title:
        "I'm running a GoFundMe for my staff, and I'd like to list it on your site",
      body: "Please drop us a note via email at " + renderLink("___", "___")
    },
    {
      title: "How can I start offering online gift cards?",
      body:
        "The first step is to check with your POS provider. Many offer their own gift card features (e.g. Square, Toast, ShopKeep), and others integrate with specific third-party providers. If your POS provider doesn’t offer gift cards or integrate with third-party providers, there are some reasonable standalone eGift Card apps like GiftUp or GiftFly. If you’re considering other options, make sure that your business receives the fee for the gift card as soon as the customer purchases the card (otherwise that won’t help you during the crisis). Some services may also ask customers to pay an additional fee when they buy a gift card but be sure it’s a small amount."
    },
    {
      title: "How can I encourage customers to buy gift cards?",
      body:
        "People are looking for ways they can support their favorite businesses, so don’t be afraid to let them know that gift cards will help. Reach out to your community on Facebook, Twitter, and Instagram, and use your email list to get in touch with your customers. Ask them to consider buying a gift card for one month of spending to help you weather this storm and keep paying staff, so that you can continue offering great food/coffee/etc. for years to come."
    },
    {
      title: "How can I edit the information presented about my business?",
      body:
        "To edit your business' information, please feel free to reach out to us at    and we can help!"
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
