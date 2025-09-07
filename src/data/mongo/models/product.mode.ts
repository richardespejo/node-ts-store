import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({

    name: {
        type: String,
        required: [true , "Name is required"]
    },
    available: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0
    },
    description: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
    
});

productSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform(doc, ret, options) {
        delete ret.__v;
        delete ret._id;
    },
});



export const ProductModel = mongoose.model('Product', productSchema);