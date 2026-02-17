import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const toDoItem = sequelize.define('toDoItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    toDoId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

export default toDoItem