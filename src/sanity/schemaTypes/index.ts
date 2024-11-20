import { type SchemaTypeDefinition } from 'sanity'
import productSchema from './Poducts' // Adjust the path to your product schema file

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productSchema],
}
