const { DB, singleDB } = require("./db.model");
const logger = require('../middlewares/logger.middleware');
// CREATE

const createUser = async (userData) => {
    try {
        const query = `INSERT INTO users SET ?`;
        const response = await DB(query, userData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};

// REQUEST

const requestUsers = async (userID) => {
    try {
        const query = `
            SELECT 
                userID, avatarImage, isAdmin, isSpec,
                CONCAT(users.name, ' ', users.surname) as user,
                IF (googleID IS NOT NULL, 1, 0) as isGoogle, 
                IF (facebookID IS NOT NULL, 1, 0) as isFacebook
            FROM users
        `;
        return { users: await DB(query, [userID]) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

const requestUser = async (userID) => {
    try {
        const query = `
            SELECT 
                *, YEAR(membership) as year, 
                IF (ISNULL(avatarImage), false, true) as isAvatarExist,
                CONCAT(users.name, ' ', users.surname) as user
            FROM users WHERE userID = ?
        `;
        return { profile: await singleDB(query, [userID]) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

const requestUserData = async (userID) => {
    try {
        const query = `
            SELECT * FROM users WHERE userID = ?
        `;
        return { user: await singleDB(query, [userID]) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

const requestAuthorize = async (mail) => {
    try {
        const query = `SELECT userID, password, salt FROM users WHERE mail = ?`;
        return { ...(await singleDB(query, [mail])) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

const checkMail = async (mail) => {
    try {
        const query = `SELECT userID FROM users WHERE mail = ?`;
        return { ...(await singleDB(query, [mail])) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
}

const requestFacebookAuthorize = async (facebookID) => {
    try {
        const query = `SELECT userID FROM users WHERE facebookID = ?`;
        const userData = await singleDB(query, [facebookID]);
        return { ...userData };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

const requestGoogleAuthorize = async (googleID) => {
    try {
        const query = `SELECT userID FROM users WHERE googleID = ?`;
        const userData = await singleDB(query, [googleID]);
        return { ...userData };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

// UPDATE

const updateUser = async ({ userID, ...updateData }) => {
    try {
        const query = `UPDATE users SET ? WHERE userID = ?`;
        const response = await DB(query, [updateData, userID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(userID) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};

// DELETE

const deleteUser = async (userID) => {
    try {
        const query = `DELETE FROM users WHERE userID = ?`;
        const response = await DB(query, [userID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(userID) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};

module.exports = {
    createUser, requestUsers, requestUser, requestUserData, requestAuthorize, checkMail,
    requestFacebookAuthorize, requestGoogleAuthorize, updateUser, deleteUser
};