import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const toDo = sequelize.define('todo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
})

export default toDo