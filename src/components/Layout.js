import React from "react";
import { graphql, Script } from "gatsby";

import "../styles";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const TemplateWrapper = ({ footerData = null, navbarData = null, children }) => (
  <div>
    <Script id="segment_with_posthog">{`
      var SEGMENT_API_KEY = '${process.env.GATSBY_SEGMENT_API_KEY}';
      var POSTHOG_API_KEY = '${process.env.GATSBY_POSTHOG_API_KEY}';

      // Load PostHog JS
      !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

      !function(){var i="analytics",analytics=window[i]=window[i]||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","screen","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware","register"];analytics.factory=function(e){return function(){if(window[i].initialized)return window[i][e].apply(window[i],arguments);var n=Array.prototype.slice.call(arguments);if(["track","screen","alias","group","page","identify"].indexOf(e)>-1){var c=document.querySelector("link[rel='canonical']");n.push({__t:"bpc",c:c&&c.getAttribute("href")||void 0,p:location.pathname,u:location.href,s:location.search,t:document.title,r:document.referrer})}n.unshift(e);analytics.push(n);return analytics}};for(var n=0;n<analytics.methods.length;n++){var key=analytics.methods[n];analytics[key]=analytics.factory(key)}analytics.load=function(key,n){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.setAttribute("data-global-segment-analytics-key",i);t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r);analytics._loadOptions=n};analytics._writeKey=SEGMENT_API_KEY;;analytics.SNIPPET_VERSION="5.2.0";
      analytics.load(SEGMENT_API_KEY);
      analytics.page();

        analytics.ready(() => {
          window.posthog.init(POSTHOG_API_KEY, {
            api_host: 'https://us.i.posthog.com', // Use eu.i.posthog.com for EU instances
            segment: window.analytics, // Pass window.analytics here - NOTE: 'window.' is important segment
            capture_pageview: false, // You want this false if you are going to use segment's 'analytics.page()' for pageviews
            capture_pageleave: true,
            // When the posthog library has loaded, call 'analytics.page()' explicitly. // When
            loaded: (posthog) => {
              window.analytics.page();
            },
            debug: true,
          });
        })

      }}();
    `}</Script>  
    
    <Script id="rudderstack">{`

      // REPLACE THE API KEYS!!!!
      var RUDDERSTACK_API_KEY = '${process.env.GATSBY_RUDDERSTACK_API_KEY}';

      !function(){"use strict";window.RudderSnippetVersion="3.0.32";var e="rudderanalytics";window[e]||(window[e]=[])
      ;var rudderanalytics=window[e];if(Array.isArray(rudderanalytics)){
      if(true===rudderanalytics.snippetExecuted&&window.console&&console.error){
      console.error("RudderStack JavaScript SDK snippet included more than once.")}else{rudderanalytics.snippetExecuted=true,
      window.rudderAnalyticsBuildType="legacy";var sdkBaseUrl="https://cdn.rudderlabs.com/v3";var sdkName="rsa.min.js"
      ;var scriptLoadingMode="async"
      ;var r=["setDefaultInstanceKey","load","ready","page","track","identify","alias","group","reset","setAnonymousId","startSession","endSession","consent"]
      ;for(var n=0;n<r.length;n++){var t=r[n];rudderanalytics[t]=function(r){return function(){var n
      ;Array.isArray(window[e])?rudderanalytics.push([r].concat(Array.prototype.slice.call(arguments))):null===(n=window[e][r])||void 0===n||n.apply(window[e],arguments)
      }}(t)}try{
      new Function('class Test{field=()=>{};test({prop=[]}={}){return prop?(prop?.property??[...prop]):import("");}}'),
      window.rudderAnalyticsBuildType="modern"}catch(o){}var d=document.head||document.getElementsByTagName("head")[0]
      ;var i=document.body||document.getElementsByTagName("body")[0];window.rudderAnalyticsAddScript=function(e,r,n){
      var t=document.createElement("script");t.src=e,t.setAttribute("data-loader","RS_JS_SDK"),r&&n&&t.setAttribute(r,n),
      "async"===scriptLoadingMode?t.async=true:"defer"===scriptLoadingMode&&(t.defer=true),
      d?d.insertBefore(t,d.firstChild):i.insertBefore(t,i.firstChild)},window.rudderAnalyticsMount=function(){!function(){
      if("undefined"==typeof globalThis){var e;var r=function getGlobal(){
      return"undefined"!=typeof self?self:"undefined"!=typeof window?window:null}();r&&Object.defineProperty(r,"globalThis",{
      value:r,configurable:true})}
      }(),window.rudderAnalyticsAddScript("".concat(sdkBaseUrl,"/").concat(window.rudderAnalyticsBuildType,"/").concat(sdkName),"data-rsa-write-key",RUDDERSTACK_API_KEY)
      },
      "undefined"==typeof Promise||"undefined"==typeof globalThis?window.rudderAnalyticsAddScript("https://polyfill-fastly.io/v3/polyfill.min.js?version=3.111.0&features=Symbol%2CPromise&callback=rudderAnalyticsMount"):window.rudderAnalyticsMount()
      ;var loadOptions={};rudderanalytics.load(RUDDERSTACK_API_KEY,"https://upscalewshtqxz.dataplane.rudderstack.com",loadOptions)}}}();

      rudderanalytics.ready(() => {
        rudderanalytics.page(
          "Home Page",
          "Page Viewed",
          () => {
          console.log("Page event successfully submitted to the RudderStack SDK.");
          }
        );
      });
    `}</Script>  
    <Navbar data={navbarData} />
    <main>{children}</main>
    <Footer data={footerData} />
  </div>
);

export function Head() {
  return (
    <>
      <html lang="en" />
    </>
  )
}

export const query = graphql`
  fragment LayoutFragment on Query {
    footerData: allMarkdownRemark(filter: { frontmatter: { templateKey: { eq: "footer" } } }) {
      edges {
        node {
          id
          frontmatter {
            title
            description
            linksTitle
            logoImage {
              image
              imageAlt
              tagline
            }
            footerLinks {
              image
              imageAlt
              label
              linkURL
            }
          }
        }
      }
    }
    navbarData: allMarkdownRemark(filter: { frontmatter: { templateKey: { eq: "navbar" } } }) {
      edges {
        node {
          id
          frontmatter {
            logoImage {
              image
              imageAlt
            }
            menuItems {
              label
              linkType
              linkURL
            }
          }
        }
      }
    }
  }
`;

export default TemplateWrapper;
