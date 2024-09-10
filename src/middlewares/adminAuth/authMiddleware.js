var jwt = require("jsonwebtoken");
const config = require("../../config/jwt");
const { jsonFailed } = require("../../utils");
const { Admin } = require("../../models/admin");
const Logger = require("../../utils/logger");
const blacklistedTokens = new Set();

let middleware = {
  auth:(req, res, next) => {
    //Do your session checking...
    //
    var tok =
      req.headers["access-token"] ||
      req.body["access-token"] ||
      req.headers.authorization ||
      req.header.Authorization;
    if (!tok) return jsonFailed(res, {}, "Access Denied, No token provided.", 403);
    else if (req.headers["access-token"]) {
      var token = tok.split(" ")[1];
    } else if (req.headers.authorization) {
      var token = tok.split(" ")[1];
    } else if (req.headers.Authorization) {
      var token = tok.split(" ")[1];
    } else {
      var token = tok;
    }
    if (!token) return jsonFailed(res, {}, "Access Denied, No token provided.", 403);
  
      if (blacklistedTokens.has(token)) {
        return jsonFailed(res, {},"Access Denied, No token provided.", 401);
    }
  
    jwt.verify(token, config.jwt_secret, (err, decoded) => {
      if (err) {
        Logger.error(err);
        return jsonFailed(res, {}, "Token Expired.", 403);
      }
      if(!decoded.isAdmin) {
        Logger.error(err);
        return jsonFailed(res, {}, "Unauthorized.", 403);
      }
      req.user = decoded;
      //
      next();
    });
  },
  
  unAuth: (req, res, next) => {
    var tok =
      req.headers["access-token"] ||
      req.body["access-token"] ||
      req.headers.authorization ||
      req.header.Authorization;
    if (!tok) return jsonFailed(res, {}, "Access Denied, No token provided.", 403);
    else if (req.headers["access-token"]) {
      var token = tok.split(" ")[1];
    } else if (req.headers.authorization) {
      var token = tok.split(" ")[1];
    } else if (req.headers.Authorization) {
      var token = tok.split(" ")[1];
    } else {
      var token = tok;
    }
    if (!token) return jsonFailed(res, {}, "Access Denied, No token provided.", 403);
  
      blacklistedTokens.add(token);
      req.session.destroy((err) => {
        if (err) {
          Logger.error(err);
          return jsonFailed(res, {}, "Unable to log out", 500);
        }
        next();
    });
  },

  // policy for CRUD function
policy1: async (req, res, next) => {
  const { id } = req.user;
  const getUser = await Admin.find({ _id: id });
  if(!getUser) {
    Logger.error(`user: ${id} permission not found`);
    return jsonFailed(res, {}, "User not found", 400);
  }
  if(getUser.permission !== 4) {
    Logger.error(`user: ${id} does not have permission for this action`);
    return jsonFailed(res, {}, "you do not have permission for this action", 400);
  }
  next();
},

// Policy for viewing, creating and updating
policy2: async (req, res, next) => {
  const { id } = req.user;
  const getUser = await Admin.find({ _id: id });
  if(!getUser) {
    Logger.error(`user: ${id} permission not found`);
    return jsonFailed(res, {}, "User not found", 400);
  }
  if(getUser.permission !== 3 && getUser.permission < 3) {
    Logger.error(`user: ${id} does not have permission for this action`);
    return jsonFailed(res, {}, "you do not have permission for this action", 400);
  }
  next();
},

// Policy for viewing and creating
policy3: async (req, res, next) => {
  const { id } = req.user;
  const getUser = await Admin.find({ _id: id });
  if(!getUser) {
    Logger.error(`user: ${id} permission not found`);
    return jsonFailed(res, {}, "User not found", 400);
  }
  if(getUser.permission !== 2 && getUser.permission < 2) {
    Logger.error(`user: ${id} does not have permission for this action`);
    return jsonFailed(res, {}, "you do not have permission for this action", 400);
  }
  next();
},

// Policy for viewing only
policy4: async (req, res, next) => {
  const { id } = req.user;
  const getUser = await Admin.find({ _id: id });
  if(!getUser) {
    Logger.error(`user: ${id} not found`);
    return jsonFailed(res, {}, "User not found", 400);
  }
  if(getUser.permission !== 1 && getUser.permission < 1) {
    Logger.error(`user: ${id} does not have permission for this action`);
    return jsonFailed(res, {}, "you do not have permission for this action", 400);
  }
  next();
}

};
module.exports = middleware;