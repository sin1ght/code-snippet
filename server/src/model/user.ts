import * as Sequelize  from 'sequelize';
import { config } from '../../config';

class User extends Sequelize.Model {}
User .init({
	id:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true,
	},
	avatar:{
		type:Sequelize.STRING,
		defaultValue:'img/avatar.jpg',
	},
	email:{
		type:Sequelize.STRING,
	},
	passwd:{
		type:Sequelize.STRING,
	}
}, {
	sequelize:config.db.sequelize,
	modelName:'user'
});

module.exports = User;