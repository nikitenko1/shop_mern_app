# General Features

#### Admin && Customer interface

### Main technology used to built this application are listed below:

#### State: Redux Toolkits

#### Tailwind CSS

#### Sendgrid (email service)

#### MongoDB Cloud Atlas: Aggregation pipelines ($search: {index: 'product'})

#### "product" for Blog.products

{
"mappings": {
"dynamic": false,
"fields": {
"name": [
{
"dynamic": true,
"type": "document"
},
{
"maxGrams": 7,
"minGrams": 3,
"type": "autocomplete"
}
]
}
}
}


