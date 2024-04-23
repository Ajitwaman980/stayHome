// /listings/:id/edit this is router to edit the data
let Edit_button = document.querySelector(".edit");
Edit_button.addEventListener("click", function (event) {
  event.preventDefault();
  let listingId = this.dataset.listingId;
  window.location.href = `/listings/${listingId}/edit`;
});
