const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { Admin } = require("../../models/admin");
const { Permission } = require("../../models/permission");
const { User } = require("../../models/users");


const addAdmin = async(body) => {
    const { name, username, role, permission } = body;
    let password = crypto.randomBytes(10).toString('hex');
    const hashedPassword = bcrypt.hashSync(password, 8);
    const createAdmin  = await Admin.create({
        _id: uuidv4(),
        name: name,
        username: username,
        role: role,
        permission: permission,
        password: hashedPassword
    });
    if (!createAdmin) return false;
    return true;
    
};

const addPermission = async(body) => {
    const { userId, role, permission } = body;
    const isExist = await Permission.findOne({ userId: userId });
    if(!isExist) {
        const createPermission  = await Permission.create({
            _id: uuidv4(),
            userId: userId,
            role: role,
            permission: permission,
        });
        if (!createPermission) return false;
        return true;
    }
    const updatePermission  = await Permission.update(
        {_id: isExist.id},
        {
        role: role,
        permission: permission,
    });
    if (!updatePermission) return false;
    return true;
    
};

const getAnAdmin = async (id) => {
    try {
        const fetchAdmin = await Admin.find({ _id: id });
        if (!fetchAdmin) return null;
        return fetchAdmin;
    } catch (error) {
        Logger.error(error);
        return null;
    }
};

const updateAdminPermission = async(body) => {
    const { userId, role, permission } = body;
    const isExist = await Admin.findOne({ _id: userId });
    if(!isExist) return false;
    const updatePermission  = await Admin.update(
        {_id: isExist.id},
        {
        role: role,
        permission: permission,
    });
    if (!updatePermission) return false;
    return true;
    
};

const getAllAdmin = async (query) => {
    try {
        let page = parseInt(query.page) || 1;
        let limit = parseInt(query.limit) || 10;
        const listCount = await Admin.countDocuments();
        if (!listCount) return null;
        let pages = Math.ceil(listCount / limit);
        let skip = limit * (page - 1) || 0;
        const fetchAdmins = await Admin.find()
        .limit(limit)
        .skip(skip);
        if (!fetchAdmins) return null;
        let response ={
            page,
            pages,
            skip,
            admins: fetchAdmins
          };
        return response;
    } catch (error) {
        Logger.error(error);
        return null;
    }
};

const getAllUsers = async (query) => {
    try {
        let page = parseInt(query.page) || 1;
        let limit = parseInt(query.limit) || 10;
        const listCount = await User.countDocuments();
        if (!listCount) return null;
        let pages = Math.ceil(listCount / limit);
        let skip = limit * (page - 1) || 0;
        const fetchUsers = await User.find()
        .limit(limit)
        .skip(skip);
        if (!fetchUsers) return null;
        let response ={
            page,
            pages,
            skip,
            users: fetchUsers
          };
        return response;
    } catch (error) {
        Logger.error(error);
        return null;
    }
}

module.exports = {
    addAdmin,
    addPermission,
    updateAdminPermission,
    getAllAdmin,
    getAllUsers,
    getAnAdmin
}