$(document).ready(() => {
  $("#tweet-text").on("input", () => {
    const counter = 140 - ($("#tweet-text").val()).length;
    $(".counter").val(counter)
    if (counter < 0) {
      $(".counter").addClass("textError")
    } else {
      $(".counter").removeClass("textError")
    }
    })
})