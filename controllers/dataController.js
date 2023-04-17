const User = require(`../models/user`);
const bcrypt = require('bcryptjs')
const { check, validationResult } = require(`express-validator`);
const { getMaxListeners } = require(`../models/user`);
const BankAccount = require(`../models/user`);

exports.home = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.status(200).render('home', { message: 'welcome to my first Middleware REST APT' });// send in signup.ejs file
}
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.status(200).render('signup', { pageTitle: `Sign Up Form` });// send in signup. ejs file
}

exports.signup = async (req, res) => {
    const errors = validationResult (req);
    if (!errors.isEmpty) {
        return res.status(400).json({ errors: errors.array() });
    }
    //create user
    const { accountName, accountNumber, accountHolder, email, accountType } = req.body;
    try {
        console.log(typeof BankAccount);
        BankAccount.create ({
                accountName: accountName,
                accountNumber: accountNumber,
                accountHolder: accountHolder,
                email: email,
                accountType: accountType
        }).then(user => res.json(user));
    } catch (error) {
        console.log(error);
        const errors = validationResult(req);
        const errorDetails = [
            {
                "location": "Authorization",
                "msg": `${accountName} ${error}`,
                "param": accountName
            }
        ];
        res.json({errors: errorDetails});
    }
}
exports.loginForm = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.status(200).render('login', { pageTitle: 'Login Form' }); // send back the login.ejs file
}
exports.login = async (req, res) => {

    //find the user
    const bankAccount = await BankAccount.findOne({ email: req.body.email });

    console.log(BankAccount);
    console.log(req.body.password);

    if(!bankAccount) {
        return res.status(401).render ('home',{ message: `<<Error>> login un-successfully invalid credentials`});
    }
    //compare the password
    const isMatch = await bcrypt.compare(req.body.password, bankAccount.password);
    if (!isMatch) {
        return res.status(401).render ('home',{ message: `<<Error>> Account: ${bankAccount.name} login un-successfully`});
    }
    //login user
    try {
    let token = await BankAccount.generateAuthToken();
    res.cookie('jwtoken', token, {
        expires: new Date(Date.now() + 25892000000),
        httponly: true
    });
    res.status(200).render('home',{ message: `Account: ${bankAccount.name} login successfully`});
} catch (error) {
console.log(error);
res.status(401).render ('home',{ message: `Account: ${bankAccount.name} Error: ${error} login un-successfully`});
}
}

exports.logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((currentElement) => {
            return currentElement.token !== req.token;
        });
        res.clearCookie('jwtoken', { path: '/' });
        await reg.user.save();
        res.status(200).send('Account logout');
        } catch (error) {
        console.log(error);
        }
}