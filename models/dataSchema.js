const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BankAccountSchema = new mongoose.Schema ({
    accountName: {
        type: String,
        required: true, //this will make sure that the name is required
        unique: true //this will make sure that the name is unique
    },
    accountNumber: {
        type: String,
        required: true, //this will make sure that the name is required
        unique: true, 
        range: {
            min: 1000000,
            max: 2000000,
        },
    },
    accountHolder: {
        type: String,
        required: true, //this will make sure that the name is required
        unique: true, 
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: (value) => /^[\w-\.]+@([\w-.]+\.)+[\w-]{2,4}$/.test(value),
            message: (props) => `${props.value} is not a valid email address`,
        },
        unique: true,
    },
    date: {
        type: Date,
        default: Date.now //this will automatically add the date
},
accountType: {
    type: String, 
    enum: ["Checking", "Savings"],
    required: true,
}
});

// this function will run before the user is saved to the database
BankAccountSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmPassword = await bcrypt.hash(this. confirmPassword, 10);
        this.confirmPassword = undefined // so that it does not store in the
}
next();
});
//this functions genertes the token
BankAccountSchema.methods.generateAuthToken = async function() {
    try {
        let token = jwt.sign({_id: this._id}, process.env.TOKEN_SECRET_KEY);
        // this. tokens = this. tokens. concat ({token: token});
        // await this.save(Q;
        return token;
    } catch (error) {
        console.log(error);
    }
}

//this function will compare the password
BankAccountSchema.methods.verifyPassword = async function (password) {
    const user = this;
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        throw new Error ('Unable to login');
    }
    return user;

}
//
BankAccountSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error ('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, bankaccount.password);
    if (!isMatch) {
        throw new Error ('Unable to login');
    }
    return user;
}
const authorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => /^[\w-\.]+@([\w-.]+\.)+[\w-]{2,4}$/.test(value),
            message: (props) => `${props.value} is not a valid email address`,
        },
    },
    age: {type: Number, required: true, min: 18, max: 120 },
});

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: authorSchema,
    pages: { type: Number, required: true, min: 1 },
    publicationDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= Date.now(),
            message: 'Publication date must be in the past',
        },
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        max: 1000,
    },
    format: {
        type: String,
        enum: ['hardcover', 'paperback', 'ebook'],
        required: true,
    },
});
module.exports = mongoose.model( 'BankAccount', BankAccountSchema);