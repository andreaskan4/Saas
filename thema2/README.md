# Express.js To-Do Application

Απαλλακτική εργασία στο μάθημα Υπολογιστικό Λογισμικό

## Περιγραφή

REST API εφαρμογή διαχείρισης εργασιών (To-Do) με σύστημα αυθεντικοποίησης χρηστών. Χρησιμοποιεί Express.js, SQLite βάση δεδομένων και Sequelize ORM.

## Δομή Project

```
Express/
├── config/
│   └── database.js        # Ρυθμίσεις σύνδεσης SQLite
├── models/
│   ├── index.js            # Σχέσεις μοντέλων (toDo ↔ toDoItem)
│   ├── toDo.js             # Μοντέλο Todo
│   ├── toDoItem.js         # Μοντέλο TodoItem
│   └── user.js             # Μοντέλο User
├── routes/
│   ├── auth.js             # Routes αυθεντικοποίησης (signup, login, logout)
│   ├── todo.js             # CRUD routes για todos
│   └── todoItem.js         # CRUD routes για todo items
├── state.js                # Global state (login status)
├── database.db             # SQLite βάση δεδομένων
├── server.js               # Κεντρικό αρχείο εφαρμογής
├── package.json
└── package-lock.json
```

## Προαπαιτούμενα

- Node.js (v14 ή νεότερη έκδοση)
- npm (Node Package Manager)

## Εγκατάσταση

1. **Κλωνοποίηση του repository**
   ```bash
   git clone <repository-url>
   cd Express
   ```

2. **Εγκατάσταση dependencies**
   ```bash
   npm install
   ```

3. **Εκκίνηση του server**
   ```bash
   npm start
   ```

   Ο server θα τρέξει στο `http://localhost:8000`

## Dependencies

- **express** (^5.2.1) - Web framework
- **sequelize** (^6.37.7) - ORM για βάση δεδομένων
- **sqlite3** (^5.1.7) - SQLite database driver

## API Endpoints

### Αυθεντικοποίηση (Auth)

#### POST /signup
Δημιουργία νέου χρήστη.

**Request Body:**
```json
{
  "name": "username",
  "password": "mypassword"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "username",
  "password": "mypassword",
  "createdAt": "2025-01-05T00:00:00.000Z",
  "updatedAt": "2025-01-05T00:00:00.000Z"
}
```

#### POST /auth/login
Σύνδεση χρήστη.

**Request Body:**
```json
{
  "name": "username",
  "password": "mypassword"
}
```

**Response (200):**
```json
{
  "message": "Welcome back username!",
  "user": { "id": 1, "name": "username", "..." : "..." }
}
```

**Error Responses:**
- `404` - Ο χρήστης δεν βρέθηκε
- `401` - Λάθος κωδικός
- `201` - Ο χρήστης είναι ήδη συνδεδεμένος

#### GET /auth/logout
Αποσύνδεση χρήστη.

**Response (201):**
```json
{
  "message": "User logged out"
}
```

---

### Todos

#### GET /todos
Επιστρέφει όλα τα todos μαζί με τα items τους.

**Response (201):**
```json
[
  {
    "id": 1,
    "title": "Αγορές",
    "toDoItems": [
      { "id": 1, "content": "Γάλα", "completed": false, "toDoId": 1 }
    ]
  }
]
```

#### POST /todos
Δημιουργία νέου todo.

**Request Body:**
```json
{
  "content": "Τίτλος του todo"
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "Τίτλος του todo",
  "createdAt": "2025-01-05T00:00:00.000Z",
  "updatedAt": "2025-01-05T00:00:00.000Z"
}
```

#### GET /todos/:id
Επιστρέφει ένα συγκεκριμένο todo βάσει ID.

**Response (201):** Το todo object

**Error (404):**
```json
{ "error": "Todo not found" }
```

#### PUT /todos/:id
Ενημέρωση τίτλου ενός todo.

**Request Body:**
```json
{
  "title": "Νέος τίτλος"
}
```

**Response (200):** Το ενημερωμένο todo object

#### DELETE /todos/:id
Διαγραφή todo (και των items του λόγω CASCADE).

**Response (200):**
```json
{ "message": "Todo deleted" }
```

---

### Todo Items

Τα items ανήκουν σε ένα todo και η πρόσβαση γίνεται μέσω nested routes.

#### POST /todos/:id/items
Δημιουργία νέου item μέσα σε ένα todo.

**Request Body:**
```json
{
  "content": "Περιεχόμενο item"
}
```

**Response (201):**
```json
{
  "id": 1,
  "content": "Περιεχόμενο item",
  "completed": false,
  "toDoId": 1,
  "createdAt": "2025-01-05T00:00:00.000Z",
  "updatedAt": "2025-01-05T00:00:00.000Z"
}
```

#### GET /todos/:id/items/:iid
Επιστρέφει ένα συγκεκριμένο item βάσει ID.

**Response (201):** Το item object

**Error (404):**
```json
{ "error": "Todo ITEM with id of 1 not found inside todo with an id of 2" }
```

#### PUT /todos/:id/items/:iid
Ενημέρωση ενός item (content, completed, toDoId).

**Request Body:**
```json
{
  "content": "Νέο περιεχόμενο",
  "completed": true
}
```

**Response (200):** Το ενημερωμένο item object

#### DELETE /todos/:id/items/:id
Διαγραφή ενός item.

**Response (200):**
```json
{ "message": "Todo ITEM deleted" }
```

## Μοντέλα Δεδομένων

### User
| Πεδίο | Τύπος | Περιορισμοί |
|-------|-------|-------------|
| id | INTEGER | Primary Key, Auto Increment |
| name | STRING | Not Null |
| password | STRING | Not Null |
| createdAt | DATE | Auto |
| updatedAt | DATE | Auto |

### toDo
| Πεδίο | Τύπος | Περιορισμοί |
|-------|-------|-------------|
| id | INTEGER | Primary Key, Auto Increment |
| title | STRING | Not Null, Unique |
| createdAt | DATE | Auto |
| updatedAt | DATE | Auto |

### toDoItem
| Πεδίο | Τύπος | Περιορισμοί |
|-------|-------|-------------|
| id | INTEGER | Primary Key, Auto Increment |
| content | STRING | Not Null |
| completed | BOOLEAN | Default: false |
| toDoId | INTEGER | Not Null (Foreign Key -> toDo.id) |
| createdAt | DATE | Auto |
| updatedAt | DATE | Auto |

**Σχέσεις:**
- Ένα `toDo` έχει πολλά `toDoItem` (one-to-many)
- Διαγραφή `toDo` διαγράφει αυτόματα τα `toDoItem` του (CASCADE delete)

## Configuration

Η βάση δεδομένων ρυθμίζεται στο `config/database.js`:
- **Dialect:** SQLite
- **Storage:** `./database.db` (στο root του project)
- **Logging:** Disabled

## Scripts

```bash
npm start    # Εκκίνηση server (node server.js)
```

## Συγγραφέας

vaggelis

## License

ISC
