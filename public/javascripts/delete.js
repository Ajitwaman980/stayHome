//     <a href="/listings/<%=listing_info._id %>/delete">Delete this listing</a>
// /listings/:id/delete route this is router to go and delete data
let Delete_button = document.querySelector(".delete");
Delete_button.addEventListener("dblclick", function (event) {
  alert("Are You Sure You Delete Your Data !");
  event.preventDefault();
  let listingId = this.dataset.listingId;
  window.location.href = `/listings/${listingId}/delete`;
});
