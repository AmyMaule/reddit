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