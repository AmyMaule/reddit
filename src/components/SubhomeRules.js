import React, { useState, useEffect}  from 'react'

export default function SubhomeRules({ subreddit_prefixed }) {
  const htmlDecodeRules = description => {
    let descriptionContainer = document.createElement("div");
    descriptionContainer.innerHTML = description;
    return descriptionContainer.childNodes.length === 0 ? "" : descriptionContainer.childNodes[0].nodeValue;
  }

  // const [isLoading, setIsLoading] = useState(true);
  const [rules, setRules] = useState([]);

  useEffect(() => {
    fetch(`https://www.reddit.com/${subreddit_prefixed}/about/rules/.json`)
    .then(res => res.json())
    .then(data => {
      if (data) {
        setRules(data.rules);
      }
    })
    .catch(err => console.log("Rules error:", err))
  }, [])

  if (rules) console.log(rules[0])

  return (
    <div className="subhome-rules-container">
      <div className="subhome-rules-heading">{subreddit_prefixed} rules</div>
        <div></div>
        {rules.map((rule, i) => {
          return (
            <div>
              <span className="subhome-rule">{i+1}.</span>
              <span className="subhome-rule" key={i} dangerouslySetInnerHTML={{__html: htmlDecodeRules(rule.short_name)}}></span>
            </div>)
        })}
    </div>
  )
}
