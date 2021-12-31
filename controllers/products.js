const { geoSearch } = require('../models/Product');
const Product = require('../models/Product')

const getAllProductsStatic = async (req, res) => {
    throw new Error('testing async error')
    res.status(200).json({msg: 'products testing route'})
}

const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, fields,numericFilters } = req.query
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
    if(numericFilters){
        const operatorMap = {
					">": "$gt",
					">=": "$gte",
					"=": "$eq",
					"<": "$lt",
					"<=": "$lte",
				};
                const regEx = /\b(<|>|>=|=|<|<=)\b/g
                let filters = numericFilters.replace(regEx,(match) => `-${operatorMap[match]}-`)
                const options = ['price','rating'];
                filters = filters.split(',').forEach((item) => {
                    const [field, operator, value] = item.split('-')
                    if (options.includes(field)){
                        queryObject[field] = { [operator]: Number(value)}
                    }
                })
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
    //limit
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    result = result.skip(skip).limit(limit)


    const products = await result
	res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
    getAllProducts,
    getAllProductsStatic,
}