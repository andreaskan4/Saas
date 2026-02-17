import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType } from 'docx'
import fs from 'fs'

function heading(text, level = HeadingLevel.HEADING_1) {
    return new Paragraph({ heading: level, spacing: { before: 300, after: 100 }, children: [new TextRun({ text, bold: true })] })
}

function text(content, { bold = false, italic = false } = {}) {
    return new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: content, bold, italic })] })
}

function bullet(content) {
    return new Paragraph({ bullet: { level: 0 }, spacing: { after: 40 }, children: [new TextRun(content)] })
}

function code(content) {
    return new Paragraph({
        spacing: { after: 40 },
        indent: { left: 400 },
        children: [new TextRun({ text: content, font: 'Consolas', size: 20 })]
    })
}

function tableCell(content, { bold = false, shading } = {}) {
    const opts = {
        width: { size: 33, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ children: [new TextRun({ text: content, bold, size: 20 })] })]
    }
    if (shading) opts.shading = shading
    return new TableCell(opts)
}

function headerCell(content) {
    return tableCell(content, { bold: true, shading: { fill: '4472C4', color: 'FFFFFF' } })
}

function endpointBlock(method, path, description) {
    return new Paragraph({
        spacing: { before: 120, after: 40 },
        children: [
            new TextRun({ text: `${method} `, bold: true, color: method === 'GET' ? '22863A' : method === 'POST' ? '0550AE' : method === 'PUT' ? 'BF8700' : 'CF222E', font: 'Consolas', size: 22 }),
            new TextRun({ text: path, font: 'Consolas', size: 22 }),
            new TextRun({ text: `  -  ${description}`, italics: true, size: 22 }),
        ]
    })
}

const doc = new Document({
    styles: {
        default: {
            document: { run: { font: 'Calibri', size: 24 } }
        }
    },
    sections: [{
        properties: {},
        children: [
            // Title
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 100 },
                children: [new TextRun({ text: 'Express.js To-Do API', bold: true, size: 52, color: '2E74B5' })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
                children: [new TextRun({ text: 'Εγχειρίδιο Χρήσης', size: 32, color: '595959', italics: true })]
            }),

            // 1. Περιγραφή
            heading('1. Περιγραφή Εφαρμογής'),
            text('Η εφαρμογή είναι ένα REST API για διαχείριση εργασιών (To-Do) με σύστημα αυθεντικοποίησης χρηστών. Αναπτύχθηκε με Express.js, SQLite βάση δεδομένων και Sequelize ORM.'),
            text('Βασικές δυνατότητες:', { bold: true }),
            bullet('Εγγραφή και σύνδεση χρηστών (signup/login/logout)'),
            bullet('Δημιουργία, ανάγνωση, ενημέρωση και διαγραφή λιστών εργασιών (Todos)'),
            bullet('Δημιουργία, ανάγνωση, ενημέρωση και διαγραφή επιμέρους εργασιών (Todo Items)'),
            bullet('Interactive API documentation μέσω Swagger UI'),

            // 2. Εγκατάσταση
            heading('2. Εγκατάσταση & Εκκίνηση'),
            text('Προαπαιτούμενα:', { bold: true }),
            bullet('Node.js (v14 ή νεότερη έκδοση)'),
            bullet('npm (Node Package Manager)'),
            text('Βήματα εγκατάστασης:', { bold: true }),
            code('git clone <repository-url>'),
            code('cd Express'),
            code('npm install'),
            code('npm start'),
            text('Ο server θα ξεκινήσει στο http://localhost:8000'),
            text('Το Swagger UI είναι διαθέσιμο στο http://localhost:8000/api-docs'),

            // 3. Τεχνολογίες
            heading('3. Τεχνολογίες'),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [headerCell('Τεχνολογία'), headerCell('Έκδοση'), headerCell('Ρόλος')] }),
                    new TableRow({ children: [tableCell('Express.js'), tableCell('^5.2.1'), tableCell('Web framework')] }),
                    new TableRow({ children: [tableCell('Sequelize'), tableCell('^6.37.7'), tableCell('ORM βάσης δεδομένων')] }),
                    new TableRow({ children: [tableCell('SQLite3'), tableCell('^5.1.7'), tableCell('Βάση δεδομένων')] }),
                    new TableRow({ children: [tableCell('swagger-jsdoc'), tableCell('latest'), tableCell('Δημιουργία OpenAPI spec')] }),
                    new TableRow({ children: [tableCell('swagger-ui-express'), tableCell('latest'), tableCell('Swagger UI interface')] }),
                ]
            }),

            // 4. API Endpoints
            heading('4. API Endpoints'),

            heading('4.1 Αυθεντικοποίηση (Auth)', HeadingLevel.HEADING_2),
            endpointBlock('POST', '/signup', 'Δημιουργία νέου χρήστη'),
            text('Request body: { "name": "username", "password": "mypassword" }'),
            endpointBlock('POST', '/auth/login', 'Σύνδεση χρήστη'),
            text('Request body: { "name": "username", "password": "mypassword" }'),
            endpointBlock('GET', '/auth/logout', 'Αποσύνδεση χρήστη'),

            heading('4.2 Todos', HeadingLevel.HEADING_2),
            endpointBlock('GET', '/todos', 'Λίστα όλων των todos με τα items τους'),
            endpointBlock('POST', '/todos', 'Δημιουργία νέου todo'),
            text('Request body: { "content": "Τίτλος todo" }'),
            endpointBlock('GET', '/todos/:id', 'Ανάκτηση todo βάσει ID'),
            endpointBlock('PUT', '/todos/:id', 'Ενημέρωση τίτλου todo'),
            text('Request body: { "title": "Νέος τίτλος" }'),
            endpointBlock('DELETE', '/todos/:id', 'Διαγραφή todo (και των items του)'),

            heading('4.3 Todo Items', HeadingLevel.HEADING_2),
            endpointBlock('POST', '/todos/:id/items', 'Δημιουργία item σε todo'),
            text('Request body: { "content": "Περιεχόμενο item" }'),
            endpointBlock('GET', '/todos/:id/items/:iid', 'Ανάκτηση item βάσει ID'),
            endpointBlock('PUT', '/todos/:id/items/:iid', 'Ενημέρωση item'),
            text('Request body: { "content": "Νέο περιεχόμενο", "completed": true }'),
            endpointBlock('DELETE', '/todos/:id/items/:iid', 'Διαγραφή item'),

            // 5. Μοντέλα
            heading('5. Μοντέλα Δεδομένων'),

            heading('User', HeadingLevel.HEADING_2),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [headerCell('Πεδίο'), headerCell('Τύπος'), headerCell('Περιορισμοί')] }),
                    new TableRow({ children: [tableCell('id'), tableCell('INTEGER'), tableCell('Primary Key, Auto Increment')] }),
                    new TableRow({ children: [tableCell('name'), tableCell('STRING'), tableCell('Not Null')] }),
                    new TableRow({ children: [tableCell('password'), tableCell('STRING'), tableCell('Not Null')] }),
                ]
            }),

            heading('Todo', HeadingLevel.HEADING_2),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [headerCell('Πεδίο'), headerCell('Τύπος'), headerCell('Περιορισμοί')] }),
                    new TableRow({ children: [tableCell('id'), tableCell('INTEGER'), tableCell('Primary Key, Auto Increment')] }),
                    new TableRow({ children: [tableCell('title'), tableCell('STRING'), tableCell('Not Null, Unique')] }),
                ]
            }),

            heading('TodoItem', HeadingLevel.HEADING_2),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [headerCell('Πεδίο'), headerCell('Τύπος'), headerCell('Περιορισμοί')] }),
                    new TableRow({ children: [tableCell('id'), tableCell('INTEGER'), tableCell('Primary Key, Auto Increment')] }),
                    new TableRow({ children: [tableCell('content'), tableCell('STRING'), tableCell('Not Null')] }),
                    new TableRow({ children: [tableCell('completed'), tableCell('BOOLEAN'), tableCell('Default: false')] }),
                    new TableRow({ children: [tableCell('toDoId'), tableCell('INTEGER'), tableCell('Foreign Key -> Todo.id')] }),
                ]
            }),

            text(''),
            text('Σχέσεις: Ένα Todo έχει πολλά TodoItems (one-to-many). Διαγραφή Todo διαγράφει αυτόματα τα Items του (CASCADE).', { bold: true }),

            // 6. Swagger
            heading('6. Swagger UI'),
            text('Η εφαρμογή παρέχει interactive API documentation μέσω Swagger UI.'),
            text('Μετά την εκκίνηση του server, ανοίξτε τον browser στη διεύθυνση:'),
            code('http://localhost:8000/api-docs'),
            text('Από εκεί μπορείτε να δείτε όλα τα endpoints, τα schemas, και να δοκιμάσετε κάθε request απευθείας από τον browser.'),

            // Footer
            text(''),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 400 },
                children: [new TextRun({ text: 'Συγγραφέας: vaggelis  |  License: ISC', color: '808080', italics: true })]
            }),
        ]
    }]
})

const buffer = await Packer.toBuffer(doc)
fs.writeFileSync('Εγχειρίδιο_Χρήσης_API.docx', buffer)
console.log('Word document created: Εγχειρίδιο_Χρήσης_API.docx')
