var express = require('express');
const Delivery = require('../../models/Delivery');
const checkboxModel = require('../../models/CheckBoxModel');
var nodemailer = require('nodemailer')

var router = express.Router();
const verifAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect('/auth');
  }
};

router.post('/add', verifAuth, async function (req, res, next) {
  const devv = new Delivery(req.body);
  await devv.save();
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
    to: 'raedjarboui1998@gmail.com',
    subject : 'sending mail with node',
    text: 'hi'
}

transporter.sendMail(mailOptions, (err, data)=>{
    if (err){
        console.log(err)
    }else{
        console.log('email sent !!!')
    }
})
  res.send({ data: devv });

});

router.get('/all/:id', verifAuth, async function (req, res, next) {
  const devv = await Delivery.find(
    { userId: req.params.id }
    // { _id: 1, username: 1, email: 1, adresse: 1, phone: 1 }
  );
  res.send({ data: devv });
});
router.get(
  '/listdeliverybycompany/:id',
  verifAuth,
  async function (req, res, next) {
    const devv = await Delivery.find(
      { companyId: req.params.id }
      // { _id: 1, username: 1, email: 1, adresse: 1, phone: 1 }
    );
    res.send({ data: devv });
  }
);

router.get('/passdelivery/:id', verifAuth, async (req, res, next) => {
  try {
    const devv = await Delivery.findById(req.params.id);
    res.send({ data: devv });
  } catch (error) {
    res.status(404).send({ error: 'delivery not found try again' });
  }
});

router.delete('/passdelivery/:id', verifAuth, async (req, res, next) => {
  try {
    const devv = await Delivery.findById(req.params.id);
    await devv.remove();
    res.send({ data: true });
  } catch (error) {
    res.status(404).send({ error: 'delivery not found try again' });
  }
});

router.patch('/passdelivery/:id', verifAuth, async (req, res, next) => {
  try {
    const devv = await Delivery.findById(req.params.id);
    Object.assign(devv, req.body);
    devv.save();
    res.send({ data: devv });
  } catch (error) {
    res.status(404).send({ error: 'delivery not found try again' });
  }
});

router.get('/admin/passdelivery/:id', verifAuth, async (req, res, next) => {
  try {
    const devv = await checkboxModel.findById(req.params.id);
    res.send({ data: devv });
  } catch (error) {
    res.status(404).send({ error: 'delivery not found try again' });
  }
});

router.get('/all/from', verifAuth, async (req, res, next) => {
  const devv = await Delivery.find({}, { _id: 0, from: 1 });
  res.send({ data: devv });
});
router.get('/all/to', verifAuth, async function (req, res, next) {
  const devv = await Delivery.find({}, { _id: 0, to: 1 });
  res.send({ data: devv });
});

module.exports = router;
