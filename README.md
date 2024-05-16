# Reddit Clone

<!-- TABLE OF CONTENTS -->
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <details open="open">
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#demo--screenshots">Demo & Screenshots</a></li>
    <li><a href="#current-issues">Current Issues</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>
<br>


<!-- ABOUT THE PROJECT -->
## About The Project

This is a frontend clone of [Reddit](https://www.reddit.com/), using the [Reddit API](https://www.reddit.com/dev/api/) to display posts and comments as on reddit.com. This version allows searching by hot, new, top and rising (and sub-searching by top of today, this week, this month, this year and all time). This SPA has 3 'pages' - the homepage, a page for each subtopic (subreddit) and a page for each post. Click on any link beginning with "r/" to visit a subreddit homepage, and click on the content of any post, its title or comment button to visit the post in detail including all comments.

<br>
Note: This site was originally created in 2021. In 2023, Reddit made harsh changes to their API including reducing the rate limits for the Data API such that this app rapidly reaches the limits when used normally. When browsing this SPA frontend Reddit clone, be aware that these API changes may cause the site to temporarily stop working as the limits are reached. This is intentional on Reddit's part.

More info in [this statement](https://www.reddit.com/r/reddit/comments/145bram/addressing_the_community_about_changes_to_our_api/) from the Reddit CEO.
<br>

## Demo & Screenshots
Some videos in case there are any changes to the Reddit API that result in the live site not functioning correctly: <br><br>
<div align="center">
  <img src="./readme/homepage.gif" width="80%" />
  <br><br><br><br>
  <img src="./readme/top.gif" width="80%" />
  <br><br><br><br>
  <img src="./readme/subhome.gif" width="80%" />
</div>
<br><br>

# Live version [here](https://amy-reddit.pages.dev/).
<br>

### Built With

* React
* CSS
* [Markedjs](https://github.com/markedjs/marked)
<br>

## Next Steps
* Use the before/after API endpoints to alert users of new posts, and to load posts when the user scrolls towards the bottom of the page
* Add default trending posts/subreddits to the navbar that display automatically if there are no subreddits that match the current search, or while the searchbar is empty 
* Create the homepage for each user, pulling in their post data and comment history
* The site is currently only responsive down to ~760px; create responsive layouts for smaller screens

## Current Issues
* Due to CORS issues with the Reddit API, the site doesn't display correctly on Firefox if the user has enabled strict tracking protection
* The Geofilter search option on the homepage isn't functional, as the Reddit API no longer allows access to this data
* The fetch requests for each page sometimes take a few seconds to load all the data, so all the data doesn't always display at the same time
<br>

## Contributing

If you find a bug, please open an issue [here](https://github.com/AmyMaule/reddit/issues/new), including as much information as you can.<br>
You can request new features or modify current features [here](https://github.com/AmyMaule/reddit/issues/new) - please include search queries and expected results.
<br>

## License
MIT © [Amy Maule](https://github.com/AmyMaule)
