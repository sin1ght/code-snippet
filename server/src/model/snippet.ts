import * as Sequelize  from 'sequelize';
import moment = require('moment');
import { config } from '../../config';
const Category = require('./category');
const User = require('./user');


class Snippet extends Sequelize.Model {}
Snippet.init({
	id:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true,
	},
	title:{
		type:Sequelize.STRING,
	},
	tags:{
		type:Sequelize.STRING,
	},
	content:{
		type:Sequelize.STRING,
	},
	link:{
		type:Sequelize.STRING, //分享链接
	},
	createdAt:{
		type:Sequelize.DATE,
		get(){
			return moment(this.getDataValue('createdAt')).format('');
		}
	}
}, {
	sequelize:config.db.sequelize,
	modelName: 'Snippet'
});




Category.hasMany(Snippet, {
	onDelete:'CASCADE',
	hooks:true,
});
Snippet.belongsTo(Category);

User.hasMany(Snippet, {
	onDelete:'CASCADE',
	hooks:true,
});
Snippet.belongsTo(User);


module.exports = Snippet;