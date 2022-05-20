const express = require('express')
const cors = require('cors');
const { get } = require("express/lib/response");
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
// app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 5000;
const SSLCommerzPayment = require('sslcommerz')
const { v4: uuidv4 } = require('uuid');
const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// 


app.post('/init',async(req, res) => {
    // console.log(req.body);
    const data = {
        total_amount: 100,
        currency: 'BDT',
        tran_id: uuidv4(),
        success_url: 'http://localhost:5000/success',
        fail_url: 'http://localhost:5000/fail',
        cancel_url: 'http://localhost:5000/cancel',
        ipn_url: 'http://localhost:5000/ipn',
        shipping_method: 'Courier',
        paymentStatus:'pending',
        product_name: req.body.product_name,
        product_category: 'Electronic',
        product_image: req.body.product_image,
        product_profile: req.body.product_profile,
        cus_name: req.body.cus_name,
        cus_email: req.body.cus_email,
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
        multi_card_name: 'mastercard',
        value_a: 'ref001_A',
        value_b: 'ref002_B',
        value_c: 'ref003_C',
        value_d: 'ref004_D'
    };
    console.log(data);
    // Insert Order data 
    // const order = await orderCollection.insertOne(data)
    const sslcommer = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_PASSWORD,false) //true for live default false for sandbox
    sslcommer.init(data).then(data => {
        //process the response that got from sslcommerz 
        //https://developer.sslcommerz.com/doc/v4/#returned-parameters
       if(data.GatewayPageURL){
           console.log(data.GatewayPageURL, 'hisid');
        res.json(data.GatewayPageURL)

       }
       else{
         return res.status(400)
         massage:'Payment session faild'
       }
    });
})



app.post('/success' , async(req, res) => {
    console.log(req.body);
    res.status(200).redirect('http://localhost:3000/success')
})
app.post('/fail' , async(req, res) => {
    console.log(req.body);
    res.status(200).redirect('http://localhost:3000/home')
})
app.post('/cancel' , async(req, res) => {
    console.log(req.body);
    res.status(200).redirect('http://localhost:3000/home')})




app.get('/', (req, res) => {
  res.send('Hello ssl commerce!')
})

app.listen(port, () => {
  console.log(` listening at ${port}`)
})