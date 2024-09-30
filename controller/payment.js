const stripe = require("stripe")(process.env.Secret_key);
const customerschema = require("../model/customerschema");
const User = require("../model/user.js"); // user model

async function verifyuser(req, res, next) {
  try {
    // Check if user has a discount code and if it hasn't been used
    if (req.user && req.user.discountCode && !req.user.discountUsed) {
      req.user.discountUsed = true;
      await req.user.save();
    }

    // Create a new Stripe customer
    const customer = await stripe.customers.create({
      name: req.body.name,
      email: req.body.email,
    });

    // Store customer info in your database
    const data = new customerschema({
      name: req.body.name,
      email: req.body.email,
      stripeCustomerId: customer.id,
    });
    await data.save();

    // Flash warning message
    req.flash("warning", "We do not store your personal details");
    
    // Render the card details page, passing necessary info
    res.render("../views/payments/carddetails.ejs", {
      paymentid: customer.id,
      id: req.params.id,
      warning: req.flash("warning"),
    });
  } catch (error) {
    console.error("Payment verification error: ", error);
    req.flash("error", "Payment Error: Something went wrong");
    res.redirect(`/listings/${req.params.id}`);
  }
}

async function card_details(req, res) {
  try {
    const { customer_id, card_Name, card_ExpYear, card_ExpMonth, card_Number, card_CVC } = req.body;

    // Validate required fields
    if (!customer_id || !card_Name || !card_ExpYear || !card_ExpMonth || !card_Number || !card_CVC) {
      req.flash("error", "Invalid customer or card details");
      return res.redirect(`/listings/${req.params.id}`);
    }

    // Simulate successful payment (you would integrate Stripe's payment API here)
    res.send(`
      <div style="text-align: center; margin-top: 50px;">
        <h1 style="color: green;">Payment has been successfully completed</h1>
        <a href="/listings/${req.params.id}" style="text-decoration: none;">
          <button style="padding: 10px 20px; background-color: #007bff; color: white; border: none; cursor: pointer; margin-top: 20px;">
            Back
          </button>
        </a>
      </div>
    `);
  } catch (e) {
    console.error("Card details error: ", e);
    req.flash("error", "Error processing payment. Please try again.");
    res.redirect(`/listings/${req.params.id}`);
  }
}

module.exports = { card_details, verifyuser };
