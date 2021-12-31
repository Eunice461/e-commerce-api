const { geoSearch } = require('../models/Product');
const Product = require('../models/Product')

const getAllProductsStatic = async (req, res) => {
    throw new Error('testing async error')
    res.status(200).json({msg: 'products testing route'})
}

const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, fields } = req.query
    queryObject = {};

    if(featured){
        queryObject.featured = featured === 'true'? true : false
    }
    if(company){
        queryObject.company = company
    }
    if(name){
        queryObject.name = {$regex: name, $options: 'i'}
    }

    let result = Product.find(queryObject)
    //SORT
    if (sort){
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }
    else{
        result = result.sort('createAt')
    }
    //FIELDS
    if (fields){
        const fieldsList = fields.split(",").join(" ");
		result = result.select(fieldsList);
    }
    const products = await result
	res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
    getAllProducts,
    getAllProductsStatic,
}