import * as Sequelize  from 'sequelize';
import path = require('path');
import { config } from '../config';



const user = require('../src/model/user');
const category = require('../src/model/category');
const snippet = require('../src/model/snippet');



user.sync({
	force:true,
});
category.sync({
	force:true,
});

snippet.sync({
	force:true,
});