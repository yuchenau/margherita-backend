const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    _id:{
        type:mongoose.Schema.Types.ObjectId,
        default:null
    },
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    nickName:{
        type:String,
    },
    phone:{
        type:String,
    },
    email:{
        type:String,
    },
    registerTime:{
        type:String,
    },
    // Relation with Collection Orders
    orders:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order'}],
}, {
    toJSON: {
        virtuals: true
    },
    id: false
});

schema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
})

const Model = mongoose.model('Customer', schema);
module.exports = Model;