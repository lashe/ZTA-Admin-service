const { jsonFailed, jsonS } = require("../../utils");
const { addAdmin, addPermission, getAnAdmin, getAllAdmin, updateAdminPermission, getAllUsers } = require("./adminServices")

let controller = {

    // Add an admin
    addAnAdmin: async (req, res) => {
        const createAdmin = await addAdmin(req.body);
        if(!createAdmin) return jsonFailed(res, {}, "Error adding admin");
        return jsonS(res, 200, "successful");
    },

    // get an admin by the id
    fetchAdminById: async (req, res) => {
        const { id } = req.params;
        const fetch = await getAnAdmin(id);
        if(!fetch) return jsonFailed(res, {}, "admin not found", 404);
        return jsonS(res, 200, "successful", fetch);
    },

    // get all admins
    fetchAllAdmins: async (req, res) => {
        const query = req.query;
        const fetch = await getAllAdmin(query);
        if(!fetch) return jsonFailed(res, {}, "admin not found", 404);
        return jsonS(res, 200, "successful", fetch);
    },

    // update permission for an admin by the admin id
    updatePermissionsForAdminById: async (req, res) => {
        const { id } = req.params;
        const update = await updateAdminPermission(req.body);
        if(!update) return jsonFailed(res, {}, `Error updating permission for user: ${id}`);
        return jsonS(res, 200, "successful");
    },

    // get all users
    fetchAllUser: async (req, res) => {
        const query = req.query;
        const fetch = await getAllUsers(query);
        if(!fetch) return jsonFailed(res, {}, "admin not found", 404);
        return jsonS(res, 200, "successful", fetch);
    },

    // add permissions for a user
    addUserPermission: async (req, res) => {
        const addPerm = await addPermission(req.body);
        if(!addPerm) return jsonFailed(res, {}, "Error adding permission");
        return jsonS(res, 200, "successful");
    }
}

module.exports = controller;