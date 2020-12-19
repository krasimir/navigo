function packageExists(packageName) {
    try {
        require(packageName);
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = {
    packageExists,
};
