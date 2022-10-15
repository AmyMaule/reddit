export const htmlDecode = text => {
  let textContainer = document.createElement("div");
  textContainer.innerHTML = text;
  return textContainer.childNodes.length === 0 ? "" : textContainer.childNodes[0].nodeValue;
}

export const htmlDecodeWithReplace = text => {
  let textContainer = document.createElement("div");
  textContainer.innerHTML = text.public_description_html;
  if (textContainer.childNodes.length !== 0) {
    let decodedText = textContainer.childNodes[0].nodeValue;
    // the original description of many subreddits includes a link to the subreddit which causes an error, so replace the link with a span
    decodedText = decodedText.replace("</a>", "</span>");
    return decodedText.replace(`<a href="/${text.display_name_prefixed}">`, "<span>")
  }
}

// determine how long ago a post/comment was created
export const determineTimePosted = (created, shortened) => {
  const timeNow = Date.now();
  const postedMsAgo = timeNow/1000 - created;
  
  if (isNaN(postedMsAgo)) return;
  
  if (postedMsAgo < 60 && !shortened) {
    return "A few seconds";
  } else if (postedMsAgo < 120 && !shortened) {
    return "1 minute";
  } else if (postedMsAgo < 3600) {
    return `${(postedMsAgo/60).toFixed(0)}${shortened ? "m" : " minutes"}`;
  } else if (postedMsAgo < 5400 && !shortened) { // 5400 is 1.5 hours
    return "1 hour";
  } else if (postedMsAgo < 86400) { // 86400 is 24 hours
    return `${(postedMsAgo/3600).toFixed(0)}${shortened ? "h" : " hours"}`;
  } else if (postedMsAgo < 129600 && !shortened) {  // 129600 is 1.5 days
    return "1 day";
  } else if (postedMsAgo < 2.592e+6) {  // 2.592e+6 is 30 days
    return `${(postedMsAgo/86400).toFixed(0)}${shortened ? "d" : " days"}`;
  } else if (postedMsAgo < 3.942e+6 && !shortened) {  // 3.942e+6 is 1.5 months
    return "1 month";
  } else if (postedMsAgo < 3.154e+7) {  // 3.154e+7 is 1 year
    return `${(postedMsAgo/2.592e+6).toFixed(0)}${shortened ? "m" : " months"}`;
  } else if (postedMsAgo < 4.73e+7 && !shortened) {  // 4.73e+7 is 1.5 years
    return "1 year";
  } else {
    return `${(postedMsAgo/3.154e+7).toFixed(0)}${shortened ? "y" : " years"}`;
  }
}

// if a post has fewer than 0 upvotes, upvotes is 0 and downvotes keeps the vote tally
// otherwise upvotes keeps the tally and downvotes is 0
export const determineNumVotes = (upvotes, downvotes) => {
  if (upvotes > 0) {
    if (upvotes < 1000) {
      return upvotes;
    } else if (upvotes > 100000) {
      return `${(upvotes/1000).toFixed(0)}k`;
    } else return `${(upvotes/1000).toFixed(1)}k`;
  } else if (downvotes < 1000) {
    return downvotes;
  } else return `-${(downvotes/1000).toFixed(1)}k`;
}
