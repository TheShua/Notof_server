const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const cloudinary = require('../config/cloudinary-config');
const upload = require('../config/multer-config');


const User = require('../Models/User');


router.get('/', async (req, res, next) => {
  try {
    let all_users = await User.find({});
    res.status(200).json(all_users);
  } catch (err) {
    console.log("[GET USERS ROUTE ERR]", err);
    res.status(500).json({ message: "Erreur durant la récupération des utilisateurs." });
  }
});

router.get('/:user_id', async (req, res, next) => {
  try {
    let user = await User.findById(req.params.user_id);
    res.status(200).json(user);
  } catch (err) {
    console.log("[GET USER ROUTE ERR]", err);
    res.status(500).json({ message: "Erreur durant la récupération de l'utilisateur." });
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

  try {
    let new_user = await User.create(new_user_data);
    return res.status(201).json(new_user);
  } catch (err) {
    console.log("[ERR POST USER ROUTE ERR]", err);
    return res.status(500).json({ message: "Un incident s'est produit durant la création de votre compte. Veuillez réessayer plus tard ou contacter Guillaume et Nelly :D" });
  }
});

router.put('/:user_id', upload.single('avatar'), async (req, res) => {
 
  try {
    let user = await User.findById(req.params.user_id)

    let updated_user_data = {
      username: req.body.username,
      email: req.body.email,
    };
  
    if (req.file) {
        const avatar = await cloudinary.uploader.upload(req.file.path);
        updated_user_data.avatar = avatar.secure_url;
    }
  
    // CHECKS IF THE USERNAME OR EMAIL ARE ALREADY TAKEN
    let existing_user = await User.find({ $or: [{ email: updated_user_data.email }, { username: updated_user_data.username }] });
    
    if (updated_user_data.email === existing_user.email) {
      return res.status(500).json({ message: "Cet e-mail est déjà associé à un compte." });
    }
  
    if (updated_user_data.username === existing_user.username) {
      return res.status(500).json({ message: "Ce pseudo est déjà utilisé :(." });
    }
  
    let updated_user = await user.update(updated_user_data);
  
    return res.status(200).json(updated_user);

  } catch (err) {
    console.log("[ERR PUT USER ROUTE ERR]", err);
    return res.status(500).json({ message: err })
  }
});

router.delete('/:user_id', async (req, res) => {
  try {
    await User.deleteOne({ id: req.params.user_id });
    return res.status(200).json({ message: "L'utilisateur a bien été supprimé." });
  } catch (err) {
    console.log("[ERR DELETE USER ROUTE ERR]", err);
    return res.status(500).json({ message: "Echec lors de la suppression de l'utilisateur" });
  }
});



module.exports = router;
