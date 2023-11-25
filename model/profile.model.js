const { Schema, model } = require("mongoose");

const profileschema = new Schema({
    user_id: {
        type: Number,
        required: true,
        unique:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength:100,
    },
    password: {
        type: String,
        default:""
        
    },
    name: {
        type: String,
        default: "",
        maxlength:100
        
    },
    category: {
        type: String,
        enum:["Admin","Superuser","user"]
    },
    profileimage :{
    type: String,
    default:"",
    },
    mobile: {
        type: String,
        default:""
        
    },
    expiretime: {
        type:Date,
    }
   

    
}, {
    timestamps: true
})

module.exports = model("Profile", profileschema);