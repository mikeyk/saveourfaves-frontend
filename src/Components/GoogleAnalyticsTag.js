import useScript from "../lib/useScript";

function GoogleAnalyticsTag(props) {
  const [loaded] = useScript(
    "https://www.googletagmanager.com/gtag/js?id=" + props.analyticsID
  );
  if (loaded) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());

    window.gtag("config", "UA-157264978-1");
  } else {
    window.gtag = function() {};
    window.ga = function() {};
  }
  return null;
}

export default GoogleAnalyticsTag;
