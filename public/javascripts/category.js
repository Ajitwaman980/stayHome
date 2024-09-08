document.addEventListener('DOMContentLoaded', function () {
    const categoryLinks = document.querySelectorAll('.category-link');

    categoryLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const category = this.getAttribute('data-category');
        //  console.log(category)
            axios.get(`/listings/user/search/${category}`)
                .then(function (response) {
                    const listings = response.data;
                    const cardContainer = document.getElementById('cardmain');
                    cardContainer.innerHTML = '';

                    if (listings.length > 0) {
                        listings.forEach(listing => {

                            // prices discount 2000
                            let basePrice;
                            if (listing.price > 2000) {
                                basePrice = listing.price - 2000;

                            }
                            else {
                                basePrice = listing.price - 100;
                            }
                            const card = `
          <a href="/listings/${listing._id}" class="block  rounded-lg shadow-lg overflow-hidden" style="height: 25.4rem; width: 310px;">
           <img src="${listing.image.Url}" class="w-full h-64 object-cover" alt="image">
            <div class="p-1 px-2 py-4 bg-zinc-200 h-full w-full">
            <p class="text-black text-xl font-bold mb-1">
                ${basePrice} &#8377;
                <span class="text-sm text-gray-500 inline-block" style="margin: -7px;">/Night</span>
                <span class="text-gray-500 items-end px-8 line-through text-lg font-normal justify-end inline-block">
                    <span>${listing.price} &#8377;<span>Night</span></span>
                </span>
            </p>
            <p class="text-xl text-wrap text-black font-bold">${listing.title}</p>
            <p class="text-sm py-1 text-wrap text-black font-semibold">${listing.location}</p>
            <div class="flex justify-between w-full py-1 border-t-2 border-yellow-800">
                <div><i class="fas fa-bath text-green-500 mr-2"></i>${listing.bathroom}</div>
                <div><i class="fas fa-bed text-purple-500 mr-2"></i>${listing.bed}</div>
                <div><i class="fas fa-square text-blue-500 mr-2"></i>${listing.areaHousewidth} X ${listing.areaHouseheight}</div>
            </div>
        </div>
    </a>
`;
                            cardContainer.innerHTML = card;
                        });
                    } else {
                        cardContainer.innerHTML = '<p class="w-full p-4 h-20 font-semibold bg-red-400 text-center ">No results found.</p>';
                    }
                })
                .catch(function (error) {
                    console.error('Error fetching data:', error);
                });
        });
    });
});
