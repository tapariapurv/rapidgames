function rateGame(el, rating) {
    let stars = el.parentNode.querySelectorAll("span");
    stars.forEach((star, index) => {
      star.style.color = (5 - index) <= rating ? "gold" : "gray";
    });
    document.getElementById("rating-result").innerText = "You rated this game " + rating + " stars!";
  }
  