const renderIndexPage = (req, res) => {
    res.render('index', { title: 'Inventory App' });
}

module.exports = {
    renderIndexPage
};