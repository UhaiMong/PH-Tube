function toggleAnswer(event) {
  var question = event.target;
  var answer = question.nextElementSibling;
  if (answer.style.display == "none") {
    answer.style.display = "block";
  } else {
    answer.style.display = "none";
  }
}
function addListeners() {
  var questions = document.querySelectorAll(".faq-item h3");
  for (var i = 0; i < questions.length; i++) {
    questions[i].addEventListener("click", toggleAnswer);
  }
}

window.onload = function () {
  addListeners();
};
