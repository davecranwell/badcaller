import mongoose, { Model, Schema, Document } from 'mongoose'

interface PhoneNumberAttrs {
  number: string
  rating: string
}

interface PhoneNumberModel extends Model<PhoneNumberDoc> {
  build(attrs: PhoneNumberAttrs): PhoneNumberDoc
}

interface PhoneNumberDoc extends Document {
  number: string
  rating: string
}

const phoneNumberSchema = new Schema(
  {
    number: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      },
    },
  }
)

// numberSchema.pre('save', async function (done) {
//   if (this.isModified('password')) {
//     const hashed = await Password.toHash(this.get('password'))
//     this.set('password', hashed)
//   }
//   done()
// })

phoneNumberSchema.statics.build = (attrs: PhoneNumberAttrs) => {
  return new PhoneNumber(attrs)
}

const PhoneNumber = mongoose.model<PhoneNumberDoc, PhoneNumberModel>(
  'PhoneNumber',
  phoneNumberSchema
)

export { PhoneNumber }
