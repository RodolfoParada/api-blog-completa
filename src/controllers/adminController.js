// src/controllers/adminController.js

exports.getStats = (req, res) => {
    // Lógica para obtener datos agregados de la DB
    const stats = {
        totalPosts: 125,
        totalUsers: 580,
        pendingComments: 15,
        mostLikedPost: { title: 'El post más votado', votes: 98 },
        postsPerCategory: [
            { name: 'Tecnología', count: 45 },
            { name: 'Viajes', count: 30 }
        ],
        traffic: { today: 1500, last7Days: 9500 }
    };

    res.json(stats);
};