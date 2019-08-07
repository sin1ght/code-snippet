import * as Sequelize  from 'sequelize';
import { config } from '../../config';
const User = require('./user');


class Category extends Sequelize.Model {}
Category.init({
	id:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true,
	},
	name:{
		type:Sequelize.STRING(20),
	}
}, {
	sequelize:config.db.sequelize,
	modelName: 'category'
});




User.hasMany(Category, {
	onDelete:'CASCADE',
	hooks:true,
});

Category.belongsTo(User);


module.exports = Category;