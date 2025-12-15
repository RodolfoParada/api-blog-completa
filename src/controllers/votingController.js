// src/controllers/votingController.js
// Simulación de almacenamiento de votos: { postId: { upvotes: 10, downvotes: 2 } }
const votes = {}; 

const registerVote = (type, entityId, entityType, userId) => {
    // Lógica compleja: verificar que el usuario no haya votado antes, 
    // actualizar el contador en la DB y registrar el voto.
    console.log(`${userId} votó ${type} en ${entityType}:${entityId}`);
    
    votes[entityId] = votes[entityId] || { upvotes: 0, downvotes: 0 };
    if (type === 'up') votes[entityId].upvotes++;
    if (type === 'down') votes[entityId].downvotes++;

    return votes[entityId];
};

exports.votePost = (req, res) => {
    const { id } = req.params;
    const { type } = req.body; // 'up' o 'down'
    const userId = req.user.id; // Asumimos que el user ID viene del token
    
    const currentVotes = registerVote(type, id, 'post', userId);
    res.status(200).json({ postId: id, votes: currentVotes });
};

exports.voteComment = (req, res) => {
    const { id } = req.params;
    const { type } = req.body; // 'up' o 'down'
    const userId = req.user.id;
    
    const currentVotes = registerVote(type, id, 'comment', userId);
    res.status(200).json({ commentId: id, votes: currentVotes });
};