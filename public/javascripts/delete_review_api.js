const delete_reviews = document.querySelector(".delete-review");
delete_reviews.addEventListener("click", async function (e) {
  e.preventDefault();
  const listingId = this.getAttribute("data-listing-id");
  const reviewId = this.getAttribute("data-review-id");
  console.log(listingId, reviewId);
  // axios request
  try {
    const res = await axios.delete(
      `/listings/${listingId}/reviews/${reviewId}`
    );
    console.log(res.data);
    // return res.redirect(`/listings/${listingId}`)
    window.location.href = `/listings/${listingId}`;
  } catch (error) {
    console.log(error);
    console.log("this happend when deleteed reviewwd");
  }
});
