import * as $ from 'jquery';

var slideIndex = 1;
console.log("HHfddf11");
$(document).ready(function() {

   /* $( "#prev" ).click(function() {  console.log("SDG");
      slideIndex++;
      showSlides(slideIndex);
  });
  
    $( "#next" ).click(function() {
      slideIndex++;
      showSlides(slideIndex);
  });*/

});

function prevPhoto()
{
  slideIndex--;
  showSlides(slideIndex);
}

function nextPhoto()
{
  slideIndex++;
  showSlides(slideIndex);
}

function showSlides(n) { 
  var i; 
  var slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  slides[slideIndex-1].style.display = "block"; 
}