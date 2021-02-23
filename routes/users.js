const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../Models/User');


router.get('/', async (req, res, next) => {
  try {
    let all_users = await User.find({})
    res.status(200).json(all_users)
  } catch (err) {
    console.log("[GET USERS ROUTE]", err)
    res.status(500).json({message : "Erreur durant la récupération des utilisateurs."})
  }
});

router.post('/', async (req, res, next) => {

  let new_user_data = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  // CHECKS IF GOT ALL REQUIRED DATA

  if (!new_user_data.email || !new_user_data.username || !new_user_data.password || !req.body.password_check) {
    return res.status(500).json({ message: "Veuillez compléter tous les champs." });
  }

  // CHECKS IF THE USERNAME OR EMAIL ARE ALREADY TAKEN
  let existing_user = await User.find({ $or: [{ email: new_user_data.email }, { username: new_user_data.username }] });
  
  if (existing_user.email === new_user_data.email) {
    return res.status(500).json({ message: "Cet e-mail est déjà associé à un compte." });
  }

  if (existing_user.username === new_user_data.username) {
    return res.status(500).json({ message: "Ce pseudo est déjà utilisé :(." });
  }

  //CHECKS IF THE PASSWORD AND PASSWORD CHECK ARE THE SAME
  if (new_user_data.password !== req.body.password_check) {
    return res.status(500).json({ message: "Les deux mots de passe sont différents." });
  }

  // PASSWORD ENCRYPTION 

  const saltRounds = 10;

  const hashed_password = bcrypt.hashSync(new_user_data.password, saltRounds);
  new_user_data.password = hashed_password;

  //TO DO : MOVE TO LOGIN
  // const is_valid_password = bcrypt.compareSync(req.body.password, user.password)

  try {
    let new_user = await User.create(new_user_data);
    return res.status(201).json(new_user);
  } catch (err) {
    console.log("[ERR POST USER ROUTE]", err)
    return res.status(500).json({ message: "Un incident s'est produit durant la création de votre compte. Veuillez réessayer plus tard ou contacter Guillaume et Nelly :D" });
  }


});

module.exports = router;
