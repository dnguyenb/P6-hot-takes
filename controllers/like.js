const Sauce = require('../models/Sauce');

// Les trois scénarios de la fonction 'like' : 1, 0, -1.
// on exporte ce middleware dans la route sauce.
exports.likeDislikeSauce = (req, res, next) => {
	const like = req.body.like;
	const userId = req.body.userId;
	const sauceId = req.params.id;

	// Recherche de la sauce par son id :
	Sauce.findOne({ _id: sauceId })
		.then((sauce) => {
			// LIKE :
			switch (like) {
				// +1 (like)
				case 1:
					sauce.likes += 1;
					sauce.usersLiked.push(userId);
					break;

				// ANNULATION LIKE OU DISLIKE quand on reclique :
				case 0:
					// Dans cette sauce, on vérifie que l'utilisateur existe déja dans le tableau usersliked ou usersDisliked :
					let userLike = sauce.usersLiked.find((id) => id === userId);
					let userDislike = sauce.usersDisliked.find((id) => id === userId);

					if (userLike) {
						// si l'utilisateur a déjà liké et qu'il like à nouveau pour annuler :
						sauce.likes -= 1;
						sauce.usersLiked = sauce.usersLiked.filter((id) => id !== userId);
					}
					if (userDislike) {
						// si l'ulitisateur a déjà disliké et qu'il dislike à nouveau pour annuler :
						sauce.dislikes -= 1;
						sauce.usersDisliked = sauce.usersDisliked.filter(
							(id) => id !== userId
						);
					}
					break;

				// DISLIKE :
				case -1:
					sauce.dislikes += 1;
					sauce.usersDisliked.push(userId);
			}
			// Enregistrement de la sauce :
			sauce
				.save()
				.then(() => res.status(201).json({ message: 'Avis enregistré !' }))
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
