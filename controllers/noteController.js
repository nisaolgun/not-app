const fs = require('fs');
const { authenticateJWT } = require('../middlewares/authMiddleware');

const readActivities = () => {
    if (fs.existsSync('activities.json')) {
        const data = fs.readFileSync('activities.json');
        return JSON.parse(data);
    }
    return [];
};

const writeActivities = (activities) => {
    fs.writeFileSync('activities.json', JSON.stringify(activities, null, 2));
};

const logActivity = (activity) => {
    const activities = readActivities();
    activities.push(activity);
    writeActivities(activities);
};

const readNotes = () => {
    if (fs.existsSync('notes.json')) {
        const data = fs.readFileSync('notes.json');
        return JSON.parse(data);
    }
    return [];
};

const writeNotes = (notes) => {
    fs.writeFileSync('notes.json', JSON.stringify(notes, null, 2));
};

exports.getNotes = (req, res) => {
    const { search, tag, category } = req.query;
    let notes = readNotes().filter(note => note.userId === req.user.id);

    if (search) {
        notes = notes.filter(note => note.content.toLowerCase().includes(search.toLowerCase()));
    }
    if (tag) {
        notes = notes.filter(note => note.tags.includes(tag));
    }
    if (category) {
        notes = notes.filter(note => note.category === category);
    }

    res.json(notes);
};

exports.createNote = (req, res) => {
    const notes = readNotes();
    const newNote = {
        id: notes.length + 1,
        content: req.body.content,
        tags: req.body.tags || [],
        category: req.body.category || '',
        comments: [],
        userId: req.user.id,
        linkedNotes: req.body.linkedNotes || [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    notes.push(newNote);
    writeNotes(notes);

    logActivity({
        userId: req.user.id,
        action: 'note_created',
        noteId: newNote.id,
        timestamp: new Date(),
    });

    res.status(201).json(newNote);
};

exports.updateNote = (req, res) => {
    const notes = readNotes();
    const noteId = parseInt(req.params.id);
    const noteIndex = notes.findIndex(note => note.id === noteId && note.userId === req.user.id);

    if (noteIndex === -1) {
        return res.status(404).send('Not bulunamadı veya erişim izni yok.');
    }

    notes[noteIndex] = {
        ...notes[noteIndex],
        content: req.body.content || notes[noteIndex].content,
        tags: req.body.tags || notes[noteIndex].tags,
        category: req.body.category || notes[noteIndex].category,
        linkedNotes: req.body.linkedNotes || notes[noteIndex].linkedNotes,
        updatedAt: new Date(),
    };

    writeNotes(notes);

    logActivity({
        userId: req.user.id,
        action: 'note_updated',
        noteId: noteId,
        timestamp: new Date(),
    });

    res.json(notes[noteIndex]);
};

exports.deleteNote = (req, res) => {
    const notes = readNotes();
    const noteId = parseInt(req.params.id);
    const noteIndex = notes.findIndex(note => note.id === noteId && note.userId === req.user.id);

    if (noteIndex === -1) {
        return res.status(404).send('Not bulunamadı veya erişim izni yok.');
    }

    notes.splice(noteIndex, 1);
    writeNotes(notes);

    logActivity({
        userId: req.user.id,
        action: 'note_deleted',
        noteId: noteId,
        timestamp: new Date(),
    });

    res.status(204).send();
};

exports.addComment = (req, res) => {
    const notes = readNotes();
    const noteId = parseInt(req.params.id);
    const noteIndex = notes.findIndex(note => note.id === noteId && note.userId === req.user.id);

    if (noteIndex === -1) {
        return res.status(404).send("Not bulunamadı veya erişim izni yok.");
    }

    const newComment = {
        user: req.user.username,
        comment: req.body.comment,
        likes: 0,
    };

    notes[noteIndex].comments.push(newComment);
    writeNotes(notes);
    res.status(201).json(newComment);
};

exports.updateComment = (req, res) => {
    const notes = readNotes();
    const noteId = parseInt(req.params.id);
    const noteIndex = notes.findIndex(note => note.id === noteId && note.userId === req.user.id);

    if (noteIndex === -1) {
        return res.status(404).send("Not bulunamadı veya erişim izni yok.");
    }

    const commentIndex = notes[noteIndex].comments.findIndex(c => c.user === req.user.username);

    if (commentIndex === -1) {
        return res.status(404).send("Yorum bulunamadı veya erişim izni yok.");
    }

    notes[noteIndex].comments[commentIndex].comment = req.body.comment || notes[noteIndex].comments[commentIndex].comment;
    writeNotes(notes);
    res.json(notes[noteIndex].comments[commentIndex]);
};

exports.deleteComment = (req, res) => {
    const notes = readNotes();
    const noteId = parseInt(req.params.id);
    const noteIndex = notes.findIndex(note => note.id === noteId && note.userId === req.user.id);

    if (noteIndex === -1) {
        return res.status(404).send("Not bulunamadı veya erişim izni yok.");
    }

    const commentIndex = notes[noteIndex].comments.findIndex(c => c.user === req.user.username);

    if (commentIndex === -1) {
        return res.status(404).send("Yorum bulunamadı.");
    }

    notes[noteIndex].comments.splice(commentIndex, 1);
    writeNotes(notes);
    res.status(204).send();
};

exports.likeComment = (req, res) => {
    const noteId = parseInt(req.params.id);
    const commentId = parseInt(req.params.commentId);
    const notes = readNotes();
    const noteIndex = notes.findIndex(note => note.id === noteId);

    if (noteIndex === -1) {
        return res.status(404).send('Not bulunamadı');
    }

    const commentIndex = notes[noteIndex].comments.findIndex(comment => comment.id === commentId);
    if (commentIndex === -1) {
        return res.status(404).send('Yorum bulunamadı');
    }

    notes[noteIndex].comments[commentIndex].likes = (notes[noteIndex].comments[commentIndex].likes || 0) + 1;
    writeNotes(notes);
    res.json(notes[noteIndex].comments[commentIndex]);
};

exports.addFavorite = (req, res) => {
    const notes = readNotes();
    const noteId = parseInt(req.params.id);
    const noteIndex = notes.findIndex(note => note.id === noteId && note.userId === req.user.id);

    if (noteIndex === -1) {
        return res.status(404).send('Not bulunamadı');
    }

    notes[noteIndex].isFavorite = true;  

    writeNotes(notes);
    res.json(notes[noteIndex]);
};

exports.getFavorites = (req, res) => {
    const notes = readNotes().filter(note => note.userId === req.user.id && note.isFavorite);
    res.json(notes);
};

exports.archiveNote = (req, res) => {
    const notes = readNotes();
    const noteId = parseInt(req.params.id);
    const noteIndex = notes.findIndex(note => note.id === noteId && note.userId === req.user.id);

    if (noteIndex === -1) {
        return res.status(404).send('Not bulunamadı');
    }

    notes[noteIndex].archived = true;
    writeNotes(notes);
    res.json(notes[noteIndex]);
};

exports.getArchivedNotes = (req, res) => {
    const notes = readNotes().filter(note => note.userId === req.user.id && note.archived);
    res.json(notes);
};

exports.getLinkedNotes = (req, res) => {
    const noteId = parseInt(req.params.id);
    const notes = readNotes();
    const note = notes.find(note => note.id === noteId && note.userId === req.user.id);

    if (!note) {
        return res.status(404).send('Not bulunamadı');
    }

    const linkedNotes = notes.filter(linkedNote => note.linkedNotes.includes(linkedNote.id));
    res.json(linkedNotes);
};

exports.restoreNote = (req, res) => {
    const notes = readNotes();
    const noteId = parseInt(req.params.id);
    const noteIndex = notes.findIndex(note => note.id === noteId && note.userId === req.user.id);

    if (noteIndex === -1) {
        return res.status(404).send('Not bulunamadı ');
    }
    notes[noteIndex].deleted = false;
    writeNotes(notes);
    res.json(notes[noteIndex]);

};

exports.getComments = (req, res) => {
    const notes = readNotes();
    const noteId = parseInt(req.params.id);
    const noteIndex = notes.findIndex(note => note.id === noteId && note.userId === req.user.id);

    if (noteIndex === -1) {
        return res.status(404).send('not bulunamadı');

    }
    res.json(notes[noteIndex].comments);
};

exports.getNotesByTag = (req, res) => {
    const tag = req.params.tag;
    const notes = readNotes().filter(note => note.userId === req.user.id && note.tags.includes(tag));
    
    res.json(notes);
};
exports.searchNotes =(req,res) => {
    const {query} =req.query;
    const notes = readNotes().filter(note => note.userId === req.user.id);
    const filteredNotes = notes.filter (note => 
        note.content.toLowerCase().includes(query.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        note.category.toLowerCase().includes(query.toLowerCase())
    );
    res.json(filteredNotes);
};

