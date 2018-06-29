module.exports = function getEnsureSameUser() {
    return (req, res, next) => {
        if(req.user.id !== req.params.id) {
            next({
                code: 403,
                error: 'Must Be Authorized User'
            });
        }
        else next();
    };
};
