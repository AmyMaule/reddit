import React, { useState, useEffect, useMemo }  from 'react';
import V from "../images/v.png";
const marked = require('marked');

export default function SubhomeRules({ cachedPostData }) {
  const [rules, setRules] = useState([]);

  const htmlDecodeRules = description => {
    let descriptionContainer = document.createElement("div");
    descriptionContainer.innerHTML = description;
    return descriptionContainer.childNodes.length === 0 ? "" : descriptionContainer.childNodes[0].nodeValue;
  }

  useEffect(() => {
    const abortRules = new AbortController();
    fetch(`https://www.reddit.com/${cachedPostData.display_name_prefixed}/about/rules/.json`, { signal: abortRules.signal })
    .then(res => res.json())
    .then(data => {
      if (data) {
        setRules(data.rules);
      }
    })
    .catch(err => {
      if (err.name !== "AbortError" && err.name !== "TypeError") console.log("Rules error:", err);
    })
    return () => {
      abortRules.abort();
    }
  }, []);

  // This moves the v arrows towards the middle of their section based on the height of the parent element
  useEffect(() => {
    let vArrows = Array.from(document.querySelectorAll(".v-container"));
    vArrows.forEach(arrow => {
      if (arrow.parentElement.clientHeight > 55) {
        arrow.style.bottom = "20px";
      }
    })
  }, [rules]);

  // toggleRule adds the inner rule text as a child, or removes it
  const toggleRule = e => {
    let transformTarget = e.currentTarget.childElementCount === 4 ? e.currentTarget.lastElementChild.previousElementSibling.firstChild : e.currentTarget.lastElementChild.firstChild;
    // this rotates the arrow on the right hand side
    transformTarget.style.transform = transformTarget.style.transform === "rotate(180deg)" ? "rotate(0deg)" : "rotate(180deg)";

    // If there are more than 3 child nodes, it means that the rule is already open and should be closed, so the last child element is removed
    if (e.currentTarget.childElementCount === 4) {
      e.currentTarget.removeChild(e.currentTarget.lastElementChild);

      // if the rule container is less than 55px high, move the arrow back to the center when the rule is closed
      if (e.currentTarget.clientHeight < 55) {
        e.currentTarget.lastChild.style.bottom = "10px";
      }
      return;
    }

    // ruleNumber gets the number of the rule that was clicked on
    let ruleNumber = e.currentTarget.firstChild.innerText.slice(0, -1);
    let innerRule = document.createElement("div");
    innerRule.classList.add("subhome-rule-inner")
    // Use the markedjs library to turn markdown into html
    innerRule.innerHTML = marked(htmlDecodeRules(rules[ruleNumber-1].description));
    e.currentTarget.appendChild(innerRule);
  }

  if (!rules) return <></>;
  return (
    <div className="subhome-rules-container">
      <div className="subhome-rules-heading" style={{color: "white", backgroundColor: cachedPostData.primary_color || cachedPostData.key_color || "#444e59"}}>{cachedPostData.display_name_prefixed} rules</div>
      <div className="subhome-rules-inner-container">
        {rules.map((rule, i) => {
          return (
            <div onClick={toggleRule} key={i} className="subhome-rule-container">
              <span className="subhome-rule-number">{i+1}.</span>
              <span className="subhome-rule" dangerouslySetInnerHTML={{__html: htmlDecodeRules(rule.short_name)}}></span>
              <div className="v-container">
                <img src={V} className="subhome-v-icon" alt="" />
              </div>
            </div>)
        })}
      </div>
    </div>
  )
}