var express = require('express');
const Admindel = require('../../models/Admindelivery');
const Delivery = require('../../models/Delivery');
const Livreur = require('../../models/Livreur');
const checkboxModel = require('../../models/CheckBoxModel');
const CheckBoxModel = require('../../models/CheckBoxModel');
const Nexmo = require('nexmo')
var nodemailer = require('nodemailer')



var router = express.Router();
const verifAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect('/auth');
  }
};

router.get('/all/deliveryman/package/:deliverymanId',verifAuth,async function (req, res, next) {
    const admintab = await Admindel.find({
      deliverymanId: req.params.deliverymanId,
    });
    console.log(admintab);

    
    res.send({ data: admintab });
  }
);
router.get('/all/deliveryman/package/from/:deliverymanId',verifAuth,async function (req, res, next) {
    const admintab = await Admindel.find({
      deliverymanId: req.params.deliverymanId,
    },{ _id : 0, from: 1});
    res.send({ data: admintab });
  }
);
router.get('/all/deliveryman/package/to/:deliverymanId',verifAuth,async function (req, res, next) {
    const admintab = await Admindel.find({
      deliverymanId: req.params.deliverymanId,
    },{ _id : 0, to: 1});
    res.send({ data: admintab });
  }
);

router.delete('/deliverymanpackage/:id', verifAuth, async (req, res, next) => {
  try {
    const devv = await Admindel.findById(req.params.id);
    await devv.remove();
    res.send({ data: true });
  } catch (error) {
    res.status(404).send({ error: 'delivery not found try again' });
  }
});




router.post('/add/:id', verifAuth, async function (req, res, next) {
  const delivery = await Delivery.findById(req.params.id)
    const admintab = new Admindel(req.body);
     admintab.save();
    console.log('admin tab :',admintab);
    console.log('delivery : ',delivery.email);
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
          user: 'raedjarboui1998@gmail.com',
          pass: 'halamadrid02'
      }
  })
  
  let mailOptions = {
      from : 'raedjarboui1998@gmail.com',
      to: delivery.email,
      subject : 'your delivery passed succesfully',
      text: 'hi'
  }
  
  transporter.sendMail(mailOptions, (err, data)=>{
      if (err){
          console.log(err)
      }else{
          console.log('email sent !!!')
      }
  })
  
    res.send({ data: admintab });
  });
router.put('/affecter/:iddeliveryman/:admindel/:vehiculeID', verifAuth, async function (req, res, next){

    Admindel.findById(req.params.admindel)
    .then(function(dbdeliveryman) {
        console.log(dbdeliveryman);
      Admindel.findOneAndUpdate({ _id: dbdeliveryman._id }, {$push: {deliverymanId: req.params.iddeliveryman,vehiculeID:req.params.vehiculeID}}, { new: true })
      .populate("users","vehicules") 
       .then(function(dbadmindel) {
         
         res.json(dbadmindel);
       })
       .catch(function(err) {
       res.sendStatus(404);
       })
     })
});
router.get('/',verifAuth,async function (req, res, next) {
  const nexmo = new Nexmo({
    apiKey: 'bcb34c70',
    apiSecret: 'TFXFdeCQcTOxIAQ6',
});
var to = '21628045727';
var from = 'brandName';
var text = 'someText';
nexmo.message.sendSms(from, to, text);
});



module.exports = router;
