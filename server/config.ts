import path = require('path');
import * as Sequelize  from 'sequelize';

const dbPath = path.resolve(__dirname, 'data.sqlite');

const sequelize = new Sequelize.Sequelize({
	dialect: 'sqlite',
	storage: dbPath
});

export const config = {
	db:{
		path:dbPath,
		sequelize
	}
};