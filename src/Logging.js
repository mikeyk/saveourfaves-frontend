export function LogEngagementEvent(action, label, value) {
  window.gtag("event", action, {
    event_category: "engagement",
    event_label: label,
    value: value
  });
}

export default LogEngagementEvent;