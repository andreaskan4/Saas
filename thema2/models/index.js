import toDo from './toDo.js'
import toDoItem from './toDoItem.js'
import user from './user.js'

// Ένα Todo έχει πολλά Items
toDo.hasMany(toDoItem, {
    foreignKey: 'todoId',
    onDelete: 'CASCADE'  // διαγράφει τα items όταν διαγραφεί το todo
})

toDoItem.belongsTo(toDo, {
    foreignKey: 'todoId'
})

export { toDo, toDoItem, user };