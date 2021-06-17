/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(() => {
  $(".new-tweet p").hide()
  //loads all tweets
  const loadTweets = () => {
    $.get("/tweets", (data) => {
    renderTweets(data)
   })
 }
 //checks user input for xss
 const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};
  //checks if textarea is empty or overfilled then sends post to server if not and returns it to the body
  const submitButton = () => {
    $(".tweet-form").submit((event) => {
      
      if (!$("#tweet-text").val()) {
      event.preventDefault();
      $(".new-tweet p").text("Oi Fool, You Ain't Got Nutt'in Written.");
      $(".new-tweet p").slideDown("slow", () => {
        $(".new-tweet p").show();
      }) 
      return;
      } else if ($("#tweet-text").val().length > 140) {
      event.preventDefault();
      $(".new-tweet p").text("I Get That You're A Self Proclaimed Author But Pls Chill Out with The Book");
      $(".new-tweet p").slideDown("slow", () => {
        $(".new-tweet p").show();
      }) 
      return;
      }
      event.preventDefault();

      $.post("/tweets", $(".tweet-form").serialize())
      .then(() => {
        $("#tweet-text").val("");
        $(".new-tweet p").hide()
        return $.get("/tweets");
      })
      .then((tweets) => {
        $('.tweet-container').prepend(createTweetElement(tweets.pop()))
      })
      .catch((err)=>{
        console.log(`error trying to load more: ${err}`);
      })
      })
  }

  // creates all the HTML needed to generate new tweets in body and checks if it has xss
  const createTweetElement = (tweet) => {
    const html = `
    <article>
    <div class="usernames">
    <p>${escape(tweet.user.name)}</p>
    <p>${escape(tweet.user.handle)}</p>
    </div>
    <p class="body-text">${escape(tweet.content.text)}</p>
    <div class="bellow">
    <span class="need_to_be_rendered time">${timeago.format(tweet.created_at)}</span>
    <div class="icons">
    <i class="fas fa-heart"></i>
    <i class="fas fa-flag"></i>
    <i class="fas fa-retweet"></i>
    </div>
    </div>
    </article>
    `;
    return html;
  }
  // this renders the tweets that already exsisted
  const renderTweets = function(tweets) {
    // loops through tweets
    for (info of tweets.reverse()) {
      // calls createTweetElement for each tweet
      //console.log(info.user)
      // takes return value and appends it to the tweets container
      $('.tweet-container').append(createTweetElement(info));
    }
    return;
  }







  submitButton();
  loadTweets();
  
})
