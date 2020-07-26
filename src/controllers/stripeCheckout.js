const uuid = require('react-uuid');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { paidOrderModel } = require('../models/paidOrder');

function getStripe(req, res) {
    res.send(process.env.STRIPE_KEY);
}

async function addStripe(req, res) {
    // console.log("Request:", req.body);

    let error;
    let status;
    try {
    const { price, token, orders } = req.body;

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });

    const idempotencyKey = uuid();
    const charge = await stripe.charges.create(
      {
        amount: price * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: 'orders',
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip
          }
        }
      },
      {
        idempotencyKey
      }
    );
    // console.log("Charge:", { charge });
    


    const newPaidOrder = new paidOrderModel ({
      orders,
      shippingAddresss: `${token.card.address_line1} 
      ${token.card.address_line2}
      ${token.card.address_city}
      ${token.card.address_country}
      ${token.card.address_zip}`
    })
    newPaidOrder.save()
    
    status = "success";

  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }

  res.json({ error, status });
}



module.exports = {
  getStripe,
  addStripe,
}