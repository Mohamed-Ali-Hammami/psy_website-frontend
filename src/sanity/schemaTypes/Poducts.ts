import { defineField, defineType, type SchemaTypeDefinition } from 'sanity';

const productSchema: SchemaTypeDefinition = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
    }),
    defineField({
      name: 'discountPrice',
      title: 'Discount Price',
      type: 'number',
      description: 'If the product is on sale, set a discounted price',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true, // Allows better image cropping
      },
    }),
    defineField({
      name: 'pdfFile',
      title: 'Product PDF',
      type: 'file',
      description: 'Upload a PDF file that users can download.',
      options: {
        accept: '.pdf', // Restrict file uploads to PDFs only
      },
    }),
  ],
});

// Export the schema
export default productSchema;
