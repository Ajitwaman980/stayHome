const stripe = require("stripe")(process.env.Secret_key);
async function verifyuser(req, res, next) {
  //   console.log(req.body);
  //   console.log("working ");
  try {
    const customer = await stripe.customers.create({
      name: req.body.name,
      email: req.body.email,
    });
    req.flash("warning", "We do not store your personal details ");
    res.render("../views/payments/carddetails.ejs", {
      paymentid: customer.id,
      id: req.params.id,
      warning: req.flash("warning"),
    });
  } catch (error) {
    req.flash("error", "Payment Error Something went wrong");

    res.redirect(`/listings/${req.params.id}`);
  }
}
async function card_details(req, res) {
  try {
    const {
      customer_id,
      card_Name,
      card_ExpYear,
      card_ExpMonth,
      card_Number,
      card_CVC,
    } = req.body;
    if (
      !customer_id ||
      !card_Name ||
      !card_ExpYear ||
      !card_ExpMonth ||
      !card_Number ||
      !card_CVC
    ) {
      req.flash("error", "Invalid customer or card details");
      return res.redirect(`/listings/${req.params.id}`);
    }

    res.send(`
        <div style="text-align: center; margin-top: 50px;">
          <h1 style="color: green;">Payment has been successfully done</h1>
          <a href="/listings/${req.params.id}" style="text-decoration: none;">
            <button style="padding: 10px 20px; background-color: #007bff; color: white; border: none; cursor: pointer; margin-top: 20px;">
              Back
            </button>
          </a>
        </div>
      `);
  } catch (e) {
    res.redirect(`/listings/${req.params.id}`);
  }
}
module.exports = { card_details, verifyuser };
