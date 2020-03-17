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
    {'title': "Why isn’t my favorite business on your site?",
     'body': "We put this site together over a weekend and had to take a few shortcuts. " +
             "We currently focus on food and beverage businesses in San Francisco, including " +
             "restaurants, coffee shops, and bakeries. Bars that don’t serve restaurant food " +
             "aren’t on our site (yet), because most don’t offer gift cards. " +
             "If your favorite bar offers gift cards, " + this.renderLink(FormURL, "let us know") + "<br/>" + 
             "We also started with businesses that get great reviews online, " +
             "but we are happy to include any restaurant, coffee shop, bar, or bakery. " +
             "If you’d like a business to be listed on our site, " + this.renderLink(FormURL, "let us know") + "."},
    {'title': "How else can I support our local businesses?",
     'body': "Delivery and pickup are great options! Some restaurants that don’t normally offer delivery have started to offer curbside pickup during the pandemic. Some places are staying open. Check their social media or website to see what extra precautions they’re taking (e.g. frequent sanitization of all surfaces, removing tables so guests sit further apart, etc.). Obviously make sure you’re not experiencing any symptoms and haven’t been exposed to anyone with the virus. Tip generously, since employees are doing extra work and putting their health at risk."
    },
    {'title': "Why is this just for San Francisco? Can you do this for my city?",
     'body': "This is a side project for us, so we started where we live. Let us know if you want this in your city too at info@saveyourfaves.org. If there’s enough demand we’ll consider adding other cities."
    },
    {'title': "Who built this? And why?",
     'body': "We’re Kaitlyn & Mike Krieger -- a husband and wife duo in San Francisco. We’re no longer going out because of COVID-19 (San Francisco is under a “shelter in place” ordinance), so we started buying gift cards to help our favorite cafes and restaurants with cash flow. SaveYourFaves is our simple way to spread the word and make it easier for people to help local businesses through this difficult time. We got help and advice from some great friends plus local business owners, in particular Phil Levin, Zack Schwab, Kristen Berman, Stefanie Krieger, and Paul Einbund. You can contact us with more questions about the site at info@saveourfaves.org."
    },
  ]
  bizFAQs = [
    {'title': "Why isn’t my business showing up in your search results?",
     'body': "We put this site together over a weekend and had to take a few shortcuts. We currently focus on food and beverage businesses in San Francisco, including restaurants, coffee shops, and bakeries. Bars that don’t serve food aren’t on our site (yet), because most don’t offer gift cards. If your bar offers gift cards, " + this.renderLink(FormURL, "let us know") + ".We also started with businesses that get great reviews online, but we are happy to include any restaurant, coffee shop, bar, or bakery. If you’d like to be listed on our site, " + this.renderLink(FormURL, "let us know") + "."
    },
    {'title': "My business offers gift certificates, but your site says we don’t",
     'body': "Please let us know the details " + this.renderLink(FormURL, 'here') + "."},
    {'title': "How can I start offering online gift cards?",
     'body': "The first step is to check with your POS provider. Many offer their own gift card features (e.g. Square, Toast, ShopKeep), and others integrate with specific third-party providers. If your POS provider doesn’t offer gift cards or integrate with third-party providers, there are some reasonable standalone eGift Card apps like GiftUp or GiftFly. If you’re considering other options: Make sure that they’ll send your business the money as soon as the customer purchases the card. Some apps like Yiftee keep the money until the customer redeems the card. That won’t help you during the COVID crisis. Some services ask customers to pay an additional fee when they buy a gift card. Be sure it’s a small amount."},
    {'title': "How can I encourage customers to buy gift cards?",
     'body': "People are looking for ways they can support their favorite businesses, so don’t be afraid to let them know that gift cards will help. Post a link to Facebook, Twitter, and Instagram, and use your email list. Use personal language to talk about how much you care about your customers and  employees, and how much you hope to continue offering great food/coffee/etc. for years to come. Ask them to consider buying a gift card for one month of spending to help you weather this storm and continue paying staff."}
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
      {this.consumerFAQs.map((faq) => <FAQEntry title={faq.title} body={faq.body} />)}
      <h2>For Businesses</h2>
      {this.bizFAQs.map((faq) => <FAQEntry title={faq.title} body={faq.body} />)}
    </Modal>
    )
  }
}

export default FAQModal;