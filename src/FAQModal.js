import React from 'react';
import { Modal } from 'antd';

const FormURL = 'https://forms.gle/w1ekg1coiLSJQfQt6';

class FAQEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'expanded': false
    }
  }

  getBody = () => {
    return {__html: this.props.body};
  }

  render() {
    return(
      <>
        <h3 style={{cursor: "pointer"}} onClick={(event) => this.setState({'expanded': !this.state.expanded})}>{this.props.title}</h3>
        {this.state.expanded && <p dangerouslySetInnerHTML={this.getBody()}></p>}
      </>
    );
  }
}

class FAQModal extends React.Component {
  renderLink(url, text) {
    return "<a target='_blank' href='" + url + "'>" + text + "</a>";
  }
  consumerFAQs = [
    {'title': "What is SaveOurFaves?",
     'body': "SaveOurFaves is a directory of Bay Area restaurants and coffee shops that offer online gift cards for purchase. It’s our hope that by providing this resource, we’ll be able to mobilize loyal customers to provide much-needed support for their favorite places in town."},
    {'title': "Why isn’t my favorite business on your site?",
     'body': "Please help us add your fave Bay Area food & beverages spots " + this.renderLink(FormURL, "here") + ". We're open to adding more small business categories if this catches on."},
    {'title': "How else can I support our local businesses beyond purchasing a gift card?",
     'body': "Delivery and pickup are great options! Some restaurants that don’t normally offer delivery have started to offer curbside pickup during the pandemic so check their websites and social media to see what’s available. <br />
     Tip generously if you can (even for delivery/pickup), since employees are doing extra work and putting their health at risk. <br />
     Encourage the government to get involved. Sign this " + this.renderLink(http://chng.it/jM97Sbf9ct, "San Francisco petition") + " to encourage lawmakers to offer emergency small business loans. Please call your US Representative and your Senators. You can be connected to the capitol switchboard at 202-224-3121. Demand that small businesses are part the federal stimulus plan." 
     
    },
    {'title': "Why is this just for the Bay Area? Can you do this for my city?",
     'body': "As San Francisco natives, we started this project for our community. Over the past days, people have launched similar tools for their specific cities, or even nationally. Check out " + this.renderLink(https://helpmainstreet.com/, "Help Main Street") + ", " + this.renderLink(https://givelocal.co/, "GiveLocal") + ", and " + this.renderLink(https://rallyforrestaurants.com/, "Rally for Restaurants") + "."
    },
    {'title': "Who built this? And why?",
     'body': "We’re Kaitlyn & Mike Krieger -- a husband and wife duo in San Francisco. We’re no longer going out because of COVID-19 (San Francisco is under a “shelter in place” ordinance), so we started buying gift cards to help support our favorite cafes and restaurants during this unpredictable time. SaveOurFaves is our simple way to make it easier for people to help local businesses through this difficult time. We got help and advice from some great friends and local business owners, in particular Phil Levin, Zack Schwab, Kristen Berman, Stefanie Krieger, Melissa Dyrdahl, Laura Buhler, and Paul Einbund. You can contact us with any questions about the site at " + this.renderLink("mailto:info@saveourfaves.org","info@saveourfaves.org") + "and see more about why we decided to start it " + this.renderLink("TODO", "here")  + "."
    },
  ]
  bizFAQs = [
    {'title': "Why isn’t my business showing up in your search results?",
     'body': "Please help us add your Bay Area food/beverage business " + this.renderLink(FormURL, "here") + ". We're open to adding more small business categories if this catches on."
    },
    {'title': "My business offers gift certificates, but your site says we don’t",
     'body': "Please let us know the details " + this.renderLink(FormURL, 'here') + "."},
    {'title': "How can I start offering online gift cards?",
     'body': "The first step is to check with your POS provider. Many offer their own gift card features (e.g. Square, Toast, ShopKeep), and others integrate with specific third-party providers. If your POS provider doesn’t offer gift cards or integrate with third-party providers, there are some reasonable standalone eGift Card apps like GiftUp or GiftFly. If you’re considering other options, make sure that your business receives the fee for the gift card as soon as the customer purchases the card (otherwise that won’t help you during the crisis). Some services may also ask customers to pay an additional fee when they buy a gift card but be sure it’s a small amount."},
    {'title': "How can I encourage customers to buy gift cards?",
     'body': "People are looking for ways they can support their favorite businesses, so don’t be afraid to let them know that gift cards will help. Reach out to your community on Facebook, Twitter, and Instagram, and use your email list to get in touch with your customers. Ask them to consider buying a gift card for one month of spending to help you weather this storm and keep paying staff, so that you can continue offering great food/coffee/etc. for years to come."}
  ]
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
      <h2>For Restaurant-goers</h2>
      {this.consumerFAQs.map((faq) => <FAQEntry key={faq.title} title={faq.title} body={faq.body} />)}
      <h2>For Businesses</h2>
      {this.bizFAQs.map((faq) => <FAQEntry key={faq.title} title={faq.title} body={faq.body} />)}
    </Modal>
    )
  }
}

export default FAQModal;
