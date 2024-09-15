async function navigateToPage() {
    const dropdown = document.getElementById('sort');
    const selectedValue = dropdown.value;

    if (!selectedValue) return 0;

    try {if(!selectedValue) return ;
        // Fetch listings based on selected category and sort order
        console.log(selectedValue)
        const response = await axios.get(`/listings/category/cat/${selectedValue}`);
        
        const listings = response.data;
        const cardContainer = document.getElementById('cardmain');
        let cardsHtml = '<div class="flex w-full flex-wrap justify-center gap-4 ">';  //main card

        if (Array.isArray(listings) && listings.length > 0) {
            listings.forEach(listing => {
                // Calculate discounted price
                let basePrice;
                if (listing.price > 2000) {
                    basePrice = listing.price - 2000;
                } else {
                    basePrice = listing.price - 100;
                }

                
                cardsHtml =cardsHtml+ `
           
            <a href="/listings/${listing._id}" class="block rounded-lg  px-2 shadow-lg overflow-hidden" style="height: 25.4rem; width: 310px;">
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
            });
            cardsHtml=cardsHtml+'</div>';
            cardContainer.innerHTML = cardsHtml;  // set the html conetent for cardcontainer
        } else {
            cardContainer.innerHTML = '<p class="w-full p-4 h-20 font-semibold bg-red-400 text-center">No results found.</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
