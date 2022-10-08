import React, { useState, useEffect }  from 'react';

import { htmlDecode } from '../utilities';

const marked = require('marked');

export default function SubhomeRules({ cachedPostData }) {
  const [rules, setRules] = useState([]);

  const rulesBackground = cachedPostData.primary_color || cachedPostData.key_color || "#444e59";

  useEffect(() => {
    const abortRules = new AbortController();
    fetch(`https://www.reddit.com/${cachedPostData.display_name_prefixed}/about/rules/.json`, { signal: abortRules.signal })
      .then(res => res.json())
      .then(data => {
        if (data) setRules(data.rules);
      })
      .catch(err => {
        if (err.name !== "AbortError") console.log("Rules error:", err);
      })
    return () => abortRules.abort();
  }, [cachedPostData.display_name_prefixed]);

  // toggleRule adds the inner rule text as a child, or removes it
  const toggleRule = (e, i) => {
    // some rules don't have a further description, so return out of the function
    if (!rules[i].description) return;

    // transformTarget is the arrow on the right hand side
    const transformTarget = e.currentTarget.parentElement.lastElementChild.firstChild;
    transformTarget.style.transform = transformTarget.style.transform === "rotate(180deg)" ? "rotate(0deg)" : "rotate(180deg)";

    // If there are 3 child nodes, the rule is already open and the last child element should be removed to close it
    if (e.currentTarget.childElementCount === 3) {
      e.currentTarget.removeChild(e.currentTarget.lastElementChild);
      return;
    }

    // ruleNumber is the number of the rule that was clicked - a new div with the rule's description is appended to this rule
    let ruleNumber = e.currentTarget.firstChild.innerText.slice(0, -1);
    let innerRule = document.createElement("div");
    innerRule.classList.add("subhome-rule-inner")
    // Use the markedjs library to turn markdown into html
    innerRule.innerHTML = marked(htmlDecode(rules[ruleNumber-1].description));
    e.currentTarget.appendChild(innerRule);
  }

  if (!rules) return null;

  return (
    <div className="subhome-rules-container">
      <div className="subhome-rules-heading" style={{color: "white", backgroundColor: rulesBackground}}>
        {cachedPostData.display_name_prefixed} rules
      </div>
      <div className="subhome-rules-inner-container">
        {rules.map((rule, i) => {
          const cursorStatus = rules[i].description ? "pointer" : "unset";
          return (
            <div className="subhome-rule-container-outer" key={i} style={{cursor: cursorStatus}}>
              <div onClick={e => toggleRule(e, i)} className="subhome-rule-container">
                <span className="subhome-rule-number">{i+1}.</span>
                <span className="subhome-rule" dangerouslySetInnerHTML={{__html: htmlDecode(rule.short_name)}}></span>
              </div>
              {rules[i].description &&
                <div className="v-container">
                  <img src="images/v.png" className="subhome-v-icon" alt="" />
                </div>
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}
