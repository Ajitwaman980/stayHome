const GST = document.getElementsByClassName("GST");
consttaxes = document.getElementById("taxes");
taxes.addEventListener("click", function () {
  for (tax of GST) {
    if (tax.style.display != "inline") {
      tax.style.display = "inline";
    } else {
      tax.style.display = "none";
    }
  }
  console.log("clicked");
  console.log(GST);
});
