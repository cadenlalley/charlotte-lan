// Render landing page of site
exports.index = (req, res) => {
	res.render('index');
};

// Render contact page of site
exports.contact = (req, res) => {
	res.render('contact');
};

// Render about page of site
exports.about = (req, res) => {
	res.render('about');
};
